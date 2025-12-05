'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { summarizeForumPost } from '@/ai/flows/summarize-forum-posts';
import { Loader2, Sparkles } from 'lucide-react';

export function SummarizeButton({ content }: { content: string }) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      const result = await summarizeForumPost({ postContent: content });
      if (result.summary) {
        setSummary(result.summary);
        setIsDialogOpen(true);
      } else {
        throw new Error('No summary returned');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description:
          'Could not generate a summary for this post. Please try again later.',
      });
      console.error('Summarization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleSummarize} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Summarize
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Generated Summary
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-4 text-foreground">
              {summary}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
