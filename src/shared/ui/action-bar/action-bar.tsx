'use client';

import { cn } from '@/shared/utils/styles';

type TProps = {
  children: React.ReactNode;
  variant?: 'page' | 'modal';
  className?: string;
};

const SHADOW = 'shadow-[0_0_2px_rgba(128,128,128,0.2)]';

function ActionBar({ children, variant = 'page', className }: TProps) {
  if (variant === 'modal') {
    return (
      <footer
        className={cn(
          'w-full flex flex-col gap-3 py-3 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] bg-white',
          SHADOW,
          className,
        )}
      >
        {children}
      </footer>
    );
  }

  return (
    <footer
      className={cn(
        'w-full flex flex-col gap-3 py-3 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] bg-white',
        'tablet:gap-4 tablet:pt-5 tablet:px-6',
        'pc:flex-row pc:items-end pc:gap-6 pc:pt-6 pc:pb-7 pc:px-8',
        SHADOW,
        className,
      )}
    >
      {children}
    </footer>
  );
}

export default ActionBar;
