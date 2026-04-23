'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

type TProps = {
  children: React.ReactNode;
  FallbackComponent: React.ComponentType<FallbackProps>;
};

export function QueryErrorBoundary({ children, FallbackComponent }: TProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={FallbackComponent}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
