import { getWeather, convertTemperature, callWithRetry } from './tools';
import { appendConversation, getConversation } from './memory';

import { config as envConfig } from 'process';

type Message = { role: 'user' | 'assistant' | 'tool'; content: string };

// Prefer Anthropic if provided, otherwise OpenAI (optional)
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_KEY;
const ANTHROPIC_URL = process.env.ANTHROPIC_API_URL || 'https://api.anthropic.com/v1/complete';
let useAnthropic = false;
if (ANTHROPIC_KEY) useAnthropic = true;

let openaiClient: any = null;
const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
if (!useAnthropic && OPENAI_KEY) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { OpenAI } = require('openai');
  openaiClient = new OpenAI({ apiKey: OPENAI_KEY });
}

async function callAnthropic(prompt: string) {
  try {
    const body = {
      model: process.env.ANTHROPIC_MODEL || 'claude-2.1',
      prompt: prompt,
      max_tokens: 400,
    };
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY as string,
      },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    // Try several response shapes
    if (json.completion) return json.completion;
    if (json.output && typeof json.output === 'string') return json.output;
    if (json[0] && json[0].text) return json[0].text;
    if (json.output?.text) return json.output.text;
    return JSON.stringify(json);
  } catch (err) {
    throw err;
  }
}

export async function handleAgent(messages: Message[], config?: any) {
  const threadId = config?.configurable?.thread_id ?? 'default-thread';
  appendConversation(threadId, { role: 'system', note: 'invoke' });

  const user = messages.filter((m) => m.role === 'user').map((m) => m.content).join('\n');

  // Get conversation history for context (safe size)
  const history = getConversation(threadId).slice(-20).map((h: any) => ({ role: h.role, content: h.payload || JSON.stringify(h) }));

  const lower = user.toLowerCase();
  const responses: Message[] = [];

  try {
    if (lower.includes('weather')) {
      const cityMatch = user.match(/in\s+([A-Za-z ]+)/i);
      const city = cityMatch ? cityMatch[1].trim() : 'London';

      const weather = await callWithRetry(() => getWeather(city), 4);
      appendConversation(threadId, { role: 'tool', tool: 'getWeather', input: city, output: weather });
      responses.push({ role: 'tool', content: `Weather for ${city}: ${weather}` });

      if (lower.includes('convert')) {
        const tempMatch = weather.match(/([-0-9]+)°C/);
        if (tempMatch) {
          const c = parseFloat(tempMatch[1]);
          const conv = await callWithRetry(() => convertTemperature(c), 3);
          appendConversation(threadId, { role: 'tool', tool: 'convertTemperature', input: c, output: conv });
          responses.push({ role: 'tool', content: conv });
        }
      }
    }

    if (responses.length === 0) {
      // If Anthropic configured, prefer it. Otherwise, fall back to OpenAI (if configured), else echo.
      const systemPrompt = 'You are an agent orchestrator with access to tools. If the user asks for weather, use the internal tool. Otherwise answer succinctly.';
      const messagesForModel = [
        { role: 'system', content: systemPrompt },
        ...history.map((h: any) => ({ role: h.role === 'tool' ? 'system' : h.role, content: h.content })),
        { role: 'user', content: user },
      ];

      if (useAnthropic) {
        try {
          const prompt = messagesForModel.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n') + '\nASSISTANT:';
          const text = await callAnthropic(prompt);
          appendConversation(threadId, { role: 'assistant', output: text });
          responses.push({ role: 'assistant', content: text });
        } catch (err: any) {
          appendConversation(threadId, { role: 'assistant', error: String(err) });
          responses.push({ role: 'assistant', content: `Agent error calling Anthropic: ${err.message ?? String(err)}` });
        }
      } else if (openaiClient) {
        try {
          const resp = await openaiClient.chat.completions.create({ model: 'gpt-4o-mini', messages: messagesForModel, max_tokens: 300 });
          const text = resp.choices?.[0]?.message?.content ?? `Agent echo: ${user}`;
          appendConversation(threadId, { role: 'assistant', output: text });
          responses.push({ role: 'assistant', content: text });
        } catch (err: any) {
          appendConversation(threadId, { role: 'assistant', error: String(err) });
          responses.push({ role: 'assistant', content: `Agent error calling LLM: ${err.message ?? String(err)}` });
        }
      } else {
        const echo = `Agent echo: ${user}`;
        appendConversation(threadId, { role: 'assistant', output: echo });
        responses.push({ role: 'assistant', content: echo });
      }
    }

    return { messages: responses };
  } catch (err: any) {
    appendConversation(threadId, { role: 'assistant', error: String(err) });
    return { messages: [{ role: 'assistant', content: `Error: ${err.message || String(err)}` }] };
  }
}
