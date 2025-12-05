'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="mx-auto w-full max-w-sm text-center">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification email to{' '}
            <span className="font-semibold text-foreground">{email || 'your address'}</span>.
            Please check your inbox and click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
           <p className="mt-4 text-xs text-muted-foreground">
            Didn't receive an email? Check your spam folder or try signing up again.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
