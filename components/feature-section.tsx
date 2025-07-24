'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Users,
  TrendingUp,
  MessageCircle,
  Dumbbell,
  Shield,
} from 'lucide-react';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface FeaturesSectionProps {
  features: Feature[];
}

const iconMap = {
  Target,
  Users,
  TrendingUp,
  MessageCircle,
  Dumbbell,
  Shield,
};

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section
      id='features'
      className='relative z-10 py-24 bg-gradient-to-b from-transparent to-slate-900/50'
    >
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
          <Badge className='mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30'>
            Features
          </Badge>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Everything You Need to
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400'>
              {' '}
              Succeed
            </span>
          </h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            Our comprehensive platform combines cutting-edge technology with
            human expertise to deliver results that exceed your expectations.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <Card
                key={index}
                className='group bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl'
              >
                <CardHeader className='pb-4'>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className='w-6 h-6 text-white' />
                  </div>
                  <CardTitle className='text-xl font-bold text-white group-hover:text-purple-300 transition-colors'>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-gray-300 leading-relaxed'>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
