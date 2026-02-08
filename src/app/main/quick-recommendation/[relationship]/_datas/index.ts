import { QUICK_PERSON_TARGET_RECOMMENDATION_LIST } from '@/app/main/_datas';
import { TRelationship } from '../types';

export const QUICK_RECOMMENDATION_DATA_MAP = QUICK_PERSON_TARGET_RECOMMENDATION_LIST.reduce((acc, item) => {
  acc[item.id] = item.name;
  return acc;
}, {} as Record<TRelationship, string>);
