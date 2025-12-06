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
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser, initializeFirebase, useFirestore } from '@/firebase';
import { updateProfile, deleteUser } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Upload, Loader2, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  profilePhoto: z.any().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { firebaseApp } = initializeFirebase();
  const storage = getStorage(firebaseApp);
  const { toast } = useToast();

  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      name: user?.displayName || '',
      profilePhoto: null,
    }
  });

  const profilePhoto = watch('profilePhoto');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue('profilePhoto', e.target.files, { shouldDirty: true });
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setValue('profilePhoto', null);
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

      if (data.profilePhoto && data.profilePhoto.length > 0) {
        const file = data.profilePhoto[0];
        const storageRef = ref(storage, `user_profile_images/${user.uid}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: data.name,
        photoURL: photoURL,
      });

      // Update Firestore document
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        name: data.name,
        profilePhotoURL: photoURL,
      }, { merge: true });

      // After updating, reload the user object to get the latest data.
      await user.reload();
      
      // Reset form values to reflect the new state from the reloaded user object
      reset({
        name: user.displayName || '',
        profilePhoto: null,
      });

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
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      // 1. Delete user's profile photo from Storage if it exists
      if (user.photoURL) {
        // We need to derive the storage path from the URL.
        // This assumes the default structure. Be cautious with this approach.
        try {
            const photoRef = ref(storage, `user_profile_images/${user.uid}`);
            await deleteObject(photoRef);
        } catch (storageError: any) {
            // Log if the photo deletion fails but continue with account deletion
            console.warn("Could not delete profile photo:", storageError.code);
        }
      }

      // 2. Delete user's document from Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await deleteDoc(userDocRef);

      // 3. Delete user from Firebase Authentication
      await deleteUser(user);

      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
      });
      
      // Redirect to home or login page after a short delay
      setTimeout(() => router.push('/'), 1000);

    } catch (err: any)
      {
      console.error("Account deletion failed:", err);
      setError("Failed to delete account. You may need to re-authenticate.");
      // If re-authentication is required, Firebase throws 'auth/requires-recent-login'
      if (err.code === 'auth/requires-recent-login') {
          setError("This is a sensitive operation. Please log out and log back in before deleting your account.");
      }
      setIsDeleting(false);
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

            <Button type="submit" disabled={isLoading || !isDirty}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="max-w-2xl border-destructive">
        <CardHeader>
            <CardTitle className="font-headline text-destructive">Danger Zone</CardTitle>
            <CardDescription>
                Once you delete your account, there is no going back. Please be certain.
            </CardDescription>
        </CardHeader>
        <CardFooter>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete Account
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount}>
                            Yes, delete my account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardFooter>
    </Card>

    </div>
  );
}
