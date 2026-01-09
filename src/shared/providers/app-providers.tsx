'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type TProps = {
  children: React.ReactNode;
};

function AppProviders({ children }: TProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        {children}
        {
          process.env.NODE_ENV === 'development' &&
          <ReactQueryDevtools initialIsOpen={false} />
        }
      </JotaiProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
