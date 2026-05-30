import { NextApiRequest, NextApiResponse } from 'next';
import { handleAgent } from '../../lib/agent';

// Simple in-memory rate limiter per IP (suitable for demo/dev)
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 30;
const ipMap: Map<string, { ts: number; count: number }> = new Map();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = ipMap.get(ip) || { ts: now, count: 0 };
  if (now - entry.ts > RATE_LIMIT_WINDOW_MS) {
    entry.ts = now; entry.count = 0;
  }
  entry.count += 1;
  ipMap.set(ip, entry);
  if (entry.count > MAX_PER_WINDOW) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  try {
    const { messages, config } = req.body ?? {};
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages payload' });
    }
    // basic size guard
    const rawSize = JSON.stringify(req.body).length;
    if (rawSize > 200_000) return res.status(413).json({ error: 'Payload too large' });

    const out = await handleAgent(messages, config);
    res.json(out);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? String(err) });
  }
}
