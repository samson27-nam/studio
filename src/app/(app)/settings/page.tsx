'use client';

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
import { useAuth, useUser, initializeFirebase } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Upload, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  profilePhoto: z.any().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { firebaseApp } = initializeFirebase();
  const storage = getStorage(firebaseApp);
  const { toast } = useToast();

  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.displayName || '',
    },
  });

  const profilePhoto = watch('profilePhoto');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName('');
      setPhotoPreview(null);
    }
  };

  const handleUpdate: SubmitHandler<FormSchema> = async (data) => {
    if (!user) return;
    setError(null);
    setIsLoading(true);
    try {
      let photoURL = user.photoURL;

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

      await user.reload(); // Refresh user data to get the latest profile

      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been successfully updated.',
      });
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setPhotoPreview(null);
      setFileName('');
    }
  };

  if (isUserLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
       <div>
        <h1 className="font-headline text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline">Profile Information</CardTitle>
          <CardDescription>Update your name and profile picture.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Update Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
             <div className="space-y-2">
                <Label>Current Profile Photo</Label>
                 <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={photoPreview || user?.photoURL || ''} alt={user?.displayName || 'User'} />
                        <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <Button
                        asChild
                        variant="outline"
                        className="relative w-full max-w-xs justify-start font-normal text-muted-foreground"
                        >
                        <div>
                            <Upload className="mr-2" />
                            <span>{fileName || 'Upload a new image'}</span>
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
                </div>
                 {errors.profilePhoto && (
                  <p className="text-xs text-destructive">
                    {errors.profilePhoto.message as string}
                  </p>
                )}
             </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

             <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email || ''} disabled />
              <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
