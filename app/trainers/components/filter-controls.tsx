'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface FilterControlsProps {
  selectedSpecialization: string;
  setSelectedSpecialization: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  priceRange: string;
  setPriceRange: (value: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (value: string) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (value: boolean) => void;
  allSpecializations: string[];
  allLocations: string[];
}

export default function FilterControls({
  selectedSpecialization,
  setSelectedSpecialization,
  selectedLocation,
  setSelectedLocation,
  priceRange,
  setPriceRange,
  availabilityFilter,
  setAvailabilityFilter,
  verifiedOnly,
  setVerifiedOnly,
  allSpecializations,
  allLocations,
}: FilterControlsProps) {
  const handleVerifiedOnlyChange = (checked: boolean | 'indeterminate') => {
    setVerifiedOnly(checked === true);
  };

  return (
    <div className='mb-8 space-y-4'>
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

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className='bg-white/10 border-white/20 text-white'>
            <SelectValue placeholder='Location' />
          </SelectTrigger>
          <SelectContent className='bg-slate-800 border-current/20'>
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
  );
}
