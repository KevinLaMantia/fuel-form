'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, MapPin, Users, Award, Search, Filter } from 'lucide-react';
import { NavigationHeader } from '@/components/navigation-header';
import { getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const trainers = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    specialties: ['Weight Loss', 'Strength Training', 'Nutrition'],
    rating: 4.9,
    reviews: 24,
    experience: '5+ years',
    price: 150,
    location: 'Los Angeles, CA',
    clients: 12,
    certifications: ['NASM', 'Precision Nutrition'],
    bio: 'Certified personal trainer specializing in sustainable weight loss and strength building.',
    image: 'SM',
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    specialties: ['Bodybuilding', 'Powerlifting', 'Sports Performance'],
    rating: 4.8,
    reviews: 31,
    experience: '8+ years',
    price: 200,
    location: 'New York, NY',
    clients: 15,
    certifications: ['NSCA', 'CSCS'],
    bio: 'Former competitive bodybuilder helping clients achieve their physique goals.',
    image: 'MJ',
  },
  {
    id: 3,
    name: 'Emily Chen',
    specialties: ['Yoga', 'Pilates', 'Flexibility'],
    rating: 5.0,
    reviews: 18,
    experience: '4+ years',
    price: 120,
    location: 'San Francisco, CA',
    clients: 8,
    certifications: ['RYT-500', 'PMA'],
    bio: 'Yoga instructor focused on mind-body connection and functional movement.',
    image: 'EC',
  },
  {
    id: 4,
    name: 'David Rodriguez',
    specialties: ['CrossFit', 'HIIT', 'Endurance'],
    rating: 4.7,
    reviews: 22,
    experience: '6+ years',
    price: 175,
    location: 'Austin, TX',
    clients: 10,
    certifications: ['CF-L2', 'ACSM'],
    bio: 'CrossFit coach passionate about functional fitness and metabolic conditioning.',
    image: 'DR',
  },
];

export default function TrainersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState(null);
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

  const specialties = [
    'Weight Loss',
    'Muscle Building',
    'Strength Training',
    'Bodybuilding',
    'CrossFit',
    'Yoga',
    'Pilates',
    'Sports Performance',
    'Nutrition',
  ];

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialties.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesSpecialties =
      selectedSpecialties.length === 0 ||
      selectedSpecialties.some((s) => trainer.specialties.includes(s));

    const matchesPrice =
      !priceRange ||
      (priceRange === 'under-150' && trainer.price < 150) ||
      (priceRange === '150-200' &&
        trainer.price >= 150 &&
        trainer.price <= 200) ||
      (priceRange === 'over-200' && trainer.price > 200);

    return matchesSearch && matchesSpecialties && matchesPrice;
  });

  const sortedTrainers = [...filteredTrainers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'experience':
        return Number.parseInt(b.experience) - Number.parseInt(a.experience);
      default:
        return 0;
    }
  });

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

      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-white mb-2'>
                Find Your Perfect Trainer
              </h1>
              <p className='text-gray-300'>
                Connect with certified fitness professionals
              </p>
            </div>
            <Button
              variant='outline'
              onClick={() => setShowFilters(!showFilters)}
              className='bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm'
            >
              <Filter className='h-4 w-4 mr-2' />
              Filters
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className='mb-8 space-y-4'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search trainers by name or specialty...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm focus:bg-white/20'
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='w-full md:w-48 bg-white/10 border-white/20 text-white backdrop-blur-sm'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent className='bg-slate-800 border-slate-700'>
                <SelectItem
                  value='rating'
                  className='text-white hover:bg-slate-700'
                >
                  Highest Rated
                </SelectItem>
                <SelectItem
                  value='price-low'
                  className='text-white hover:bg-slate-700'
                >
                  Price: Low to High
                </SelectItem>
                <SelectItem
                  value='price-high'
                  className='text-white hover:bg-slate-700'
                >
                  Price: High to Low
                </SelectItem>
                <SelectItem
                  value='experience'
                  className='text-white hover:bg-slate-700'
                >
                  Most Experience
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showFilters && (
            <Card className='bg-white/10 border-white/20 backdrop-blur-sm'>
              <CardContent className='pt-6'>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div>
                    <h3 className='font-medium mb-3 text-white'>Specialties</h3>
                    <div className='grid grid-cols-2 gap-2'>
                      {specialties.map((specialty) => (
                        <div
                          key={specialty}
                          className='flex items-center space-x-2'
                        >
                          <Checkbox
                            id={specialty}
                            checked={selectedSpecialties.includes(specialty)}
                            onCheckedChange={() =>
                              handleSpecialtyToggle(specialty)
                            }
                            className='border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600'
                          />
                          <label
                            htmlFor={specialty}
                            className='text-sm text-gray-300'
                          >
                            {specialty}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className='font-medium mb-3 text-white'>Price Range</h3>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className='bg-white/10 border-white/20 text-white backdrop-blur-sm'>
                        <SelectValue placeholder='Select price range' />
                      </SelectTrigger>
                      <SelectContent className='bg-slate-800 border-slate-700'>
                        <SelectItem
                          value='all'
                          className='text-white hover:bg-slate-700'
                        >
                          All Prices
                        </SelectItem>
                        <SelectItem
                          value='under-150'
                          className='text-white hover:bg-slate-700'
                        >
                          Under $150/month
                        </SelectItem>
                        <SelectItem
                          value='150-200'
                          className='text-white hover:bg-slate-700'
                        >
                          $150 - $200/month
                        </SelectItem>
                        <SelectItem
                          value='over-200'
                          className='text-white hover:bg-slate-700'
                        >
                          Over $200/month
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className='mb-4'>
          <p className='text-gray-300'>
            Showing {sortedTrainers.length} trainer
            {sortedTrainers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Trainer Cards */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {sortedTrainers.map((trainer) => (
            <Card
              key={trainer.id}
              className='bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105'
            >
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-medium'>
                      {trainer.image}
                    </div>
                    <div>
                      <CardTitle className='text-lg text-white'>
                        {trainer.name}
                      </CardTitle>
                      <div className='flex items-center space-x-1 mt-1'>
                        <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                        <span className='text-sm font-medium text-white'>
                          {trainer.rating}
                        </span>
                        <span className='text-sm text-gray-300'>
                          ({trainer.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-bold text-green-400'>
                      ${trainer.price}
                    </p>
                    <p className='text-xs text-gray-400'>per month</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='space-y-4'>
                <p className='text-sm text-gray-300'>{trainer.bio}</p>

                <div className='flex flex-wrap gap-1'>
                  {trainer.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant='secondary'
                      className='text-xs bg-purple-600/30 text-purple-200 border-purple-500/30'
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='flex items-center space-x-2'>
                    <Award className='h-4 w-4 text-gray-400' />
                    <span className='text-gray-300'>{trainer.experience}</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Users className='h-4 w-4 text-gray-400' />
                    <span className='text-gray-300'>
                      {trainer.clients} clients
                    </span>
                  </div>
                  <div className='flex items-center space-x-2 col-span-2'>
                    <MapPin className='h-4 w-4 text-gray-400' />
                    <span className='truncate text-gray-300'>
                      {trainer.location}
                    </span>
                  </div>
                </div>

                <div>
                  <p className='text-xs text-gray-400 mb-1'>Certifications:</p>
                  <div className='flex flex-wrap gap-1'>
                    {trainer.certifications.map((cert) => (
                      <Badge
                        key={cert}
                        variant='outline'
                        className='text-xs border-white/30 text-gray-300'
                      >
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className='flex space-x-2 pt-2'>
                  <Button
                    variant='outline'
                    className='flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm'
                  >
                    View Profile
                  </Button>
                  <Button className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0'>
                    Book Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedTrainers.length === 0 && (
          <Card className='text-center py-12 bg-white/10 border-white/20 backdrop-blur-sm'>
            <CardContent>
              <p className='text-gray-300 mb-4'>
                No trainers found matching your criteria.
              </p>
              <Button
                variant='outline'
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialties([]);
                  setPriceRange('');
                }}
                className='bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm'
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
