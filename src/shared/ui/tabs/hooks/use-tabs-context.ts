'use client';

import * as React from 'react';
import { TTabsContextValue } from '../types';

export const TabsContext = React.createContext<TTabsContextValue | null>(null);

/**
 * @author_yeeun state 없이 web accessibility attributes로 조작할 수도 있을듯(성능 최적화)
 */
export function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {throw new Error('Tabs component 컴포넌트는 <Tabs> 내에서 사용되어야 합니다.');}
  return ctx;
}
