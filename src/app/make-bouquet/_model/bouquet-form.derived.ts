import { atom } from 'jotai';
import { bouquetNameAtom, bouquetFlowersAtom, bouquetPackagingColorAtom, bouquetRibbonColorAtom } from './bouquet-form.atoms';

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
  return flowers.some((f) => f.colorAndQuantities.length === 0) ? '모든 꽃에 색상을 하나 이상 추가해 주세요.' : null;
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
  const nameError = get(bouquetNameErrorAtom);
  const flowersError = get(bouquetFlowersErrorAtom);
  const hasEmptyColors = get(bouquetEmptyColorsErrorAtom);
  const packagingColorError = get(bouquetPackagingColorErrorAtom);
  const ribbonColorError = get(bouquetRibbonColorErrorAtom);

  return nameError === null && flowersError === null && !hasEmptyColors && packagingColorError === null && ribbonColorError === null;
});

export const bouquetValidationErrorAtom = atom((get) => {
  const nameError = get(bouquetNameErrorAtom);
  if (nameError) {return nameError;}

  const flowersError = get(bouquetFlowersErrorAtom);
  if (flowersError) {return flowersError;}

  const hasEmptyColors = get(bouquetEmptyColorsErrorAtom);
  if (hasEmptyColors) {return hasEmptyColors;}

  const packagingColorError = get(bouquetPackagingColorErrorAtom);
  if (packagingColorError) {return packagingColorError;}

  const ribbonColorError = get(bouquetRibbonColorErrorAtom);
  if (ribbonColorError) {return ribbonColorError;}

  return null;
});
