import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageSquare,
  Users,
  BarChart3,
  Landmark,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { Logo } from '@/components/logo';

const features = [
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: 'Community Forum',
    description:
      'Engage in discussions, share knowledge, and collaborate on projects with fellow civil engineering students.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Executive Team',
    description:
      'Meet the leaders of the society, learn about their roles, and get in touch with them directly.',
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: 'Analytics Dashboard',
    description:
      'Admins can track member engagement, event registrations, and payment statuses in real-time.',
  },
  {
    icon: <ClipboardList className="h-8 w-8 text-primary" />,
    title: 'News & Announcements',
    description:
      'Stay up-to-date with the latest news, events, and opportunities within the society.',
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Summaries',
    description:
      'Save time with AI-generated summaries of long forum posts, getting the key points instantly.',
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
          <Image
            src="https://picsum.photos/seed/civil-hero/1920/1080"
            alt="Hero background"
            fill
            className="object-cover object-center brightness-50"
            data-ai-hint="engineering blueprint abstract"
          />
          <div className="container relative mx-auto px-4 text-center text-primary-foreground">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Innovation in Civil Engineering Society (ICES)
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg md:text-xl">
              Connecting the next generation of civil engineers through community,
              innovation, and collaboration.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/login">Join the Community</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                Features for a Thriving Society
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                ICES provides all the tools your student society needs
                to succeed.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col items-center text-center">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="font-headline mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted/40 py-6">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ICES. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
