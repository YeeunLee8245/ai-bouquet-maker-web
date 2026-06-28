'use client';

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
  replace?: boolean;
  onLinkPrefetch?: (href: string) => void;
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

function FlowerCard({ size, imageUrl, id, name, colors, tags, priority = false, actionButton, likeButton, searchParams, replace, onLinkPrefetch, className, ...props }: TProps) {
  const [imageWidth, imageHeight] = [flowerCardImageSizes[size].width, flowerCardImageSizes[size].height];
  const query = searchParams ? `?${new URLSearchParams(searchParams).toString()}` : '';
  const href = `/flower-directory/${id}${query}`;
  return (
    <div
      className={cn('flex flex-col',
        size === 'md' ? 'min-w-[122px] tablet:min-w-[156px]' : 'w-full',
        className,
      )}
      {...props}
    >
      <div className={cn('relative', size === 'lg' && 'block w-full')}>
        <Link
          aria-label={`${name} 상세 페이지 보기`}
          href={href}
          replace={replace}
          prefetch={false}
          onMouseEnter={() => onLinkPrefetch?.(href)}
          onTouchStart={() => onLinkPrefetch?.(href)}>
          <Image
            priority={priority}
            src={imageUrl}
            alt={name}
            width={imageWidth}
            height={imageHeight}
            className={cn('object-cover',
              'max-w-none',
              size === 'md' && 'w-[122px] h-[156px] tablet:w-[156px] tablet:h-[200px] rounded-4 border-1 border-gray-100',
              size === 'lg' && 'w-full h-auto aspect-[156/200] rounded-3',
            )}
          />
          {colors && (
            <div className={cn('absolute bottom-0 right-0 p-2 w-full backdrop-blur-[1px] bg-gradient-to-b from-[#CECECE]/0 to-black/12',
              size === 'md' && 'rounded-4', size === 'lg' && 'rounded-3',
            )}>
              <ColorChipGroup colors={colors} className='justify-end' />
            </div>
          )}
        </Link>
        {likeButton && (
          <div className='absolute top-2 right-2'>
            {likeButton}
          </div>
        )}
      </div>
      <div className={cn(size === 'md' && 'mt-1', size === 'lg' && 'mt-2')}>
        <p className={cn('text-body-lg', size === 'md' && 'pt-micro')}>{name}</p>
        <div className={cn('flex mt-2', size === 'md' && 'gap-1', size === 'lg' && 'gap-2')}>
          {tags.map((tag, index) => (
            <span key={tag} className={cn('tag-chip', index === tags.length - 1 && 'overflow-hidden text-ellipsis min-w-0')}>{tag}</span>
          ))}
        </div>
      </div>
      {actionButton}
    </div>
  );
}

export default FlowerCard;
