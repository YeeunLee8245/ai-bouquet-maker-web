import Link from 'next/link';
import Image from 'next/image';
import { OCCASION_OBJECT } from '../model/constants';
import { TOccasion } from '../model/types';
import { cloneElement, JSX } from 'react';

export interface OccasionItemProps {
  type: TOccasion;
  relationship: string;
}

export function OccasionItem({ type, relationship }: OccasionItemProps) {
  let imageComponent: JSX.Element | undefined = undefined;

  const { label } = OCCASION_OBJECT[type];

  switch (type) {
    case 'birthday_anniversary':
      imageComponent = <Image src='/images/cake.webp' alt={label} width={0} height={0} className='w-[72px] h-[96px]' />;
      break;
    case 'proposal':
      imageComponent = <Image src='/images/propose.webp' alt={label} width={0} height={0} className='w-[58px] h-[100px]' />;
      break;
    case 'new_beginning':
      imageComponent = <Image src='/images/gift.webp' alt={label} width={0} height={0} className='w-[74px] h-[78px]' />;
      break;
    case 'celebration_support':
      imageComponent = <Image src='/images/cheer.webp' alt={label} width={0} height={0} className='w-[90px] h-[84px]' />;
      break;
    case 'comfort_recovery':
      imageComponent = <Image src='/images/comfort.webp' alt={label} width={0} height={0} className='w-[54px] h-[96px]' />;
      break;
    case 'apology':
      imageComponent = <Image src='/images/apple.webp' alt={label} width={0} height={0} className='w-[80px] h-[86px]' />;
      break;
    case 'parents_day':
      imageComponent = <Image src='/images/pink_carnation.webp' alt={label} width={0} height={0} className='w-[80px] h-[94px]' />;
      break;
    case 'teachers_day':
      imageComponent = <Image src='/images/blue_carnation.webp' alt={label} width={0} height={0} className='w-[80px] h-[94px]' />;
      break;
    default:
      break;
  }

  return (
    <Link
      href={`/main/quick-recommendation/${relationship}/${type}`}
      className='w-[156px] h-[200px] flex flex-col items-center px-4 pt-4 pb-6 gap-3 rounded-5 border-1 border-gray-100 bg-white transition-all hover:border-primary-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:border-primary-400 active:shadow-[0_2px_6px_rgba(0,0,0,0.1)]'
    >
      <div className='pt-1 flex-1 content-center'>
        {imageComponent && cloneElement(imageComponent, { className: 'w-auto h-auto', priority: true })}
      </div>
      <div className='text-title-md'>
        {OCCASION_OBJECT[type].label}
      </div>
    </Link>
  );
}
