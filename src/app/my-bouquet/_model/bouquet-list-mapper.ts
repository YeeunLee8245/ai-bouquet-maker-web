import { formatKoreanDate } from '@/shared/utils/date';
import type { IBouquetListItemData } from '../_types';

export function toComponentBouquet(item: IBouquetListItemData) {
  return {
    id: item.id,
    name: item.name,
    occasion: item.occasion ?? '',
    recipient: item.recipient ?? '',
    message: item.message ?? '',
    flowers: item.flowers,
    createdAt: formatKoreanDate(item.created_at),
  };
}
