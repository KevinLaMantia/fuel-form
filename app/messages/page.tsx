'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Star,
  MapPin,
  DollarSign,
  Users,
  Award,
  Calendar,
} from 'lucide-react';
import { NavigationHeader } from '@/components/navigation-header';
import { getCurrentUser, type User } from '@/lib/auth';
import { useRouter } from 'next/navigation';

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
    specializations: [
      'Strength Training',
      'Powerlifting',
      'Sports Performance',
    ],
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

  const handleVerifiedOnlyChange = (checked: boolean | 'indeterminate') => {
    setVerifiedOnly(checked === true);
  };

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
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>
            Find Your Perfect Trainer
          </h1>
          <p className='text-white/70'>
            Connect with certified fitness professionals to reach your goals
          </p>
        </div>

        {/* Search and Filters */}
        <div className='mb-8 space-y-4'>
          {/* Search Bar */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60' />
            <Input
              placeholder='Search trainers by name or specialization...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-purple-400 focus:ring-purple-400/20'
            />
          </div>

          {/* Filters */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
            <Select
              value={selectedSpecialization}
              onValueChange={setSelectedSpecialization}
            >
              <SelectTrigger className='bg-white/10 border-white/20 text-white'>
                <SelectValue placeholder='Specialization' />
              </SelectTrigger>
              <SelectContent className='bg-slate-800 border-white/20'>
                <SelectItem value='all' className='text-white'>
                  All Specializations
                </SelectItem>
                {allSpecializations.map((spec) => (
                  <SelectItem key={spec} value={spec} className='text-white'>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className='bg-white/10 border-white/20 text-white'>
                <SelectValue placeholder='Location' />
              </SelectTrigger>
              <SelectContent className='bg-slate-800 border-white/20'>
                <SelectItem value='all' className='text-white'>
                  All Locations
                </SelectItem>
                {allLocations.map((location) => (
                  <SelectItem
                    key={location}
                    value={location}
                    className='text-white'
                  >
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className='bg-white/10 border-white/20 text-white'>
                <SelectValue placeholder='Price Range' />
              </SelectTrigger>
              <SelectContent className='bg-slate-800 border-white/20'>
                <SelectItem value='all' className='text-white'>
                  All Prices
                </SelectItem>
                <SelectItem value='under-75' className='text-white'>
                  Under $75/hr
                </SelectItem>
                <SelectItem value='75-90' className='text-white'>
                  $75-90/hr
                </SelectItem>
                <SelectItem value='over-90' className='text-white'>
                  Over $90/hr
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={availabilityFilter}
              onValueChange={setAvailabilityFilter}
            >
              <SelectTrigger className='bg-white/10 border-white/20 text-white'>
                <SelectValue placeholder='Availability' />
              </SelectTrigger>
              <SelectContent className='bg-slate-800 border-white/20'>
                <SelectItem value='all' className='text-white'>
                  All Trainers
                </SelectItem>
                <SelectItem value='Available' className='text-white'>
                  Available
                </SelectItem>
                <SelectItem value='Busy' className='text-white'>
                  Busy
                </SelectItem>
              </SelectContent>
            </Select>

            <div className='flex items-center space-x-2'>
              <Checkbox
                id='verified'
                checked={verifiedOnly}
                onCheckedChange={handleVerifiedOnlyChange}
                className='border-white/20 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600'
              />
              <label
                htmlFor='verified'
                className='text-sm text-white cursor-pointer'
              >
                Verified Only
              </label>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className='mb-6'>
          <p className='text-white/70'>
            Showing {filteredTrainers.length} of {trainers.length} trainers
          </p>
        </div>

        {/* Trainers Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredTrainers.map((trainer) => (
            <Card
              key={trainer.id}
              className='bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 hover:scale-105'
            >
              <CardHeader className='pb-4'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center space-x-3'>
                    <Avatar className='h-12 w-12'>
                      <AvatarFallback className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                        {trainer.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='flex items-center space-x-2'>
                        <CardTitle className='text-white text-lg'>
                          {trainer.name}
                        </CardTitle>
                        {trainer.verified && (
                          <Badge className='bg-green-600 text-white text-xs'>
                            <Award className='h-3 w-3 mr-1' />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className='flex items-center space-x-1 mt-1'>
                        <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                        <span className='text-white text-sm'>
                          {trainer.rating}
                        </span>
                        <span className='text-white/60 text-sm'>
                          ({trainer.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`${
                      trainer.availability === 'Available'
                        ? 'bg-green-600 text-white'
                        : 'bg-orange-600 text-white'
                    }`}
                  >
                    {trainer.availability}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className='space-y-4'>
                <p className='text-white/80 text-sm'>{trainer.bio}</p>

                <div className='space-y-2'>
                  <div className='flex items-center space-x-2 text-sm text-white/70'>
                    <Users className='h-4 w-4' />
                    <span>{trainer.experience} experience</span>
                  </div>
                  <div className='flex items-center space-x-2 text-sm text-white/70'>
                    <MapPin className='h-4 w-4' />
                    <span>{trainer.location}</span>
                  </div>
                  <div className='flex items-center space-x-2 text-sm text-white/70'>
                    <DollarSign className='h-4 w-4' />
                    <span>${trainer.hourlyRate}/hour</span>
                  </div>
                </div>

                <div>
                  <h4 className='text-white font-medium text-sm mb-2'>
                    Specializations
                  </h4>
                  <div className='flex flex-wrap gap-1'>
                    {trainer.specializations.map((spec) => (
                      <Badge
                        key={spec}
                        className='bg-purple-600/20 text-purple-300 border-purple-400/20 text-xs'
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='text-white font-medium text-sm mb-2'>
                    Certifications
                  </h4>
                  <div className='flex flex-wrap gap-1'>
                    {trainer.certifications.map((cert) => (
                      <Badge
                        key={cert}
                        className='bg-blue-600/20 text-blue-300 border-blue-400/20 text-xs'
                      >
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className='flex space-x-2 pt-4'>
                  <Button className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0'>
                    View Profile
                  </Button>
                  <Button
                    variant='outline'
                    className='border-white/20 text-white hover:bg-white/10 bg-transparent'
                  >
                    <Calendar className='h-4 w-4' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrainers.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-white/60 text-lg mb-2'>No trainers found</div>
            <p className='text-white/40'>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
