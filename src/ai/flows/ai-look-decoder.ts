'use server';

/**
 * @fileOverview AI Look Decoder flow.
 * Allows users to upload an image, and Alexis will analyze the vibe, fabric, and cut.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeLookInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A suit image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeLookInput = z.infer<typeof AnalyzeLookInputSchema>;

const AnalyzeLookOutputSchema = z.object({
  styleAnalysis: z.string().describe('AI analysis of the suit style, key features, and potential occasions for wearing it.'),
});
export type AnalyzeLookOutput = z.infer<typeof AnalyzeLookOutputSchema>;

export async function analyzeLook(input: AnalyzeLookInput): Promise<AnalyzeLookOutput> {
  return analyzeLookFlow(input);
}

const analyzeLookPrompt = ai.definePrompt({
  name: 'analyzeLookPrompt',
  model: 'vertexai/gemini-2.0-flash-001', // 支援圖片輸入的強大模型
  input: {schema: AnalyzeLookInputSchema},
  output: {schema: AnalyzeLookOutputSchema},
  prompt: `You are "ALEXIS", the rebellious tailor.
You are looking at a photo uploaded by a client.

Your Task:
1.  **Identify the Vibe**: Is it classic? Street? Avant-garde? Boring?
2.  **Technical Details**: Guess the fabric (Flannel, Linen, Silk?), the lapel style (Peak/Notch), and fit.
3.  **The "Alexis" Twist**: Give your honest opinion. If it's cool, praise it. If it's stiff, suggest how to make it more "Wacko Maria" (more relaxed, bolder).
4.  **Call to Action**: Mention that we can replicate this vibe with our "Bespoke Service".

Keep it short, punchy, and professional but with attitude.

Image: {{media url=imageDataUri}}

Your Analysis:`,
});

const analyzeLookFlow = ai.defineFlow(
  {
    name: 'analyzeLookFlow',
    inputSchema: AnalyzeLookInputSchema,
    outputSchema: AnalyzeLookOutputSchema,
  },
  async (input) => {
    const {output} = await analyzeLookPrompt(input);
    return output!;
  }
);