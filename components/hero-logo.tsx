import { Dumbbell } from 'lucide-react';

interface HeroLogoProps {
  className?: string;
}

export function HeroLogo({ className = '' }: HeroLogoProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center'>
        <Dumbbell className='w-7 h-7 text-white' />
      </div>
      <div>
        <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>
          FuelForm
        </h1>
        <p className='text-sm text-gray-400'>Fuel Your Form</p>
      </div>
    </div>
  );
}
