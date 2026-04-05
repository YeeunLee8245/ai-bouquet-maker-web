import Link from 'next/link';
import { OCCASION_OBJECT } from '../model/constants';
import { TOccasion } from '../model/types';
import { OccasionImage } from './occasion-image';

export interface IOccasionItemProps {
  type: TOccasion;
  relationship: string;
}

export function OccasionItem({ type, relationship }: IOccasionItemProps) {
  return (
    <Link
      href={`/main/quick-recommendation/${relationship}/${type}`}
      className='w-[156px] h-[200px] flex flex-col items-center px-4 pt-4 pb-6 gap-3 rounded-5 border-1 border-gray-100 bg-white transition-all hover:border-primary-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:border-primary-400 active:shadow-[0_2px_6px_rgba(0,0,0,0.1)]'
    >
      <div className='pt-1 flex-1 content-center'>
        <OccasionImage type={type} className='w-auto h-auto' priority />
      </div>
      <div className='text-title-md'>
        {OCCASION_OBJECT[type].label}
      </div>
    </Link>
  );
}
