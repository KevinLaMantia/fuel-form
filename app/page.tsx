'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/navbar';
import AnimatedBackground from '@/components/animated-background';
import HeroSection from '@/components/hero-section';
import FeaturesSection from '@/components/feature-section';
import TestimonialsSection from '@/components/testimonials-section';
import PricingSection from '@/components/pricing-section';
import CtaSection from '@/components/cta-section';
import Footer from '@/components/footer';

const stats = [
  { number: '10K+', label: 'Active Users', icon: 'Users' },
  { number: '500+', label: 'Certified Trainers', icon: 'Award' },
  { number: '50+', label: 'Cities Worldwide', icon: 'MapPin' },
  { number: '95%', label: 'Success Rate', icon: 'TrendingUp' },
];

const features = [
  {
    icon: 'Target',
    title: 'Personalized Programs',
    description:
      'Custom workout and nutrition plans tailored to your specific goals, fitness level, and lifestyle.',
    color: 'from-blue-500 to-purple-600',
  },
  {
    icon: 'Users',
    title: 'Expert Trainers',
    description:
      'Connect with certified professionals who have proven track records and verified credentials.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: 'TrendingUp',
    title: 'Progress Tracking',
    description:
      'Advanced analytics to monitor your transformation with detailed insights and milestone celebrations.',
    color: 'from-pink-500 to-red-600',
  },
  {
    icon: 'MessageCircle',
    title: '24/7 Support',
    description:
      'Direct communication with your trainer plus community support whenever you need motivation.',
    color: 'from-red-500 to-orange-600',
  },
  {
    icon: 'Dumbbell',
    title: 'Smart Workouts',
    description:
      'AI-powered exercise recommendations that adapt based on your progress and preferences.',
    color: 'from-orange-500 to-yellow-600',
  },
  {
    icon: 'Shield',
    title: 'Secure Platform',
    description:
      'Your health data and payments are protected with enterprise-grade security and privacy.',
    color: 'from-green-500 to-blue-600',
  },
];

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
      <AnimatedBackground />
      <NavBar
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />
      <HeroSection stats={stats} />
      <FeaturesSection features={features} />
      <TestimonialsSection testimonials={testimonials} />
      <PricingSection pricingPlans={pricingPlans} />
      <CtaSection />
      <Footer />
    </div>
  );
}
