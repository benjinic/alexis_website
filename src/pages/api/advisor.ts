import type { NextApiRequest, NextApiResponse } from 'next';
import { aiStyleAdvisorFlow } from '@/ai/flows/ai-style-advisor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 只允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 安全解析 body：空值直接 400
    let body: { occasionOrMood?: string };
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body.' });
    }

    if (!body.occasionOrMood) {
      return res.status(400).json({ error: 'Missing field: occasionOrMood' });
    }

    // 呼叫 AI 神經網路
    const result = await aiStyleAdvisorFlow({ occasionOrMood: body.occasionOrMood });

    // 完美回傳
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('🔥 [API ERROR] 核心連線失敗:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}