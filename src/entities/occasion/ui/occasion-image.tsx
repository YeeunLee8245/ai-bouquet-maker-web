import Image from 'next/image';
import { cn } from '@/shared/utils/styles';
import { OCCASION_OBJECT } from '../model/constants';
import { OCCASION_IMAGE_CONFIG } from '../model/occasion-image-config';
import type { TOccasion } from '../model/types';

export interface OccasionImageProps {
  type: TOccasion;
  className?: string;
  priority?: boolean;
}

export function OccasionImage({ type, className, priority }: OccasionImageProps) {
  const { src, width, height, className: defaultClassName } = OCCASION_IMAGE_CONFIG[type];
  const alt = OCCASION_OBJECT[type].label;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(defaultClassName, className)}
      priority={priority}
    />
  );
}
