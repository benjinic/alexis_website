
'use server';

import { aiStyleAdvisor } from '@/ai/flows/ai-style-advisor';
import { refineNotes } from '@/ai/flows/ai-refine-notes';
import { analyzeLook } from '@/ai/flows/ai-look-decoder';

export async function getStyleAdvice(occasionOrMood: string) {
  try {
    const result = await aiStyleAdvisor({ occasionOrMood });
    return result.styleProtocol;
  } catch (error) {
    console.error('Error getting style advice:', error);
    throw new Error('Failed to get style advice from AI.');
  }
}

export async function getRefinedNotes(notes: string) {
  try {
    const result = await refineNotes({ notes });
    return result.refinedNotes;
  } catch (error) {
    console.error('Error refining notes:', error);
    throw new Error('Failed to refine notes with AI.');
  }
}

export async function getLookAnalysis(imageDataUri: string) {
  try {
    const result = await analyzeLook({ imageDataUri });
    return result.styleAnalysis;
  } catch (error) {
    console.error('Error analyzing look:', error);
    throw new Error('Failed to analyze look with AI.');
  }
}
