'use server';
/**
 * @fileOverview A chess move suggestion AI agent.
 *
 * - suggestMove - A function that suggests the next best move for the player.
 * - SuggestMoveInput - The input type for the suggestMove function.
 * - SuggestMoveOutput - The return type for the suggestMove function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMoveInputSchema = z.object({
  fen: z
    .string()
    .describe(
      'The FEN string representing the current state of the chess game.'
    ),
});
export type SuggestMoveInput = z.infer<typeof SuggestMoveInputSchema>;

const SuggestMoveOutputSchema = z.object({
  move: z
    .string()
    .describe(
      'The suggested move in UCI format (e.g., "e2e4", "g1f3").'
    ),
    reasoning: z.string().describe('A brief explanation for why this move is good.'),
});
export type SuggestMoveOutput = z.infer<typeof SuggestMoveOutputSchema>;

export async function suggestMove(input: SuggestMoveInput): Promise<SuggestMoveOutput> {
  return suggestMoveFlow(input);
}

const suggestMovePrompt = ai.definePrompt({
  name: 'suggestMovePrompt',
  input: {schema: SuggestMoveInputSchema},
  output: {schema: SuggestMoveOutputSchema},
  prompt: `You are a world-class chess grandmaster and tutor. Your task is to analyze the provided chess position (in FEN format) and suggest the best possible move for the player (White).

The current board position is: {{{fen}}}

It is White's turn to move.

Provide a single, strong move suggestion. Also, provide a concise, one-sentence explanation for your choice, focusing on the strategic or tactical advantage it provides.

Format your response as a JSON object matching the schema. The move should be in UCI format (e.g., e2e4, g1f3).`,
});

const suggestMoveFlow = ai.defineFlow(
  {
    name: 'suggestMoveFlow',
    inputSchema: SuggestMoveInputSchema,
    outputSchema: SuggestMoveOutputSchema,
  },
  async input => {
    const {output} = await suggestMovePrompt(input);
    return output!;
  }
);
