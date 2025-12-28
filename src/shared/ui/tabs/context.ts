'use client';

import * as React from 'react';
import type { TabsContextValue } from './types';

export const TabsContext = React.createContext<TabsContextValue | null>(null);

export function useTabsCtx() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {throw new Error('Tabs components must be used within <Tabs>.');}
  return ctx;
}
