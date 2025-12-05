import { notFound } from 'next/navigation';
import Link from 'next/link';
import { forumThreads } from '@/lib/data';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MessageSquare } from 'lucide-react';

export default function ForumThreadPage({ params }: { params: { id: string } }) {
  const thread = forumThreads.find((t) => t.id === params.id);

  if (!thread) {
    notFound();
  }

  const [mainPost, ...replies] = thread.posts;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/forum">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forum
          </Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold">{thread.title}</h1>
        <p className="text-muted-foreground">
          A discussion started by {thread.author.name}
        </p>
      </div>

      {mainPost && (
        <Card>
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <Avatar>
              <AvatarImage src={mainPost.author.avatar} data-ai-hint="person avatar" />
              <AvatarFallback>
                {mainPost.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{mainPost.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {mainPost.timestamp}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{mainPost.content}</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Reply
            </Button>
          </CardFooter>
        </Card>
      )}

      {replies.length > 0 && (
        <>
          <Separator />
          <h2 className="font-headline text-2xl font-bold">Replies</h2>
          <div className="space-y-6">
            {replies.map((reply) => (
              <Card key={reply.id}>
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <Avatar>
                    <AvatarImage src={reply.author.avatar} data-ai-hint="person avatar" />
                    <AvatarFallback>
                      {reply.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{reply.author.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {reply.timestamp}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{reply.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
