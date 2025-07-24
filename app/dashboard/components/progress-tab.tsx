'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Trophy, Heart, Activity } from 'lucide-react';

interface Stats {
  totalMinutes: number;
  avgHeartRate: number;
}

interface ProgressTabProps {
  stats: Stats;
}

export default function ProgressTab({ stats }: ProgressTabProps) {
  return (
    <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
      <CardHeader>
        <CardTitle className='text-white'>Progress Tracking</CardTitle>
        <CardDescription className='text-white/60'>
          Monitor your fitness journey over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          <div className='text-center p-4 bg-white/5 rounded-lg'>
            <Trophy className='h-8 w-8 text-yellow-400 mx-auto mb-2' />
            <div className='text-2xl font-bold text-white'>15</div>
            <div className='text-sm text-white/60'>Goals Achieved</div>
          </div>
          <div className='text-center p-4 bg-white/5 rounded-lg'>
            <Heart className='h-8 w-8 text-red-400 mx-auto mb-2' />
            <div className='text-2xl font-bold text-white'>
              {stats.avgHeartRate}
            </div>
            <div className='text-sm text-white/60'>Avg Heart Rate</div>
          </div>
          <div className='text-center p-4 bg-white/5 rounded-lg'>
            <Activity className='h-8 w-8 text-green-400 mx-auto mb-2' />
            <div className='text-2xl font-bold text-white'>85%</div>
            <div className='text-sm text-white/60'>Goal Completion</div>
          </div>
        </div>
        <div className='h-64 bg-white/5 rounded-lg flex items-center justify-center'>
          <p className='text-white/60'>
            Progress charts will be displayed here
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
