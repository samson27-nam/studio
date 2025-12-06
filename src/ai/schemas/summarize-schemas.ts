/**
 * @fileOverview Zod schemas for the text summarization flow.
 *
 * - SummarizeTextInputSchema - The input type for the summarizeText function.
 * - SummarizeTextOutputSchema - The return type for the summarizeText function.
 */

import {z} from 'genkit';

export const SummarizeTextInputSchema = z.object({
  text: z.string().describe('The text to be summarized.'),
});
export type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;

export const SummarizeTextOutputSchema = z.object({
  summary: z.string().describe('The summarized version of the text.'),
});
export type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;
