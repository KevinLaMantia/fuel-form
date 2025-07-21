'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  TrendingUp,
  MessageCircle,
  Target,
  Dumbbell,
  Sparkles,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Shield,
  Zap,
  Award,
  Clock,
  MapPin,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fitness Enthusiast',
    image: 'SJ',
    rating: 5,
    text: "FuelForm connected me with the perfect trainer. I've lost 25 pounds and gained so much confidence!",
    results: 'Lost 25 lbs in 3 months',
  },
  {
    name: 'Mike Chen',
    role: 'Busy Professional',
    image: 'MC',
    rating: 5,
    text: "The custom workout plans fit perfectly into my hectic schedule. Best investment I've made!",
    results: 'Gained 15 lbs muscle',
  },
  {
    name: 'Emily Rodriguez',
    role: 'New Mom',
    image: 'ER',
    rating: 5,
    text: 'Post-pregnancy fitness journey made easy. My trainer understood exactly what I needed.',
    results: 'Back to pre-baby weight',
  },
];

const features = [
  {
    icon: Target,
    title: 'Personalized Programs',
    description:
      'Custom workout and nutrition plans tailored to your specific goals, fitness level, and lifestyle.',
    color: 'from-blue-500 to-purple-600',
  },
  {
    icon: Users,
    title: 'Expert Trainers',
    description:
      'Connect with certified professionals who have proven track records and verified credentials.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description:
      'Advanced analytics to monitor your transformation with detailed insights and milestone celebrations.',
    color: 'from-pink-500 to-red-600',
  },
  {
    icon: MessageCircle,
    title: '24/7 Support',
    description:
      'Direct communication with your trainer plus community support whenever you need motivation.',
    color: 'from-red-500 to-orange-600',
  },
  {
    icon: Dumbbell,
    title: 'Smart Workouts',
    description:
      'AI-powered exercise recommendations that adapt based on your progress and preferences.',
    color: 'from-orange-500 to-yellow-600',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description:
      'Your health data and payments are protected with enterprise-grade security and privacy.',
    color: 'from-green-500 to-blue-600',
  },
];

const stats = [
  { number: '10K+', label: 'Active Users', icon: Users },
  { number: '500+', label: 'Certified Trainers', icon: Award },
  { number: '50+', label: 'Cities Worldwide', icon: MapPin },
  { number: '95%', label: 'Success Rate', icon: TrendingUp },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'Perfect for beginners starting their fitness journey',
    features: [
      'Basic workout plans',
      'Nutrition guidelines',
      'Progress tracking',
      'Community access',
      'Email support',
    ],
    popular: false,
    color: 'from-blue-500 to-purple-600',
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/month',
    description: 'Most popular choice for serious fitness enthusiasts',
    features: [
      'Custom workout plans',
      'Personalized nutrition',
      '1-on-1 trainer sessions',
      'Advanced analytics',
      'Priority support',
      'Meal planning tools',
    ],
    popular: true,
    color: 'from-purple-500 to-pink-600',
  },
  {
    name: 'Elite',
    price: '$199',
    period: '/month',
    description: 'Premium experience with unlimited access',
    features: [
      'Unlimited trainer access',
      'Custom meal prep',
      'Weekly video calls',
      'Supplement guidance',
      '24/7 chat support',
      'Exclusive community',
      'Body composition analysis',
    ],
    popular: false,
    color: 'from-pink-500 to-red-600',
  },
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleSectionChange = () => {
      const sections = ['hero', 'features', 'testimonials', 'pricing'];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleSectionChange);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleSectionChange);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden'>
      {/* Animated Background Elements */}
      <div className='fixed inset-0 z-0 opacity-20'>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob'></div>
        <div className='absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000'></div>
        <div className='absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000'></div>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-900/95 backdrop-blur-lg border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center'>
                <Dumbbell className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-bold'>FuelForm</span>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center space-x-8'>
              {[
                { id: 'hero', label: 'Home' },
                { id: 'features', label: 'Features' },
                { id: 'testimonials', label: 'Reviews' },
                { id: 'pricing', label: 'Pricing' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-purple-300 ${
                    activeSection === item.id
                      ? 'text-purple-300'
                      : 'text-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className='hidden md:flex items-center space-x-4'>
              <Link href='/login'>
                <Button
                  variant='ghost'
                  className='text-white hover:text-purple-300'
                >
                  Login
                </Button>
              </Link>
              <Link href='/signup'>
                <Button className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0'>
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className='md:hidden'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='text-white'
              >
                {mobileMenuOpen ? (
                  <X className='w-5 h-5' />
                ) : (
                  <Menu className='w-5 h-5' />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className='md:hidden mt-4 pb-4 border-t border-white/10 bg-slate-900/95 backdrop-blur-lg rounded-lg mx-4 px-4'>
              <div className='flex flex-col space-y-4 pt-4'>
                {[
                  { id: 'hero', label: 'Home' },
                  { id: 'features', label: 'Features' },
                  { id: 'testimonials', label: 'Reviews' },
                  { id: 'pricing', label: 'Pricing' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className='text-left text-gray-300 hover:text-purple-300 transition-colors'
                  >
                    {item.label}
                  </button>
                ))}
                <div className='flex flex-col space-y-2 pt-4 border-t border-white/10'>
                  <Link href='/login'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start text-white'
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href='/signup'>
                    <Button className='w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0'>
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
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

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-400'>
              <Link href='/signup?type=client'>
                <Button
                  size='lg'
                  className='w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg font-semibold border-0 shadow-2xl transform hover:scale-105 transition-all duration-300'
                >
                  Start Your Journey
                  <ArrowRight className='ml-2 w-5 h-5' />
                </Button>
              </Link>
              <Button
                variant='outline'
                size='lg'
                className='w-full sm:w-auto h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg backdrop-blur-sm'
                onClick={() => scrollToSection('features')}
              >
                <Play className='mr-2 w-5 h-5' />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fade-in delay-600'>
              {stats.map((stat, index) => (
                <div key={index} className='text-center'>
                  <div className='flex justify-center mb-2'>
                    <stat.icon className='w-8 h-8 text-purple-400' />
                  </div>
                  <div className='text-3xl md:text-4xl font-bold text-white mb-1'>
                    {stat.number}
                  </div>
                  <div className='text-sm text-gray-400'>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
              <ChevronDown className='w-6 h-6 text-gray-400' />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
            {features.map((feature, index) => (
              <Card
                key={index}
                className='group bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl'
              >
                <CardHeader className='pb-4'>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className='w-6 h-6 text-white' />
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
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
                      <p className='text-sm text-gray-400'>
                        {testimonial.role}
                      </p>
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

          {/* Trust Indicators */}
          <div className='mt-16 text-center'>
            <div className='flex flex-wrap justify-center items-center gap-8 opacity-60'>
              <div className='flex items-center space-x-2'>
                <Shield className='w-5 h-5 text-green-400' />
                <span className='text-sm text-gray-300'>SSL Secured</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Award className='w-5 h-5 text-yellow-400' />
                <span className='text-sm text-gray-300'>
                  Certified Trainers
                </span>
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

      {/* Pricing Section */}
      <section
        id='pricing'
        className='relative z-10 py-24 bg-gradient-to-b from-transparent to-slate-900'
      >
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <Badge className='mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30'>
              Pricing
            </Badge>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
              Choose Your
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400'>
                {' '}
                Perfect Plan
              </span>
            </h2>
            <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
              Flexible pricing options designed to fit your budget and fitness
              goals. Start free, upgrade anytime.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-white/5 backdrop-blur-lg border transition-all duration-300 hover:transform hover:scale-105 ${
                  plan.popular
                    ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20 scale-105'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                    <Badge className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1'>
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className='text-center pb-4'>
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <Dumbbell className='w-8 h-8 text-white' />
                  </div>
                  <CardTitle className='text-2xl font-bold text-white'>
                    {plan.name}
                  </CardTitle>
                  <div className='flex items-baseline justify-center space-x-1 mt-4'>
                    <span className='text-4xl font-bold text-white'>
                      {plan.price}
                    </span>
                    <span className='text-gray-400'>{plan.period}</span>
                  </div>
                  <CardDescription className='text-gray-300 mt-2'>
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className='space-y-6'>
                  <ul className='space-y-3'>
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className='flex items-center space-x-3'
                      >
                        <CheckCircle className='w-5 h-5 text-green-400 flex-shrink-0' />
                        <span className='text-gray-300'>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={`/signup?plan=${plan.name.toLowerCase()}`}>
                    <Button
                      className={`w-full h-12 font-semibold transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg'
                          : 'bg-white/10 border border-white/30 text-white hover:bg-white/20'
                      }`}
                    >
                      Get Started
                      <ArrowRight className='ml-2 w-4 h-4' />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Money Back Guarantee */}
          <div className='text-center mt-12'>
            <div className='inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3'>
              <Shield className='w-5 h-5 text-green-400' />
              <span className='text-green-300 font-medium'>
                30-day money-back guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className='relative z-10 bg-slate-900 border-t border-white/10 py-12'>
        <div className='container mx-auto px-4'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center'>
                  <Dumbbell className='w-5 h-5 text-white' />
                </div>
                <span className='text-xl font-bold text-white'>FuelForm</span>
              </div>
              <p className='text-gray-400'>
                Transform your fitness journey with personalized training and
                expert guidance.
              </p>
            </div>

            <div>
              <h4 className='font-semibold text-white mb-4'>Product</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link
                    href='/features'
                    className='hover:text-purple-300 transition-colors'
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href='/pricing'
                    className='hover:text-purple-300 transition-colors'
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href='/trainers'
                    className='hover:text-purple-300 transition-colors'
                  >
                    Find Trainers
                  </Link>
                </li>
                <li>
                  <Link
                    href='/mobile'
                    className='hover:text-purple-300 transition-colors'
                  >
                    Mobile App
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='font-semibold text-white mb-4'>Company</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link
                    href='/about'
                    className='hover:text-purple-300 transition-colors'
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href='/careers'
                    className='hover:text-purple-300 transition-colors'
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href='/blog'
                    className='hover:text-purple-300 transition-colors'
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href='/contact'
                    className='hover:text-purple-300 transition-colors'
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='font-semibold text-white mb-4'>Support</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link
                    href='/help'
                    className='hover:text-purple-300 transition-colors'
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href='/privacy'
                    className='hover:text-purple-300 transition-colors'
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href='/terms'
                    className='hover:text-purple-300 transition-colors'
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href='/security'
                    className='hover:text-purple-300 transition-colors'
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-white/10 mt-12 pt-8 text-center text-gray-400'>
            <p>
              &copy; {new Date().getFullYear()} FuelForm. All rights reserved.
              Built with ❤️ for fitness enthusiasts worldwide.
            </p>
          </div>
        </div>
      </footer>

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
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-600 {
          animation-delay: 0.6s;
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

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
