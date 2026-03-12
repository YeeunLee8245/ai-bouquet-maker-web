import { cn } from '@/shared/utils/styles';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { ColorChipGroup } from '@/shared/ui/chip';

type TProps = {
  id: string;
  size: 'md' | 'lg';
  imageUrl: string;
  name: string;
  colors?: string[];
  tags: string[];
  priority?: boolean;
  actionButton?: React.ReactNode;
  likeButton?: React.ReactNode;
  searchParams?: Record<string, string>;
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

function FlowerCard({ size, imageUrl, id, name, colors, tags, priority = false, actionButton, likeButton, searchParams, className, ...props }: TProps) {
  const [imageWidth, imageHeight] = [flowerCardImageSizes[size].width, flowerCardImageSizes[size].height];
  const query = searchParams ? `?${new URLSearchParams(searchParams).toString()}` : '';
  return (
    <div className={cn('flex flex-col', `min-w-[${imageWidth}px]`, className)} {...props}>
      <Link
        aria-label={`${name} 상세 페이지 보기`}
        href={`/flower-directory/${id}${query}`}
        className={cn('relative')}>
        <Image
          priority={priority}
          src={imageUrl}
          alt={name}
          width={imageWidth}
          height={imageHeight}
          className={cn('object-cover',
            'max-w-none',
            size === 'md' && 'rounded-4 border-1 border-gray-100',
            size === 'lg' && 'rounded-3',
          )}
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />
        {likeButton && (
          <div className='absolute top-2 right-2' onClick={(e) => e.preventDefault()}>
            {likeButton}
          </div>
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
            <span key={tag} className='tag-chip'>{tag}</span>
          ))}
        </div>
      </div>
      {actionButton}
    </div>
  );
}

export default FlowerCard;
