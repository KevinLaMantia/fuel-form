'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          router.push('/login?error=auth_callback_failed');
          return;
        }

        if (data.session?.user) {
          const user = data.session.user;
          const userType = searchParams.get('type') || 'client';

          // Check if user profile exists
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError);
          }

          // Create or update user profile if needed
          if (!profile) {
            const { error: insertError } = await supabase.from('users').insert({
              id: user.id,
              email: user.email,
              full_name:
                user.user_metadata?.full_name || user.user_metadata?.name || '',
              user_type: userType,
              avatar_url: user.user_metadata?.avatar_url || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

            if (insertError) {
              console.error('Profile creation error:', insertError);
            }
          }

          // Redirect based on user type and profile completion
          if (userType === 'trainer' || profile?.user_type === 'trainer') {
            router.push('/onboarding?type=trainer');
          } else if (!profile?.onboarding_completed) {
            router.push('/onboarding');
          } else {
            router.push('/dashboard');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        router.push('/login?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router, searchParams, supabase]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='w-8 h-8 animate-spin text-purple-400 mx-auto mb-4' />
        <p className='text-white text-lg'>Completing your sign in...</p>
        <p className='text-gray-400 text-sm mt-2'>
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
}
