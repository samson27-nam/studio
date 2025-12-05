import Link from 'next/link';
import { Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 text-lg font-bold text-foreground tracking-tight',
        className
      )}
    >
      <div className="rounded-md bg-primary p-1.5 text-primary-foreground">
        <Landmark className="h-5 w-5" />
      </div>
      <span className="font-headline">ICES</span>
    </Link>
  );
}
