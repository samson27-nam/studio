'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useAuth, initializeFirebase } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Upload } from 'lucide-react';

const formSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    repeatPassword: z.string(),
    profilePhoto: z.any().optional(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ['repeatPassword'],
  });

type FormSchema = z.infer<typeof formSchema>;

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const { firebaseApp } = initializeFirebase();
  const storage = getStorage(firebaseApp);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const profilePhoto = watch('profilePhoto');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  const handleSignup: SubmitHandler<FormSchema> = async (data) => {
    setError(null);
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      let photoURL: string | undefined = undefined;
      if (data.profilePhoto && data.profilePhoto[0]) {
        const file = data.profilePhoto[0];
        const storageRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName: data.name,
        photoURL: photoURL,
      });

      // After updating the profile, reload the user object to get the latest data
      await user.reload();
      
      await sendEmailVerification(user);
      await signOut(auth);
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('User already exists. Please try logging in.');
      } else {
        setError('An unexpected error occurred. Please try again.');
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="font-headline text-2xl">
            Create an Account
          </CardTitle>
          <CardDescription>Join the ICES community today!</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Sign-up Failed</AlertTitle>
              <AlertDescription>
                {error}{' '}
                {error.includes('already exists') && (
                  <Link href="/login" className="underline">
                    Sign In?
                  </Link>
                )}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(handleSignup)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m.smith@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="profile-photo">Profile Photo</Label>
                <Button
                  asChild
                  variant="outline"
                  className="relative w-full justify-start font-normal text-muted-foreground"
                >
                  <div>
                    <Upload className="mr-2" />
                    <span>{fileName || 'Upload an image'}</span>
                    <Input
                      id="profile-photo"
                      type="file"
                      className="absolute inset-0 opacity-0"
                      {...register('profilePhoto')}
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                </Button>
                {errors.profilePhoto && (
                  <p className="text-xs text-destructive">
                    {errors.profilePhoto.message as string}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password">Repeat Password</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  {...register('repeatPassword')}
                />
                {errors.repeatPassword && (
                  <p className="text-xs text-destructive">
                    {errors.repeatPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
