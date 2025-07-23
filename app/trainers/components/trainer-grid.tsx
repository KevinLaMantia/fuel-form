'use client';

import TrainerCard from './trainer-card';

interface Trainer {
  id: number;
  name: string;
  specializations: string[];
  experience: string;
  rating: number;
  reviews: number;
  location: string;
  hourlyRate: number;
  availability: string;
  certifications: string[];
  bio: string;
  avatar: string;
  verified: boolean;
}

interface TrainersGridProps {
  trainers: Trainer[];
}

export default function TrainersGrid({ trainers }: TrainersGridProps) {
  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {trainers.map((trainer) => (
          <TrainerCard key={trainer.id} trainer={trainer} />
        ))}
      </div>
      {trainers.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-white/60 text-lg mb-2'>No trainers found</div>
          <p className='text-white/40'>Try adjusting your search criteria</p>
        </div>
      )}
    </>
  );
}
