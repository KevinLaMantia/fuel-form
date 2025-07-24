'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Award, Clock, Zap } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
  results: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section
      id='testimonials'
      className='relative z-10 py-24 bg-gradient-to-b from-slate-900/50 to-transparent'
    >
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
          <Badge className='mb-4 bg-pink-500/20 text-pink-300 border-pink-500/30'>
            Success Stories
          </Badge>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Real People,
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-yellow-400'>
              {' '}
              Real Results
            </span>
          </h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            Join thousands of people who have transformed their lives with
            FuelForm. Your success story could be next.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className='bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105'
            >
              <CardHeader>
                <div className='flex items-center space-x-4 mb-4'>
                  <div className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold'>
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className='font-semibold text-white'>
                      {testimonial.name}
                    </h4>
                    <p className='text-sm text-gray-400'>{testimonial.role}</p>
                  </div>
                </div>
                <div className='flex space-x-1 mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-4 h-4 fill-yellow-400 text-yellow-400'
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-gray-300 mb-4 italic'>
                  "{testimonial.text}"
                </p>
                <div className='bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-3 border border-green-500/30'>
                  <p className='text-green-300 font-semibold text-sm'>
                    ✨ {testimonial.results}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='mt-16 text-center'>
          <div className='flex flex-wrap justify-center items-center gap-8 opacity-60'>
            <div className='flex items-center space-x-2'>
              <Shield className='w-5 h-5 text-green-400' />
              <span className='text-sm text-gray-300'>SSL Secured</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Award className='w-5 h-5 text-yellow-400' />
              <span className='text-sm text-gray-300'>Certified Trainers</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Clock className='w-5 h-5 text-blue-400' />
              <span className='text-sm text-gray-300'>24/7 Support</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Zap className='w-5 h-5 text-purple-400' />
              <span className='text-sm text-gray-300'>Instant Access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
