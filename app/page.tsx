import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  TrendingUp,
  CreditCard,
  MessageCircle,
  Target,
  Dumbbell,
} from 'lucide-react';
import { HeroLogo } from '@/components/hero-logo';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-850 dark:to-gray-800'>
      {/* Header */}
      <header className='container mx-auto px-4 py-6'>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <span className='text-2xl font-bold text-gray-900 dark:text-white'>
              FuelForm
            </span>
          </div>
          <div className='flex items-center space-x-4'>
            <ThemeToggle />
            <Link href='/login'>
              <Button
                variant='ghost'
                className='dark:text-gray-300 dark:hover:text-white'
              >
                Login
              </Button>
            </Link>
            <Link href='/signup'>
              <Button className='dark:bg-blue-600 dark:hover:bg-blue-700'>
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className='container mx-auto px-4 py-16 text-center'>
        <div className='max-w-4xl mx-auto'>
          {/* Prominent Hero Logo */}
          <div className='mb-12 flex justify-center'>
            <HeroLogo
              width={300}
              height={190}
              className='md:w-[400px] md:h-[251px]'
            />
          </div>

          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6'>
            Connect. Train. Transform.
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'>
            The all-in-one platform that connects fitness enthusiasts with
            certified personal trainers for custom workouts, nutrition plans,
            and ongoing support.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/signup?type=client'>
              <Button
                size='lg'
                className='w-full sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700'
              >
                Find Your Trainer
              </Button>
            </Link>
            <Link href='/signup?type=trainer'>
              <Button
                size='lg'
                variant='outline'
                className='w-full sm:w-auto bg-transparent dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
              >
                Become a Trainer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='container mx-auto px-4 py-16 bg-gradient-to-br from-transparent via-blue-25 to-indigo-75 dark:from-transparent dark:via-gray-875 dark:to-gray-825'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
            Everything You Need in One Platform
          </h2>
          <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            FuelForm brings together workout programming, nutrition tracking,
            progress monitoring, and secure payments in one seamless experience.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <Card className='group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1 cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700'>
            <CardHeader>
              <Target className='h-8 w-8 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300' />
              <CardTitle className='dark:text-white'>Custom Programs</CardTitle>
              <CardDescription className='dark:text-gray-300'>
                Get personalized workout and nutrition plans tailored to your
                specific goals and fitness level.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:-rotate-1 cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700'>
            <CardHeader>
              <TrendingUp className='h-8 w-8 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300' />
              <CardTitle className='dark:text-white'>
                Progress Tracking
              </CardTitle>
              <CardDescription className='dark:text-gray-300'>
                Monitor your progress with detailed analytics on workouts,
                nutrition, and body composition changes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1 cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700'>
            <CardHeader>
              <MessageCircle className='h-8 w-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300' />
              <CardTitle className='dark:text-white'>
                Direct Communication
              </CardTitle>
              <CardDescription className='dark:text-gray-300'>
                Stay connected with your trainer through in-app messaging and
                regular check-ins.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:-rotate-1 cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700'>
            <CardHeader>
              <Users className='h-8 w-8 text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300' />
              <CardTitle className='dark:text-white'>Expert Trainers</CardTitle>
              <CardDescription className='dark:text-gray-300'>
                Choose from certified trainers with verified credentials and
                proven track records.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1 cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700'>
            <CardHeader>
              <Dumbbell className='h-8 w-8 text-red-600 dark:text-red-400 mb-2 group-hover:scale-110 transition-transform duration-300' />
              <CardTitle className='dark:text-white'>Macro Tracking</CardTitle>
              <CardDescription className='dark:text-gray-300'>
                Log meals and track calories, protein, carbs, and fat to
                optimize your nutrition.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:-rotate-1 cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700'>
            <CardHeader>
              <CreditCard className='h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform duration-300' />
              <CardTitle className='dark:text-white'>Secure Payments</CardTitle>
              <CardDescription className='dark:text-gray-300'>
                Safe and seamless payment processing with flexible subscription
                and one-time options.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* For Trainers Section */}
      <section className='bg-white dark:bg-gray-800 py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
              Built for Trainers
            </h2>
            <p className='text-gray-600 dark:text-gray-300 mb-8'>
              Scale your personal training business with powerful tools to
              manage clients, create programs, and grow your income.
            </p>

            <div className='grid md:grid-cols-2 gap-8 text-left'>
              <div>
                <h3 className='text-xl font-semibold mb-4 dark:text-white'>
                  Client Management
                </h3>
                <ul className='space-y-2 text-gray-600 dark:text-gray-300'>
                  <li>• Centralized client dashboard</li>
                  <li>• Progress tracking and analytics</li>
                  <li>• Automated check-in reminders</li>
                  <li>• Communication history</li>
                </ul>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-4 dark:text-white'>
                  Business Growth
                </h3>
                <ul className='space-y-2 text-gray-600 dark:text-gray-300'>
                  <li>• Professional profile showcase</li>
                  <li>• Flexible pricing options</li>
                  <li>• Automated billing and payments</li>
                  <li>• Client testimonials and reviews</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='container mx-auto px-4 py-16 text-center'>
        <div className='max-w-2xl mx-auto'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className='text-gray-600 dark:text-gray-300 mb-8'>
            Join thousands of users who have already found their perfect trainer
            match on FuelForm.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/signup?type=client'>
              <Button
                size='lg'
                className='w-full sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700'
              >
                Start as Client
              </Button>
            </Link>
            <Link href='/signup?type=trainer'>
              <Button
                size='lg'
                variant='outline'
                className='w-full sm:w-auto bg-transparent dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
              >
                Join as Trainer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 dark:bg-gray-950 text-white py-12'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-center space-x-2 mb-8'>
            <span className='text-xl font-bold'>FuelForm</span>
          </div>
          <div className='text-center text-gray-400'>
            <p>&copy; 2025 FuelForm LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
