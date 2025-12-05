import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { executives } from '@/lib/data';

export default function ExecutivesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Executive Team</h1>
        <p className="text-muted-foreground">
          Meet the dedicated leaders of the Innovation in Civil Engineering Society.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {executives.map((executive) => (
          <Card
            key={executive.id}
            className="text-center transition-transform hover:scale-105 hover:shadow-lg"
          >
            <CardHeader className="items-center">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={executive.avatar} alt={executive.name} data-ai-hint="professional headshot" />
                <AvatarFallback>
                  {executive.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              <CardTitle className="font-headline text-lg">{executive.name}</CardTitle>
              <p className="text-sm text-primary">{executive.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
