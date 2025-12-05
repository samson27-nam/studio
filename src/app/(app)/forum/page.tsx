import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { forumThreads } from '@/lib/data';

export default function ForumPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground">
            Discuss topics, ask questions, and share your knowledge.
          </p>
        </div>
        <Button>New Thread</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Threads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Topic</TableHead>
                <TableHead>Replies</TableHead>
                <TableHead className="text-right">Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forumThreads.map((thread) => (
                <TableRow key={thread.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={thread.author.avatar} data-ai-hint="person avatar" />
                        <AvatarFallback>
                          {thread.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          href={`/forum/${thread.id}`}
                          className="font-medium hover:underline"
                        >
                          {thread.title}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          by {thread.author.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{thread.replies}</TableCell>
                  <TableCell className="text-right">
                    {thread.lastActivity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
