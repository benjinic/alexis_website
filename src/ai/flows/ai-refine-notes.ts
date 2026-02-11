'use server';

/**
 * @fileOverview AI-powered note refinement for booking form submissions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineNotesInputSchema = z.object({
  notes: z.string().describe('The user-provided notes to be refined.'),
});
export type RefineNotesInput = z.infer<typeof RefineNotesInputSchema>;

const RefineNotesOutputSchema = z.object({
  refinedNotes: z.string().describe('The AI-refined notes for improved clarity and impact.'),
});
export type RefineNotesOutput = z.infer<typeof RefineNotesOutputSchema>;

export async function refineNotes(input: RefineNotesInput): Promise<RefineNotesOutput> {
  return refineNotesFlow(input);
}

const refineNotesPrompt = ai.definePrompt({
  name: 'refineNotesPrompt',
  model: 'vertexai/gemini-2.0-flash-001', //
  input: {schema: RefineNotesInputSchema},
  output: {schema: RefineNotesOutputSchema},
  // 核心修改：注入 "Master Translator" 人設
  prompt: `You are the Master Cutter's intake protocol. The client writes like a civilian; you translate it into High Sartorial English.
  
  **GOAL:**
  Make the request sound precise, expensive, and demanding. Strip away uncertainty.
  
  **EXAMPLES:**
  - "I want a blue suit for work" -> "Client requests a Navy High-Twist Fresco Two-Piece. Focus on durability and drape for daily executive warfare."
  - "Something for a summer wedding" -> "Commission: Lightweight Linen/Silk blend. Unstructured construction required for heat management. Shade: Tobacco or Cream."
  - "I want to look cool" -> "Objective: Maximum visual impact. Suggest wide peak lapels, roped shoulders, and a waist-suppressed silhouette."
  
  **CRITICAL:** Do not add introductory fluff. Return ONLY the refined technical note.

  Original Notes: {{{notes}}}

  Refined Notes:`,
});

const refineNotesFlow = ai.defineFlow(
  {
    name: 'refineNotesFlow',
    inputSchema: RefineNotesInputSchema,
    outputSchema: RefineNotesOutputSchema,
  },
  async input => {
    const {output} = await refineNotesPrompt(input);
    return output!;
  }
);