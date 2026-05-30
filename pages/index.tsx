import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

type Msg = { id: string; role: 'user' | 'assistant' | 'tool'; content: string; ts?: number };

const STORAGE_KEY = 'agent_demo_state_v1';

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  // Initialize threadId as empty on the server to avoid hydration mismatch.
  const [threadId, setThreadId] = useState<string>('');
  const chatRef = useRef<HTMLDivElement | null>(null);
  const lastPayloadRef = useRef<any>(null);

  useEffect(() => { // hydrate messages from localStorage
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        if (parsed.messages) setMessages(parsed.messages);
      }
    } catch {}
    // scroll
    scrollToBottom();
  }, []);

  // Set or generate the threadId only on the client after mount.
  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      let id = '';
      if (s) id = JSON.parse(s).threadId || '';
      if (!id) id = 'user-' + Math.random().toString(36).slice(2, 9);
      setThreadId(id);
    } catch {
      setThreadId('user-' + Math.random().toString(36).slice(2, 9));
    }
  }, []);

  useEffect(() => { // persist
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ threadId, messages }));
    } catch {}
  }, [threadId, messages]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  function addMessage(m: Msg) { setMessages((s) => [...s, m]); }

  function scrollToBottom() { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }

  async function callAgent(payload: any) {
    lastPayloadRef.current = payload;
    setSending(true);
    try {
      const res = await axios.post('/api/agent', payload, { timeout: 30000 });
      const out = res.data?.messages ?? [];
      for (const m of out) {
        addMessage({ id: String(Math.random()), role: m.role as any, content: m.content, ts: Date.now() });
      }
    } catch (err: any) {
      addMessage({ id: 'err-' + Date.now(), role: 'assistant', content: 'Agent error: ' + (err.message ?? String(err)), ts: Date.now() });
    } finally {
      setSending(false);
    }
  }

  async function send(textOverride?: string) {
    const content = textOverride ?? text;
    if (!content || !content.trim()) return;
    const userMsg: Msg = { id: String(Date.now()), role: 'user', content: content, ts: Date.now() };
    addMessage(userMsg);
    setText('');

    const payload = { messages: [{ role: 'user', content: userMsg.content }], config: { configurable: { thread_id: threadId } } };
    await callAgent(payload);
  }

  async function uploadAndSend(file: File | null) {
    if (!file) return;
    const text = await file.text();
    const label = `file:${file.name}\n${text.slice(0, 100000)}`; // limit size
    await send(label);
  }

  function clearConversation() {
    setMessages([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setThreadId('user-' + Math.random().toString(36).slice(2, 9));
  }

  async function retryLast() {
    if (!lastPayloadRef.current) return;
    setSending(true);
    try {
      await callAgent(lastPayloadRef.current);
    } finally { setSending(false); }
  }

  return (
    <div className="container">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h2>Tool-Calling Agent Demo</h2>
        <div style={{color:'#94a3b8'}}>Thread: {threadId}</div>
      </div>
      <div className="card">
        <div style={{display:'flex',gap:8,marginBottom:10,alignItems:'center'}}>
          <input id="file" type="file" onChange={(e)=>uploadAndSend(e.target.files?.[0] ?? null)} />
          <button onClick={retryLast} disabled={sending}>Retry</button>
          <button onClick={clearConversation} style={{background:'#ef4444'}}>Clear</button>
          <div style={{marginLeft:'auto',color:'#94a3b8'}}>{sending ? 'Sending...' : ''}</div>
        </div>

        <div ref={chatRef} className="chat">
          {messages.map((m) => (
            <div key={m.id} className={`message ${m.role}`}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <strong style={{display:'block',color:'#cbd5e1'}}>{m.role}</strong>
                <small style={{color:'#94a3b8'}}>{m.ts ? new Date(m.ts).toLocaleTimeString() : ''}</small>
              </div>
              <div style={{whiteSpace:'pre-wrap',marginTop:6}}>{m.content}</div>
            </div>
          ))}
        </div>

        <div className="inputRow">
          <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Ask something like: What's the weather in Tokyo? Convert it to Fahrenheit." />
          <button onClick={()=>send()} disabled={sending}>Send</button>
        </div>
      </div>
    </div>
  );
}
