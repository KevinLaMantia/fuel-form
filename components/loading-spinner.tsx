'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto'></div>
        <p className='mt-4 text-white/70'>Loading...</p>
      </div>
    </div>
  );
}
