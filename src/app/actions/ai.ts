'use server';

import { aiStyleAdvisorFlow } from '@/ai/flows/ai-style-advisor';
import { aiLookDecoderFlow } from '@/ai/flows/ai-look-decoder';
import { refineNotes } from '@/ai/flows/ai-refine-notes';

export async function getStyleAdvice(occasionOrMood: string) {
  try {
    const result = await aiStyleAdvisorFlow({ occasionOrMood });
    return result; 
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
    const result = await aiLookDecoderFlow({ imageDataUri });
    return result; 
  } catch (error: any) {
    // 🔴 改良：印出完整的錯誤物件，方便除錯
    console.error('Error analyzing look (Full Details):', JSON.stringify(error, null, 2));
    if (error.message) console.error('Error Message:', error.message);
    
    throw new Error(`Failed to analyze look with AI: ${error.message || 'Unknown error'}`);
  }
}