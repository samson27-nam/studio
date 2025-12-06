'use server';
/**
 * @fileOverview A flow for summarizing text content.
 *
 * - summarizeText - A function that handles the text summarization.
 */

import {ai} from '@/ai/genkit';
import {
  SummarizeTextInputSchema,
  type SummarizeTextInput,
  SummarizeTextOutputSchema,
  type SummarizeTextOutput,
} from '@/ai/schemas/summarize-schemas';

export async function summarizeText(
  input: SummarizeTextInput
): Promise<SummarizeTextOutput> {
  return summarizeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTextPrompt',
  input: {schema: SummarizeTextInputSchema},
  output: {schema: SummarizeTextOutputSchema},
  prompt: `You are an expert at summarizing technical discussions. Please provide a concise summary of the following text:

{{{text}}}`,
});

const summarizeTextFlow = ai.defineFlow(
  {
    name: 'summarizeTextFlow',
    inputSchema: SummarizeTextInputSchema,
    outputSchema: SummarizeTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output from prompt');
    }
    return output;
  }
);
