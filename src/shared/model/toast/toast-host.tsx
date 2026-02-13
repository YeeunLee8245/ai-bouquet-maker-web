import { ToastContext } from '@/shared/providers/toast-provider';
import React, { useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';

function ToastHost() {
  const toasts = useContext(ToastContext);

  return (
    <div>ToastHost</div>
  );
}

export default ToastHost;

const useToast = () => {
  const [toasts, setToasts] = useContext(ToastContext);

  useEffect(() => {
    // Portal Toast
    if (!toasts) {return;}

    createPortal(<div>Toast</div>, document.body);

    return () => {
      setToasts(null);
    };
  }, [toasts, setToasts]);

  return toasts;
};
