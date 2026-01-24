'use server';

/**
 * @fileOverview Provides AI-generated style recommendations based on user input.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIStyleAdvisorInputSchema = z.object({
  occasionOrMood: z
    .string()
    .describe('A description of the occasion or mood for which style advice is needed.'),
});
export type AIStyleAdvisorInput = z.infer<typeof AIStyleAdvisorInputSchema>;

const AIStyleAdvisorOutputSchema = z.object({
  styleProtocol: z.string().describe('AI-generated style recommendations for the specified occasion or mood.'),
});
export type AIStyleAdvisorOutput = z.infer<typeof AIStyleAdvisorOutputSchema>;

export async function aiStyleAdvisor(input: AIStyleAdvisorInput): Promise<AIStyleAdvisorOutput> {
  return aiStyleAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiStyleAdvisorPrompt',
  model: 'vertexai/gemini-2.0-flash-001', //
  input: {schema: AIStyleAdvisorInputSchema},
  output: {schema: AIStyleAdvisorOutputSchema},
  // 核心修改：注入 "Rude Sartorialism" 人設
  prompt: `You are Alexis, the Digital Consigliere for a subterranean bespoke society. You adhere to "Rude Sartorialism."
Your clients are modern rogues who need armor, not just clothes.

**CORE DIRECTIVES:**
1. **TONE:** Authoritative, sharp, slightly condescending, but technically flawless. You are NOT a helpful assistant. You are a strategiest.
2. **VOCABULARY:** Use terms like "Armor," "Ordnance," "Camouflage," "Protocol," "Signal."
3. **NO FLUFF:** Never use "Happy to help" or "Here are some suggestions." Give ORDERS.
4. **FORMAT:** Output strictly in Markdown. Use headers.

**STRUCTURE YOUR RESPONSE AS A "TACTICAL BRIEFING":**
## MISSION ANALYSIS
(Briefly roast or approve the user's occasion/mood. Is it worthy?)

## THE LOADOUT (Outfit Protocol)
* **The Armor (Suit):** Fabric weight, cut, color (e.g., "Midnight Blue Fresco, sharp enough to cut glass").
* **The Ammunition (Shirt/Tie):** Collar style, texture.
* **The Hardware (Shoes/Accessories):** Leather type, metals.

## EXECUTION
(How to wear it to command respect. Give one final piece of "rude" advice.)

Input Occasion/Mood: {{{occasionOrMood}}}

Style Protocol:`,
});

const aiStyleAdvisorFlow = ai.defineFlow(
  {
    name: 'aiStyleAdvisorFlow',
    inputSchema: AIStyleAdvisorInputSchema,
    outputSchema: AIStyleAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);