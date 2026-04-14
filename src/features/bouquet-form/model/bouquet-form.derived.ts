import { atom } from 'jotai';
import {
  bouquetNameAtom,
  bouquetFlowersAtom,
  bouquetPackagingColorAtom,
  bouquetRibbonColorAtom,
} from './bouquet-form.atoms';

export const bouquetNameErrorAtom = atom((get) => {
  const name = get(bouquetNameAtom);
  return name.trim().length === 0 ? '꽃다발 이름을 입력해주세요.' : null;
});

export const bouquetFlowersErrorAtom = atom((get) => {
  const flowers = get(bouquetFlowersAtom);
  return flowers.length === 0 ? '한 개 이상의 꽃을 추가해 주세요.' : null;
});

export const bouquetEmptyColorsErrorAtom = atom((get) => {
  const flowers = get(bouquetFlowersAtom);
  return flowers.some((f) => f.colorInfos.length === 0)
    ? '모든 꽃에 색상을 하나 이상 추가해 주세요.'
    : null;
});

export const bouquetPackagingColorErrorAtom = atom((get) => {
  const packagingColor = get(bouquetPackagingColorAtom);
  return packagingColor.length === 0 ? '포장지 색상을 선택해 주세요.' : null;
});

export const bouquetRibbonColorErrorAtom = atom((get) => {
  const ribbonColor = get(bouquetRibbonColorAtom);
  return ribbonColor.length === 0 ? '리본 색상을 선택해 주세요.' : null;
});

export const canSaveBouquetAtom = atom((get) => {
  return (
    get(bouquetNameErrorAtom) === null &&
    get(bouquetFlowersErrorAtom) === null &&
    get(bouquetEmptyColorsErrorAtom) === null &&
    get(bouquetPackagingColorErrorAtom) === null &&
    get(bouquetRibbonColorErrorAtom) === null
  );
});

export const bouquetValidationErrorAtom = atom((get) => {
  return (
    get(bouquetNameErrorAtom) ??
    get(bouquetFlowersErrorAtom) ??
    get(bouquetEmptyColorsErrorAtom) ??
    get(bouquetPackagingColorErrorAtom) ??
    get(bouquetRibbonColorErrorAtom) ??
    null
  );
});
