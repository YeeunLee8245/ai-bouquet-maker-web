'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toastListAtom } from './toast.atoms';
import { removeToastAtom } from './toast.actions';
import { TToastItem } from './toast.types';

const DEFAULT_DURATION = 3000;

function ToastItem({ toast }: { toast: TToastItem }) {
  const removeToast = useSetAtom(removeToastAtom);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration ?? DEFAULT_DURATION);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  return (
    <div className='px-4 py-3 rounded-lg bg-gray-800 text-white text-sm shadow-lg animate-fade-in'>
      {toast.message}
    </div>
  );
}

function ToastHost() {
  const toasts = useAtomValue(toastListAtom);

  if (toasts.length === 0) {return null;}

  return createPortal(
    <div className='fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center'>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body,
  );
}

export default ToastHost;
