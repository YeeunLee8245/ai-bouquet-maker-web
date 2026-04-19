import { atom } from 'jotai';
import { selectedFlowersAtom } from './selected-flowers.atoms';
import { TSelectedFlower } from './selected-flowers.types';

export const toggleFlowerAtom = atom(
  null,
  (get, set, flower: TSelectedFlower) => {
    const list = get(selectedFlowersAtom);
    const exists = list.some((item) => item.id === flower.id);
    if (exists) {
      set(selectedFlowersAtom, list.filter((item) => item.id !== flower.id));
    } else {
      set(selectedFlowersAtom, [...list, flower]);
    }
  },
);

export const removeFlowerAtom = atom(
  null,
  (get, set, flowerId: string) => {
    set(
      selectedFlowersAtom,
      get(selectedFlowersAtom).filter((item) => item.id !== flowerId),
    );
  },
);

export const resetSelectedFlowersAtom = atom(null, (_get, set) => {
  set(selectedFlowersAtom, []);
});
