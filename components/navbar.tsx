'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Dumbbell } from 'lucide-react';

interface NavBarProps {
  isScrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

export default function NavBar({
  isScrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeSection,
  scrollToSection,
}: NavBarProps) {
  return (
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
  );
}
