import { cn } from '@/shared/utils/styles';
import Image from 'next/image';
import React from 'react';
import OutlineHeartIcon from '@/shared/assets/icons/outline_heart.svg';
import Link from 'next/link';
import { ColorChipGroup } from '@/shared/ui/chip';

type TProps = {
  id: string;
  size: 'md' | 'lg';
  imageUrl: string;
  name: string;
  isLiked?: boolean; // 좋아요 여부 (undefined: 미지원, true: 좋아요, false: 좋아요 취소)
  colors?: string[];
  tags: string[];
  actionButton?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

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

function FlowerCard({ size, imageUrl, id, name, isLiked, colors, tags, actionButton, className, ...props }: TProps) {
  const [imageWidth, imageHeight] = [flowerCardImageSizes[size].width, flowerCardImageSizes[size].height];
  return (
    <div className={cn('flex flex-col', size === 'md' && `min-w-[${imageWidth}px]`, size === 'lg' && `min-w-[${imageWidth}px]`, className)} {...props}>
      <Link
        aria-label={`${name} 상세 페이지 보기`}
        href={`/flower-directory/${id}`}
        className={cn('relative')}>
        {/* TODO: yeeun 이미지 너비 높이 고정 */}
        <Image
          src={imageUrl}
          alt={name}
          width={imageWidth}
          height={imageHeight}
          className={cn('object-cover',
            size === 'md' && 'rounded-4 border-1 border-gray-100',
            size === 'lg' && 'rounded-3',
          )}
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />
        {isLiked !== undefined && (
          <button className='absolute top-2 right-2 text-black/20 hover:text-primary-400'>
            <OutlineHeartIcon className='w-6 h-6 [&>path]:stroke-gray-100'/>
          </button>
        )}
        {colors && (
          <div className={cn('absolute bottom-0 right-0 p-2 w-full backdrop-blur-[1px] bg-gradient-to-b from-[#CECECE]/0 to-black/12',
            size === 'md' && 'rounded-4', size === 'lg' && 'rounded-3',
          )}>
            <ColorChipGroup colors={colors} className='justify-end' />
          </div>
        )}
      </Link>
      <div className={cn(size === 'md' && 'mt-1', size === 'lg' && 'mt-2')}>
        <p className={cn('text-body-lg', size === 'md' && 'pt-micro')}>{name}</p>
        <div className={cn('flex mt-2', size === 'md' && 'gap-1', size === 'lg' && 'gap-2')}>
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
