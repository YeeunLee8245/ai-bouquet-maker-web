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
    <div className='text-body-md gap-2 px-3 py-2 bg-white border border-gray-100 rounded-5 animate-fade-in'>
      {toast.message}
    </div>
  );
}

function ToastHost() {
  const toasts = useAtomValue(toastListAtom);

  if (toasts.length === 0) {return null;}

  return createPortal(
    <div className='w-full px-4 py-2 fixed top-0 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center bg-gradient-to-b from-[#98AEAC] to-[#98AEAC00]'>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body,
  );
}

export default ToastHost;
