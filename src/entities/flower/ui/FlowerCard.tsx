import { cn } from '@/shared/utils/styles';
import Image from 'next/image';
import React from 'react';
import OutlineHeartIcon from '@/shared/assets/icons/outline_heart.svg';

type TProps = {
  id: string;
  size: 'md' | 'lg';
  imageUrl: string;
  name: string;
  isLiked?: boolean; // 좋아요 여부 (undefined: 미지원, true: 좋아요, false: 좋아요 취소)
  colors?: string[];
  tags: string[];
  actionButton?: React.ReactNode;
};

const flowerCardImageSizes: Record<TProps['size'], { width: number; height: number }> = {
  md: {
    width: 122,
    height: 156,
  },
  lg: {
    width: 156,
    height: 200,
  },
};

function FlowerCard({ size, imageUrl, name, isLiked, colors, tags, actionButton }: TProps) {
  return (
    <div className='flex flex-col'>
      <div className={cn('relative overflow-hidden', size === 'md' && 'rounded-4', size === 'lg' && 'rounded-3')}>
        <Image
          src={imageUrl}
          alt={name}
          width={flowerCardImageSizes[size].width}
          height={flowerCardImageSizes[size].height}
          className='object-cover'
        />
        {/* TODO: yeeun 좋아요 버튼 */}
        {isLiked !== undefined && (
          <button className='absolute top-2 right-2 text-black/20 hover:text-primary-400'>
            <OutlineHeartIcon/>
          </button>
        )}
        {colors && (
          <div className='absolute bottom-0 right-0 p-2 w-full flex justify-end gap-1 backdrop-blur-[1px] bg-gradient-to-b from-[#CECECE]/0 to-black/12'>
            {colors.map((hexColor, idx) => (
              <span
                key={hexColor}
                className={cn('h-4 rounded-1', idx === 0 && 'w-4', idx === 1 && 'w-[14px]', idx === 2 && 'w-[12px]', idx >= 3 && 'w-[8px]')}
                style={{ backgroundColor: hexColor }}
              />
            ))}
          </div>
        )}
      </div>
      <div className='mt-2'>
        <p className='text-body-lg'>{name}</p>
        <div className='flex gap-2 mt-2'>
          {tags.map((tag) => (
            <span key={tag} className='max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap py-1 px-2 rounded-3 bg-gray-100 text-ui-tag text-gray-400'>{tag}</span>
          ))}
        </div>
      </div>
      {actionButton}
    </div>
  );
}

export default FlowerCard;
