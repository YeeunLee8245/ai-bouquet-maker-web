import Link from 'next/link';
import { OCCASION_OBJECT } from '../_datas';
import Image from 'next/image';
import { TOccasion, TRelationship } from '../types';

export interface IProps {
  type: TOccasion;
  relationship: TRelationship;
}

function OccasionItem({ type, relationship }: IProps) {
  let imageComponent = null;

  const { label } = OCCASION_OBJECT[type];

  switch (type) {
    case 'birthday_anniversary':
      imageComponent = <Image src='/images/cake.webp' alt={label} width={72} height={96} />;
      break;
    case 'proposal':
      imageComponent = <Image src='/images/propose.webp' alt={label} width={58} height={100} />;
      break;
    case 'new_beginning':
      imageComponent = <Image src='/images/gift.webp' alt={label} width={74} height={78} />;
      break;
    case 'celebration_support':
      imageComponent = <Image src='/images/cheer.webp' alt={label} width={90} height={84} />;
      break;
    case 'comfort_recovery':
      imageComponent = <Image src='/images/comfort.webp' alt={label} width={54} height={96} />;
      break;
    case 'apology':
      imageComponent = <Image src='/images/apple.webp' alt={label} width={80} height={86} />;
      break;
    case 'parents_day':
      imageComponent = <Image src='/images/pink_carnation.webp' alt={label} width={80} height={94} />;
      break;
    case 'teachers_day':
      imageComponent = <Image src='/images/blue_carnation.webp' alt={label} width={80} height={94} />;
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
        {imageComponent}
      </div>
      <div className='text-title-md'>
        {OCCASION_OBJECT[type].label}
      </div>
    </Link>
  );
}

export default OccasionItem;
