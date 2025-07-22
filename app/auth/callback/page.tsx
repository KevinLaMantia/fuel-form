'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: 'Authentication Error',
            description: error.message,
            variant: 'destructive',
          });
          router.push('/login');
          return;
        }

        if (data.session?.user) {
          console.log('OAuth login successful:', data.session.user.email);

          // Get additional parameters from URL
          const userType = searchParams.get('userType') || 'client';
          const plan = searchParams.get('plan');

          // Check if user profile exists in our database
          const { data: existingProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error checking user profile:', profileError);
          }

          if (!existingProfile) {
            // New OAuth user - create profile
            const userMetadata = data.session.user.user_metadata;
            const fullName = userMetadata.full_name || userMetadata.name || '';
            const nameParts = fullName.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const profileData = {
              id: data.session.user.id,
              email: data.session.user.email,
              first_name: firstName,
              last_name: lastName,
              full_name: fullName,
              user_type: userType,
              avatar_url:
                userMetadata.avatar_url || userMetadata.picture || null,
            };

            const { error: insertError } = await supabase
              .from('users')
              .insert(profileData);

            if (insertError) {
              console.error('Error creating user profile:', insertError);
              // Continue anyway - they can complete profile later
            }

            toast({
              title: 'Welcome to FuelForm! 🎉',
              description: 'Your account has been created successfully.',
            });
            router.push('/onboarding');
          } else {
            // Existing user
            toast({
              title: 'Welcome back! 👋',
              description: 'You have been successfully logged in.',
            });
            router.push('/dashboard');
          }
        } else {
          console.error('No session found after OAuth callback');
          toast({
            title: 'Authentication Error',
            description: 'No session found. Please try logging in again.',
            variant: 'destructive',
          });
          router.push('/login');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        toast({
          title: 'Authentication Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
        router.push('/login');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4'></div>
        <p className='text-white text-lg'>Completing authentication...</p>
        <p className='text-purple-300 text-sm mt-2'>
          Please wait while we set up your account...
        </p>
      </div>
    </div>
  );
}
