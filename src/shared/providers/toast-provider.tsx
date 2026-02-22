import { TToastItem } from '@/shared/model/toast/toast.types';
import { createContext } from 'react';

export const ToastContext = createContext<TToastItem | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {

  return <ToastContext.Provider value={null}>
    {children}
  </ToastContext.Provider>;
};
