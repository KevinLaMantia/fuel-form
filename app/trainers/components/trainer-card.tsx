'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, DollarSign, Users, Award, Calendar } from 'lucide-react';

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

interface TrainerCardProps {
  trainer: Trainer;
}

export default function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <Card className='bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 hover:scale-105'>
      <CardHeader className='pb-4'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center space-x-3'>
            <Avatar className='h-12 w-12'>
              <AvatarFallback className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                {trainer.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className='flex items-center space-x-2'>
                <CardTitle className='text-white text-lg'>
                  {trainer.name}
                </CardTitle>
                {trainer.verified && (
                  <Badge className='bg-green-600 text-white text-xs'>
                    <Award className='h-3 w-3 mr-1' />
                    Verified
                  </Badge>
                )}
              </div>
              <div className='flex items-center space-x-1 mt-1'>
                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                <span className='text-white text-sm'>{trainer.rating}</span>
                <span className='text-white/60 text-sm'>
                  ({trainer.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
          <Badge
            className={`${
              trainer.availability === 'Available'
                ? 'bg-green-600 text-white'
                : 'bg-orange-600 text-white'
            }`}
          >
            {trainer.availability}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-white/80 text-sm'>{trainer.bio}</p>
        <div className='space-y-2'>
          <div className='flex items-center space-x-2 text-sm text-white/70'>
            <Users className='h-4 w-4' />
            <span>{trainer.experience} experience</span>
          </div>
          <div className='flex items-center space-x-2 text-sm text-white/70'>
            <MapPin className='h-4 w-4' />
            <span>{trainer.location}</span>
          </div>
          <div className='flex items-center space-x-2 text-sm text-white/70'>
            <DollarSign className='h-4 w-4' />
            <span>${trainer.hourlyRate}/hour</span>
          </div>
        </div>
        <div>
          <h4 className='text-white font-medium text-sm mb-2'>
            Specializations
          </h4>
          <div className='flex flex-wrap gap-1'>
            {trainer.specializations.map((spec) => (
              <Badge
                key={spec}
                className='bg-purple-600/20 text-purple-300 border-purple-400/20 text-xs'
              >
                {spec}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className='text-white font-medium text-sm mb-2'>
            Certifications
          </h4>
          <div className='flex flex-wrap gap-1'>
            {trainer.certifications.map((cert) => (
              <Badge
                key={cert}
                className='bg-blue-600/20 text-blue-300 border-blue-400/20 text-xs'
              >
                {cert}
              </Badge>
            ))}
          </div>
        </div>
        <div className='flex space-x-2 pt-4'>
          <Button className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0'>
            View Profile
          </Button>
          <Button
            variant='outline'
            className='border-white/20 text-white hover:bg-white/10 bg-transparent'
          >
            <Calendar className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
