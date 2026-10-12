// 檔案位置：src/pages/api/look-analysis.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// 🧠 匯入你寫好的 Genkit 視覺大腦
import { aiLookDecoderFlow } from '@/ai/flows/ai-look-decoder';

// 🛡️ 影像專屬防護罩：把接收容量調大到 10MB，防止圖片被擋
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 🚀 Firebase 降維打擊寫法：直接拿 req.body，絕對不鎖死
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // 🕵️‍♂️ 抓取圖片：相容前端傳來的 image 或 imageDataUri 欄位
    const base64Image = body.image || body.imageDataUri;

    if (!base64Image) {
      return res.status(400).json({ error: 'Alexis 需要看到照片才能進行批判。' });
    }

    // ⚡ 呼叫你的 Genkit 神經網路！
    // 你的 Schema 規定輸入必須叫做 { imageDataUri: ... }
    const aiResult = await aiLookDecoderFlow({ imageDataUri: base64Image });

    // 完美回傳 AI 的毒舌分析結果！
    return res.status(200).json(aiResult);

  } catch (error: any) {
    console.error('🔥 [API ERROR] 視覺核心連線失敗:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}