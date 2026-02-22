'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastProvider } from './toast-provider';

type TProps = {
  children: React.ReactNode;
};

function AppProviders({ children }: TProps) {
  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          {children}
          {
            process.env.NODE_ENV === 'development' &&
          <ReactQueryDevtools initialIsOpen={false} />
          }
        </JotaiProvider>
      </QueryClientProvider>
    </ToastProvider>
  );
};

export default AppProviders;
