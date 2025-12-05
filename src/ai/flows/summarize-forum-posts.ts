'use server';

/**
 * @fileOverview A flow that summarizes long forum posts.
 *
 * - summarizeForumPost - A function that summarizes the forum post.
 * - SummarizeForumPostInput - The input type for the summarizeForumPost function.
 * - SummarizeForumPostOutput - The return type for the summarizeForumPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeForumPostInputSchema = z.object({
  postContent: z
    .string()
    .describe('The full content of the forum post to be summarized.'),
});
export type SummarizeForumPostInput = z.infer<typeof SummarizeForumPostInputSchema>;

const SummarizeForumPostOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the forum post.'),
});
export type SummarizeForumPostOutput = z.infer<typeof SummarizeForumPostOutputSchema>;

export async function summarizeForumPost(input: SummarizeForumPostInput): Promise<SummarizeForumPostOutput> {
  return summarizeForumPostFlow(input);
}

const summarizeForumPostPrompt = ai.definePrompt({
  name: 'summarizeForumPostPrompt',
  input: {schema: SummarizeForumPostInputSchema},
  output: {schema: SummarizeForumPostOutputSchema},
  prompt: `Summarize the following forum post in a concise manner. The summary should capture the main points and key topics discussed in the post.

Forum Post Content:
{{{postContent}}}`,
});

const summarizeForumPostFlow = ai.defineFlow(
  {
    name: 'summarizeForumPostFlow',
    inputSchema: SummarizeForumPostInputSchema,
    outputSchema: SummarizeForumPostOutputSchema,
  },
  async input => {
    const {output} = await summarizeForumPostPrompt(input);
    return output!;
  }
);
