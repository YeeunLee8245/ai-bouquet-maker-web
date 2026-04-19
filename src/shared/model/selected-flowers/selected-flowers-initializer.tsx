'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { resetSelectedFlowersAtom } from './selected-flowers.actions';

export function SelectedFlowersInitializer() {
  const resetSelectedFlowers = useSetAtom(resetSelectedFlowersAtom);
  useEffect(() => {
    resetSelectedFlowers();
  }, []);
  return null;
}
