'use client';

export default function AnimatedBackground() {
  return (
    <div className='fixed inset-0 z-0 opacity-20'>
      <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob'></div>
      <div className='absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000'></div>
      <div className='absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000'></div>
    </div>
  );
}
