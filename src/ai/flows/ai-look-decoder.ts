import { z } from 'zod';
import { ai } from '../genkit'; 

const LOOK_DECODER_MODEL = process.env.VERTEX_LOOK_DECODER_MODEL ?? 'vertexai/gemini-2.0-flash-001';

// 定義輸入：接收 Base64 圖片字串
export const LookDecoderInputSchema = z.object({
  imageDataUri: z.string().describe('The base64 encoded image data URI of the user\'s outfit.'),
});

// 定義輸出：結構化評分報告
export const LookDecoderOutputSchema = z.object({
  verdict: z.string().describe('A short, punchy title for the look (e.g., "Suburban Dad Crisis").'),
  score: z.number().min(0).max(10).describe('Style score out of 10. Be harsh.'),
  critique: z.string().describe('The detailed, rude, but insightful critique of the outfit.'),
  improvements: z.array(z.string()).describe('List of specific items or changes to fix the look.'),
});

export const aiLookDecoderFlow = ai.defineFlow(
  {
    name: 'aiLookDecoderFlow',
    inputSchema: LookDecoderInputSchema,
    outputSchema: LookDecoderOutputSchema,
  },
  async (input) => {
    const prompt = `
      You are Alexis, the rude bespoke tailor. 
      Analyze this image of a user's outfit.
      
      Your Mission:
      1. Identify the style crimes committed.
      2. Rate the look on a scale of 0-10 (be very strict, 10 is impossible).
      3. Give it a sarcastic "Verdict" title.
      4. Provide specific instructions on how to fix it using bespoke tailoring principles.

      Tone: Withering, sarcastic, elite, but ultimately helpful. Like a drill sergeant for fashion.
      
      IMPORTANT: Return valid JSON matching the schema.
    `;

    const llmResponse = await ai.generate({
      model: LOOK_DECODER_MODEL,
      prompt: [
        { text: prompt },
        { media: { url: input.imageDataUri } } 
      ],
      output: { schema: LookDecoderOutputSchema },
    });

    if (!llmResponse.output) {
      throw new Error("Alexis refused to look at this image.");
    }

    return llmResponse.output;
  }
);