'use client';

import type React from 'react';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Dumbbell,
  Heart,
  Users,
  MapPin,
  Clock,
  Mail,
  CheckCircle,
  XCircle,
  Loader2,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Copy,
  ArrowDown,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Set your actual launch date here - UPDATE THE ENV VARIABLE WITH YOUR LAUNCH DATE
const goLiveDate = process.env.NEXT_PUBLIC_LAUNCH_DATE ?? '2025-12-01';
const LAUNCH_DATE = new Date(goLiveDate);

interface WaitlistStats {
  total: number;
  trainers: number;
  clients: number;
  cities: number;
  recentSignups: number;
}

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLaunched, setIsLaunched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [stats, setStats] = useState<WaitlistStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const { toast } = useToast();

  const calculateTimeLeft = () => {
    const difference = +LAUNCH_DATE - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      setIsLaunched(true);
    }
    return timeLeft;
  };

  useEffect(() => {
    setCountdown(calculateTimeLeft());
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await fetch('/api/waitlist/stats');
        if (!response.ok) {
          throw new Error(
            `Failed to fetch waitlist stats: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setStats(data);
      } catch (error: any) {
        console.error('Error fetching waitlist stats:', error.message);
        toast({
          title: 'Error',
          description: 'Failed to load waitlist statistics.',
          variant: 'destructive',
        });
        // Fallback to dummy data if API fails
        setStats({
          total: 247,
          trainers: 23,
          clients: 224,
          cities: 15,
          recentSignups: 12,
        });
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
    const statsInterval = setInterval(fetchStats, 30000);
    return () => clearInterval(statsInterval);
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setEmail('');
        toast({
          title: 'Success!',
          description:
            'You have been added to the waitlist. Get ready to transform!',
          className:
            'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
        });
        // Refresh stats after successful signup
        const statsResponse = await fetch('/api/waitlist/stats');
        if (statsResponse.ok) {
          const data = await statsResponse.json();
          setStats(data);
        }
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        toast({
          title: 'Error',
          description:
            errorData.error || 'Failed to join waitlist. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedLaunchDate = useMemo(() => {
    return LAUNCH_DATE.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText =
    'Get ready for FuelForm – the ultimate fitness platform! Join the waitlist now!';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Copied!',
      description: 'Share link copied to clipboard.',
    });
  };

  const scrollToDetails = () => {
    document
      .getElementById('details-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white overflow-hidden'>
      {/* Hero Section - Above the fold */}
      <section className='relative z-10 min-h-screen flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto px-4'>
        {/* Logo */}
        <div className='relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl animate-pulse-slow'>
          <Dumbbell className='w-12 h-12 text-white' />
        </div>

        {/* Hero Title - More concise */}
        <div className='space-y-4'>
          <h1 className='text-5xl md:text-7xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 animate-fade-in'>
            FuelForm is Coming Soon!
          </h1>
          <p className='text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto animate-fade-in delay-100'>
            Connect with certified trainers. Get custom workouts. Transform your
            fitness journey.
          </p>
        </div>

        {/* Countdown - More prominent */}
        <Card className='w-full max-w-lg bg-white/15 backdrop-blur-lg border border-white/30 shadow-2xl animate-fade-in delay-200'>
          <CardHeader>
            <CardTitle className='text-3xl font-bold text-white flex items-center justify-center gap-3'>
              <Clock className='w-8 h-8 text-purple-300' />
              {isLaunched ? "We're Live!" : `Launch: ${formattedLaunchDate}`}
            </CardTitle>
          </CardHeader>
          <CardContent className='pb-6'>
            {isLaunched ? (
              <div className='text-center text-4xl md:text-6xl font-extrabold text-green-400 animate-bounce-once'>
                Welcome to FuelForm!
              </div>
            ) : (
              <div className='grid grid-cols-4 gap-4 text-white'>
                <div className='flex flex-col items-center'>
                  <span className='text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300'>
                    {String(countdown.days).padStart(2, '0')}
                  </span>
                  <span className='text-sm text-gray-300 mt-1'>Days</span>
                </div>
                <div className='flex flex-col items-center'>
                  <span className='text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300'>
                    {String(countdown.hours).padStart(2, '0')}
                  </span>
                  <span className='text-sm text-gray-300 mt-1'>Hours</span>
                </div>
                <div className='flex flex-col items-center'>
                  <span className='text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300'>
                    {String(countdown.minutes).padStart(2, '0')}
                  </span>
                  <span className='text-sm text-gray-300 mt-1'>Minutes</span>
                </div>
                <div className='flex flex-col items-center'>
                  <span className='text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300'>
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                  <span className='text-sm text-gray-300 mt-1'>Seconds</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced CTA - More prominent */}
        <div className='w-full max-w-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg border-2 border-purple-400/50 shadow-2xl animate-fade-in delay-300 rounded-lg overflow-hidden'>
          <div className='bg-transparent'>
            <div className='text-center py-6 px-6 bg-transparent'>
              <div className='text-3xl font-bold text-white flex items-center justify-center gap-3 mb-2'>
                <Mail className='w-8 h-8 text-pink-300' />
                Join the Waitlist
              </div>
              <p className='text-gray-200 text-center'>
                Be the first to experience the future of fitness
              </p>
            </div>
            <div className='px-6 pb-6 bg-transparent'>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <Input
                  type='email'
                  placeholder='Enter your email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='h-12 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-lg backdrop-blur-sm'
                />
                <Button
                  type='submit'
                  size='lg'
                  className='w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 border-0 !bg-gradient-to-r !from-purple-600 !to-blue-600'
                  disabled={isSubmitting}
                  style={{
                    background:
                      'linear-gradient(to right, rgb(147 51 234), rgb(37 99 235))',
                    border: 'none',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                      Joining Waitlist...
                    </>
                  ) : (
                    'Get Early Access'
                  )}
                </Button>
              </form>
              {submitStatus === 'success' && (
                <div className='mt-4 text-center text-green-400 flex items-center justify-center gap-2 animate-bounce-once'>
                  <CheckCircle className='w-5 h-5' />
                  <span className='font-semibold'>
                    Successfully joined! Check your email.
                  </span>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className='mt-4 text-center text-red-400 flex items-center justify-center gap-2 animate-shake'>
                  <XCircle className='w-5 h-5' />
                  <span>Something went wrong. Please try again.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <Button
          variant='ghost'
          onClick={scrollToDetails}
          className='mt-8 text-white/70 hover:text-black animate-bounce'
        >
          <ArrowDown className='w-6 h-6' />
        </Button>
      </section>

      {/* Details Section - Below the fold */}
      <section id='details-section' className='relative z-10 py-16 px-4'>
        <div className='max-w-4xl mx-auto space-y-12'>
          {/* Waitlist Progress */}
          <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold text-white flex items-center justify-center gap-2'>
                <Users className='w-6 h-6 text-yellow-300' />
                Join {stats?.total.toLocaleString()} Others Waiting
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {statsLoading ? (
                <div className='flex justify-center items-center py-4'>
                  <Loader2 className='h-8 w-8 animate-spin text-gray-300' />
                </div>
              ) : (
                <>
                  <div className='text-center'>
                    <div className='text-4xl font-bold text-white mb-2'>
                      {stats?.total.toLocaleString()}
                    </div>
                    <Progress
                      value={((stats?.total || 0) / 1000) * 100}
                      className='h-3 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-orange-500'
                    />
                    <div className='text-sm text-gray-300 mt-2'>
                      Goal: 1,000 members
                    </div>
                  </div>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
                    <div className='space-y-2'>
                      <Dumbbell className='w-6 h-6 text-purple-300 mx-auto' />
                      <div className='text-2xl font-bold text-white'>
                        {stats?.trainers}
                      </div>
                      <div className='text-sm text-gray-300'>Trainers</div>
                    </div>
                    <div className='space-y-2'>
                      <Heart className='w-6 h-6 text-pink-300 mx-auto' />
                      <div className='text-2xl font-bold text-white'>
                        {stats?.clients}
                      </div>
                      <div className='text-sm text-gray-300'>Clients</div>
                    </div>
                    <div className='space-y-2'>
                      <MapPin className='w-6 h-6 text-blue-300 mx-auto' />
                      <div className='text-2xl font-bold text-white'>
                        {stats?.cities}
                      </div>
                      <div className='text-sm text-gray-300'>Cities</div>
                    </div>
                    <div className='space-y-2'>
                      <Clock className='w-6 h-6 text-green-300 mx-auto' />
                      <div className='text-2xl font-bold text-white'>
                        {stats?.recentSignups}
                      </div>
                      <div className='text-sm text-gray-300'>Today</div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Simplified Timeline */}
          <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold text-white text-center'>
                What's Coming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid md:grid-cols-3 gap-6'>
                <div className='text-center space-y-3'>
                  <div className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto'>
                    <Users className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-lg font-bold text-white'>
                    Find Your Trainer
                  </h3>
                  <p className='text-gray-300 text-sm'>
                    Browse certified trainers and find your perfect match
                  </p>
                </div>
                <div className='text-center space-y-3'>
                  <div className='w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mx-auto'>
                    <Dumbbell className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-lg font-bold text-white'>
                    Custom Programs
                  </h3>
                  <p className='text-gray-300 text-sm'>
                    Get personalized workouts and nutrition plans
                  </p>
                </div>
                <div className='text-center space-y-3'>
                  <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center mx-auto'>
                    <Heart className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-lg font-bold text-white'>
                    Track Progress
                  </h3>
                  <p className='text-gray-300 text-sm'>
                    Monitor your transformation with detailed analytics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Section */}
          <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold text-white flex items-center justify-center gap-2'>
                <Share2 className='w-6 h-6 text-cyan-300' />
                Spread the Word
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-200 text-center mb-6'>
                Help us reach our goal faster! Share FuelForm with friends who
                love fitness.
              </p>
              <div className='flex justify-center gap-4'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 transition-all duration-300 ease-in-out transform hover:scale-110'
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        shareText
                      )}&url=${encodeURIComponent(shareUrl)}`,
                      '_blank'
                    )
                  }
                >
                  <Twitter className='w-5 h-5' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='bg-blue-700 hover:bg-blue-800 text-white rounded-full w-12 h-12 transition-all duration-300 ease-in-out transform hover:scale-110'
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                        shareUrl
                      )}&title=${encodeURIComponent(shareText)}`,
                      '_blank'
                    )
                  }
                >
                  <Linkedin className='w-5 h-5' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='bg-blue-800 hover:bg-blue-900 text-white rounded-full w-12 h-12 transition-all duration-300 ease-in-out transform hover:scale-110'
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        shareUrl
                      )}`,
                      '_blank'
                    )
                  }
                >
                  <Facebook className='w-5 h-5' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='bg-gray-600 hover:bg-gray-700 text-white rounded-full w-12 h-12 transition-all duration-300 ease-in-out transform hover:scale-110'
                  onClick={copyToClipboard}
                >
                  <Copy className='w-5 h-5' />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className='mt-16 text-center text-gray-400 text-sm'>
          &copy; {new Date().getFullYear()} FuelForm. All rights reserved.
        </footer>
      </section>

      {/* Enhanced CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(5deg);
          }
          66% {
            transform: translateY(10px) rotate(-3deg);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite 2s;
        }

        @keyframes pulseSlow {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s infinite ease-in-out;
        }

        @keyframes bounceOnce {
          0%,
          100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(0);
          }
          75% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-once {
          animation: bounceOnce 0.8s ease-out;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
