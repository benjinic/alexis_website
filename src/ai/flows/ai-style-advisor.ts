import { z } from 'zod';
import { ai } from '../genkit'; 

// 定義輸入架構
export const StyleAdvisorInputSchema = z.object({
  occasionOrMood: z.string().describe('The event, occasion, or desired mood for the outfit.'),
});

// 定義輸出架構
export const StyleAdvisorOutputSchema = z.object({
  analysis: z.string().describe('Analysis of the mission and occasion.'),
  outfit: z.object({
    suit: z.string().describe('Recommendation for the suit or main garment.'),
    shirt: z.string().describe('Recommendation for the shirt or underlayer.'),
    accessories: z.array(z.string()).describe('List of recommended accessories (ties, shoes, watches).'),
  }),
  advice: z.string().describe('Final comportment or behavior advice.'),
});

// 定義 Flow
export const aiStyleAdvisorFlow = ai.defineFlow(
  {
    name: 'aiStyleAdvisorFlow',
    inputSchema: StyleAdvisorInputSchema,
    outputSchema: StyleAdvisorOutputSchema,
  },
  async (input) => {
    const prompt = `
      You are Alexis, a bespoke tailor with a sharp tongue, impeccable taste, and a spy thriller aesthetic.
      
      User Request: "${input.occasionOrMood}"
      
      Your Mission:
      1. Analyze the occasion.
      2. Recommend a "Loadout" (Outfit) including Suit, Shirt, and Accessories.
      3. Give "Execution" advice on how to behave.
      
      Tone: Professional but slightly intimidating, elegant, sophisticated. Use terms like "Mission," "Asset," "Protocol."
      
      IMPORTANT: You must return a valid JSON object matching the requested schema exactly.
    `;

    // 呼叫 AI
    const llmResponse = await ai.generate({
      // 修正點：加上 -001 後綴
      model: 'vertexai/gemini-2.0-flash-001', 
      prompt: prompt,
      output: { schema: StyleAdvisorOutputSchema }, 
    });

    if (!llmResponse.output) {
      throw new Error("AI failed to generate a response.");
    }

    return llmResponse.output;
  }
);