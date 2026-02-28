import React from 'react';
import { TUseLikeParams, useLike } from '../model/use-like';
import { cn } from '@/shared/utils/styles';
import FillHeartIcon from '@/shared/assets/icons/fill_heart.svg';
import OutlineHeartIcon from '@/shared/assets/icons/outline_heart.svg';

type TProps = TUseLikeParams & {
  variant: 'outline' | 'fill';
  size: 'md' | 'lg';
  className?: string;
};

// TODO: yeeun 버튼 사이즈 스타일 추가
const buttonSizes: Record<TProps['size'], string> = {
  md: 'w-[18px] h-[18px]',
  lg: 'w-[20px] h-[20px]',
};

function LikeButton({type, id, variant, size, className, queryKeyToPatch, patchQueryData}: TProps) {
  const {liked, pending, toggle} = useLike({type, id, queryKeyToPatch, patchQueryData});
  const buttonSize = buttonSizes[size];

  const Icon = variant === 'outline' ? OutlineHeartIcon : FillHeartIcon;

  return (
    <button
      type='button'
      onClick={toggle}
      disabled={pending}
      aria-pressed={liked}
      aria-busy={pending}
      aria-label={`${liked ? '좋아요 취소' : '좋아요'}`}
      className={cn(className)}>
      <Icon className={
        cn(buttonSize,
          liked ? 'fill-primary-400 hover:fill-primary-600' : 'fill-black/20 hover:fill-gray-400',
          variant === 'outline' && '[&>path]:stroke-gray-100',
          pending && 'animate-pulse',
        )} />
    </button>
  );
}

export default LikeButton;
