'use client';

import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { showToastAtom } from '@/shared/model/toast';

type WithAsyncClickExtraProps = {
  loadingText: string;
  errorText?: string;
  onClick: () => Promise<void> | void;
};

export function withAsyncClick<P extends object>(
  Component: React.ComponentType<P>,
) {
  type WrapperProps = Omit<P, 'onClick' | 'disabled' | 'children'> &
    WithAsyncClickExtraProps & { disabled?: boolean; children?: React.ReactNode };

  function AsyncWrapper({
    onClick,
    loadingText,
    errorText = '오류가 발생했습니다.',
    disabled,
    children,
    ...rest
  }: WrapperProps) {
    const [isPending, setIsPending] = useState(false);
    const showToast = useSetAtom(showToastAtom);

    const handleClick = async () => {
      if (isPending) { return; }
      setIsPending(true);
      try {
        await onClick();
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        showToast({ message: `${errorText} error: ${detail}` });
      } finally {
        setIsPending(false);
      }
    };

    return (
      <Component
        {...(rest as unknown as P)}
        onClick={handleClick}
        disabled={disabled || isPending}
      >
        {isPending ? loadingText : children}
      </Component>
    );
  }

  AsyncWrapper.displayName = `withAsyncClick(${Component.displayName ?? Component.name ?? 'Component'})`;

  return AsyncWrapper as React.FC<WrapperProps>;
}
