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
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
        />
        <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
        />
        <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
        />
        <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
        />
    </svg>
);

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
  const { firebaseApp, firestore } = initializeFirebase();
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

      let photoURL: string | null = null;
      if (data.profilePhoto && data.profilePhoto[0]) {
        const file = data.profilePhoto[0];
        const storageRef = ref(storage, `user_profile_images/${user.uid}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName: data.name,
        photoURL: photoURL,
      });

      // Create user document in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        id: user.uid,
        name: data.name,
        email: data.email,
        profilePhotoURL: photoURL,
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

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create user document in Firestore if it doesn't exist
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        profilePhotoURL: user.photoURL,
      }, { merge: true });

      router.push('/dashboard');
    } catch (err: any) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
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
           <div className="my-4 flex items-center">
            <Separator className="flex-1" />
            <span className="mx-4 text-xs uppercase text-muted-foreground">Or</span>
            <Separator className="flex-1" />
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            <GoogleIcon />
            Sign up with Google
          </Button>
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
