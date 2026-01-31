import { cn } from '@/shared/utils/styles';
import React from 'react';

type TProps = {
  tag: string;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export default function KeywordChip({ tag, className, ...props }: TProps) {
  return (
    <span
      key={tag}
      className={
        cn(
          'max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap py-1 px-2 rounded-3 bg-gray-100 text-ui-tag text-gray-400',
          className,
        )
      }
      {...props}
    >
      {tag}
    </span>
  );
}
