'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationHeader } from '@/components/navigation-header';
import { getCurrentUser, type User } from '@/lib/auth';
import SearchBar from './components/searchbar';
import FilterControls from './components/filter-controls';
import ResultsHeader from './components/results-header';
import TrainersGrid from './components/trainer-grid';

const trainers = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    specializations: ['Weight Training', 'HIIT', 'Nutrition'],
    experience: '5 years',
    rating: 4.9,
    reviews: 127,
    location: 'New York, NY',
    hourlyRate: 85,
    availability: 'Available',
    certifications: ['NASM-CPT', 'Precision Nutrition'],
    bio: 'Passionate about helping clients achieve their fitness goals through personalized training programs.',
    avatar: 'SM',
    verified: true,
  },
  {
    id: 2,
    name: 'Mike Johnson',
    specializations: ['Strength Training', 'Powerlifting', 'Sports Performance'],
    experience: '8 years',
    rating: 4.8,
    reviews: 203,
    location: 'Los Angeles, CA',
    hourlyRate: 95,
    availability: 'Busy',
    certifications: ['CSCS', 'USAPL Coach'],
    bio: 'Former competitive powerlifter specializing in strength and performance training.',
    avatar: 'MJ',
    verified: true,
  },
  {
    id: 3,
    name: 'Emily Chen',
    specializations: ['Yoga', 'Pilates', 'Flexibility'],
    experience: '6 years',
    rating: 4.9,
    reviews: 156,
    location: 'San Francisco, CA',
    hourlyRate: 75,
    availability: 'Available',
    certifications: ['RYT-500', 'PMA-CPT'],
    bio: 'Dedicated to helping clients improve flexibility, balance, and mind-body connection.',
    avatar: 'EC',
    verified: true,
  },
  {
    id: 4,
    name: 'David Rodriguez',
    specializations: ['CrossFit', 'Functional Training', 'Cardio'],
    experience: '4 years',
    rating: 4.7,
    reviews: 89,
    location: 'Austin, TX',
    hourlyRate: 70,
    availability: 'Available',
    certifications: ['CF-L2', 'ACSM-CPT'],
    bio: 'High-energy trainer focused on functional fitness and metabolic conditioning.',
    avatar: 'DR',
    verified: false,
  },
];

export default function TrainersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specializations.some((spec) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesSpecialization =
      selectedSpecialization === 'all' ||
      trainer.specializations.includes(selectedSpecialization);
    const matchesLocation =
      selectedLocation === 'all' || trainer.location.includes(selectedLocation);
    const matchesPrice =
      priceRange === 'all' ||
      (priceRange === 'under-75' && trainer.hourlyRate < 75) ||
      (priceRange === '75-90' &&
        trainer.hourlyRate >= 75 &&
        trainer.hourlyRate <= 90) ||
      (priceRange === 'over-90' && trainer.hourlyRate > 90);
    const matchesAvailability =
      availabilityFilter === 'all' ||
      trainer.availability === availabilityFilter;
    const matchesVerified = !verifiedOnly || trainer.verified;

    return (
      matchesSearch &&
      matchesSpecialization &&
      matchesLocation &&
      matchesPrice &&
      matchesAvailability &&
      matchesVerified
    );
  });

  const allSpecializations = Array.from(
    new Set(trainers.flatMap((t) => t.specializations))
  );
  const allLocations = Array.from(
    new Set(trainers.map((t) => t.location.split(', ')[1]))
  );

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      <NavigationHeader user={user} />
      <div className='container mx-auto p-4 space-y-6'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>
            Find Your Perfect Trainer
          </h1>
          <p className='text-white/70'>
            Connect with certified fitness professionals to reach your goals
          </p>
        </div>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <FilterControls
          selectedSpecialization={selectedSpecialization}
          setSelectedSpecialization={setSelectedSpecialization}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          verifiedOnly={verifiedOnly}
          setVerifiedOnly={setVerifiedOnly}
          allSpecializations={allSpecializations}
          allLocations={allLocations}
        />
        <ResultsHeader
          filteredCount={filteredTrainers.length}
          totalCount={trainers.length}
        />
        <TrainersGrid trainers={filteredTrainers} />
      </div>
    </div>
  );
}