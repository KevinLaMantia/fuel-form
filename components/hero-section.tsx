'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown, Users, Award, MapPin, TrendingUp, ArrowRight } from 'lucide-react';

interface Stat {
  number: string;
  label: string;
  icon: string;
}

interface HeroSectionProps {
  stats: Stat[];
}

const iconMap = {
  Users,
  Award,
  MapPin,
  TrendingUp,
};

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section
      id='hero'
      className='relative z-10 min-h-screen flex items-center justify-center pt-20'
    >
      <div className='container mx-auto px-4 text-center'>
        <div className='max-w-5xl mx-auto space-y-6'>
          <div className='space-y-6 animate-fade-in delay-200'>
            <h1 className='text-5xl md:text-7xl font-extrabold leading-tight'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400'>
                Transform Your
              </span>
              <br />
              <span className='text-white'>Fitness Journey</span>
            </h1>
            <p className='text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
              Connect with world-class personal trainers, get custom workout
              plans, and achieve your fitness goals faster than ever before.
            </p>
          </div>

          <div className='flex justify-center items-center animate-fade-in delay-400'>
            <Link href='/signup?type=client'>
              <Button
                size='lg'
                className='h-14 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg font-semibold border-0 shadow-2xl transform hover:scale-105 transition-all duration-300'
              >
                Start Your Journey
                <ArrowRight className='ml-2 w-5 h-5' />
              </Button>
            </Link>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fade-in delay-600'>
            {stats.map((stat, index) => {
              const Icon = iconMap[stat.icon as keyof typeof iconMap];
              return (
                <div key={index} className='text-center'>
                  <div className='flex justify-center mb-2'>
                    <Icon className='w-8 h-8 text-purple-400' />
                  </div>
                  <div className='text-3xl md:text-4xl font-bold text-white mb-1'>
                    {stat.number}
                  </div>
                  <div className='text-sm text-gray-400'>{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
            <ChevronDown className='w-6 h-6 text-gray-400' />
          </div>
        </div>
      </div>
    </section>
  );
}
