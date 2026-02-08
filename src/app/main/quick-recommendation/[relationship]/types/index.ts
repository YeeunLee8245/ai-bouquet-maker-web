import { QUICK_PERSON_TARGET_RECOMMENDATION_LIST } from '@/app/main/_datas';
import { OCCASION_OBJECT } from '../_datas';

export type TOccasion = keyof typeof OCCASION_OBJECT;

export type TRelationship = (typeof QUICK_PERSON_TARGET_RECOMMENDATION_LIST)[number]['id'];
