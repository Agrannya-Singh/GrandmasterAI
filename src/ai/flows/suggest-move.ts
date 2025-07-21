'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting chess moves.
 *
 * - suggestMove - A function that takes the current board state and suggests a move.
 * - SuggestMoveInput - The input type for the suggestMove function.
 * - SuggestMoveOutput - The return type for the suggestMove function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMoveInputSchema = z.object({
  boardState: z.string().describe('A string representing the current state of the chess board in FEN notation.'),
});
export type SuggestMoveInput = z.infer<typeof SuggestMoveInputSchema>;

const SuggestMoveOutputSchema = z.object({
  suggestedMove: z.string().describe('A string representing the suggested move in algebraic notation (e.g., e2e4).'),
  explanation: z.string().describe('An explanation of why the move is suggested.'),
});
export type SuggestMoveOutput = z.infer<typeof SuggestMoveOutputSchema>;

export async function suggestMove(input: SuggestMoveInput): Promise<SuggestMoveOutput> {
  return suggestMoveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMovePrompt',
  input: {schema: SuggestMoveInputSchema},
  output: {schema: SuggestMoveOutputSchema},
  prompt: `You are a grandmaster chess player. Analyze the current chess board state and suggest the best move for white.

  Board State (FEN notation): {{{boardState}}}

  Provide the suggested move in algebraic notation (e.g., e2e4) and explain why this move is advantageous.
  Format your response as a JSON object with "suggestedMove" and "explanation" fields.
  Make sure the "suggestedMove" field contains a valid chess move in algebraic notation and the "explanation" clearly articulates the reasoning behind the move suggestion.
  Consider tactical advantages, positional improvements, and long-term strategy when formulating the suggestion.
  `,
});

const suggestMoveFlow = ai.defineFlow(
  {
    name: 'suggestMoveFlow',
    inputSchema: SuggestMoveInputSchema,
    outputSchema: SuggestMoveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
