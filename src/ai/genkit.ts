import { genkit } from 'genkit';
import { vertexAI } from '@genkit-ai/vertexai'; 

export const ai = genkit({
  plugins: [
    vertexAI({
      projectId: 'alexis-tailor-system-2025', // 確保這裡填對 Project ID
      location: 'us-central1', 
    }),
  ],
  // ...
});