'use client';

import * as React from 'react';
import type { TTabsContextValue } from './types';

export const TabsContext = React.createContext<TTabsContextValue | null>(null);

export function useTabsCtx() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {throw new Error('Tabs components must be used within <Tabs>.');}
  return ctx;
}
