'use client';

import Link from 'next/link';
import { Dumbbell } from 'lucide-react';

export default function Footer() {
  return (
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
  );
}
