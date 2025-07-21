import { Loader2 } from 'lucide-react';

export default function AuthCallbackLoading() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='w-8 h-8 animate-spin text-purple-400 mx-auto mb-4' />
        <p className='text-white text-lg'>Processing authentication...</p>
      </div>
    </div>
  );
}
