// src/ai/flows/analyze-game.ts
'use server';
/**
 * @fileOverview A chess game analyzer AI agent.
 *
 * - analyzeGame - A function that handles the game analysis process.
 * - AnalyzeGameInput - The input type for the analyzeGame function.
 * - AnalyzeGameOutput - The return type for the analyzeGame function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeGameInputSchema = z.object({
  gameHistory: z
    .string()
    .describe(
      'A string representing the full history of the chess game in standard algebraic notation (SAN).'
    ),
});
export type AnalyzeGameInput = z.infer<typeof AnalyzeGameInputSchema>;

const AnalyzeGameOutputSchema = z.object({
  strengths: z.string().describe('A summary of the player\'s strengths based on the game.'),
  weaknesses: z.string().describe('A summary of the player\'s weaknesses based on the game.'),
  keyMoments: z
    .string()
    .describe(
      'Description of key moments in the game where the player made significant decisions, both good and bad.'
    ),
  overallAssessment: z
    .string()
    .describe('An overall assessment of the player\'s performance in the game.'),
});
export type AnalyzeGameOutput = z.infer<typeof AnalyzeGameOutputSchema>;

export async function analyzeGame(input: AnalyzeGameInput): Promise<AnalyzeGameOutput> {
  return analyzeGameFlow(input);
}

const analyzeGamePrompt = ai.definePrompt({
  name: 'analyzeGamePrompt',
  input: {schema: AnalyzeGameInputSchema},
  output: {schema: AnalyzeGameOutputSchema},
  prompt: `You are an expert chess coach analyzing a completed game.

  Provide insights into the player's strengths and weaknesses, key moments in the game, and an overall assessment of their performance.

  Game History: {{{gameHistory}}}

  Analyze the game and provide the following:
  - Strengths: A summary of the player's strengths based on the game.
  - Weaknesses: A summary of the player's weaknesses based on the game.
  - Key Moments: Description of key moments in the game where the player made significant decisions, both good and bad.
  - Overall Assessment: An overall assessment of the player's performance in the game.

  Format your response as a JSON object matching the schema.`,
});

const analyzeGameFlow = ai.defineFlow(
  {
    name: 'analyzeGameFlow',
    inputSchema: AnalyzeGameInputSchema,
    outputSchema: AnalyzeGameOutputSchema,
  },
  async input => {
    const {output} = await analyzeGamePrompt(input);
    return output!;
  }
);
