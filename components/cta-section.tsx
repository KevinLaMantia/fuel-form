'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, Users } from 'lucide-react';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className='relative z-10 py-24 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900'>
      <div className='container mx-auto px-4 text-center'>
        <div className='max-w-4xl mx-auto space-y-8'>
          <h2 className='text-4xl md:text-6xl font-bold text-white'>
            Ready to
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-400'>
              {' '}
              Transform?
            </span>
          </h2>
          <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
            Join thousands of people who have already started their fitness
            transformation. Your journey to a healthier, stronger you starts
            today.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Link href='/signup?type=client'>
              <Button
                size='lg'
                className='w-full sm:w-auto h-16 px-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-xl font-bold border-0 shadow-2xl transform hover:scale-105 transition-all duration-300'
              >
                Start Free Trial
                <Sparkles className='ml-2 w-6 h-6' />
              </Button>
            </Link>
            <Link href='/signup?type=trainer'>
              <Button
                variant='outline'
                size='lg'
                className='w-full sm:w-auto h-16 px-12 bg-white/10 border-white/30 text-white hover:bg-white/20 text-xl backdrop-blur-sm'
              >
                Become a Trainer
                <Users className='ml-2 w-6 h-6' />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
