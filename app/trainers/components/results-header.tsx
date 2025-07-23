'use client';

interface ResultsHeaderProps {
  filteredCount: number;
  totalCount: number;
}

export default function ResultsHeader({
  filteredCount,
  totalCount,
}: ResultsHeaderProps) {
  return (
    <div className='mb-6'>
      <p className='text-white/70'>
        Showing {filteredCount} of {totalCount} trainers
      </p>
    </div>
  );
}
