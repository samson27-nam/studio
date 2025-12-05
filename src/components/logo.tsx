import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 text-lg font-bold text-foreground tracking-tight',
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="ICES Logo"
        width={40}
        height={40}
        className="h-10 w-auto"
      />
      <span className="font-headline text-xl">ICES</span>
    </Link>
  );
}
