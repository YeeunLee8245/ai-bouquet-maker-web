'use client';

import { useAtomValue } from 'jotai';
import React from 'react';
import { modalStackAtom } from './modal.atoms';

function ModalHost() {
  const root = typeof document !== 'undefined' ? document.getElementById('modal-root') : null;
  const stack = useAtomValue(modalStackAtom);

  if (!root || stack.length === 0) {return null;}

  return (
    <div>
      {stack.map((descriptor) => (
        <div key={descriptor.id}>{descriptor.component}</div>
      ))}
    </div>
  );
}

export default ModalHost;
