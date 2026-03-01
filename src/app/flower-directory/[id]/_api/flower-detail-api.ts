import { DIRECTORY_SEASON_NAME_MAP } from '../../_datas';
import type { TFlowerDetail, TFlowerDetailResponse } from '../_types';
import { fetcher } from '@/shared/lib/axios';

const SEASON_MONTH_MAP: Record<keyof typeof DIRECTORY_SEASON_NAME_MAP, number[]> = {
  ['spring']: [3, 4, 5],
  ['summer']: [6, 7, 8],
  ['autumn']: [9, 10, 11],
  ['winter']: [12, 1, 2],
};

function generateMonthRange(season?: keyof typeof DIRECTORY_SEASON_NAME_MAP, start?: number, end?: number): string[] {
  if (!season || !start || !end) {return [];}
  const months: string[] = [];
  if (start <= end) {
    for (let i = start; i <= end; i++) {
      months.push(String(i));
    }
  } else {
    for (let i = start; i <= 12; i++) {
      months.push(String(i));
    }
    for (let i = 1; i <= end; i++) {
      months.push(String(i));
    }
  }

  // 해당 계절(season)에 포함된 달(months)을 반환
  return SEASON_MONTH_MAP[season].reduce((acc: string[], month: number) => {
    if (months.includes(String(month))) {
      acc.push(String(month));
    }
    return acc;
  }, []);
}

export async function fetchFlowerDetail(id: string): Promise<TFlowerDetail> {
  const { data } = await fetcher.get<TFlowerDetailResponse>(`/api/flowers/${id}`);
  const flower = data.data;

  return {
    id: String(flower.id),
    title: {
      ko: flower.name_ko,
      en: [flower.name_en, flower.scientific_name].filter(Boolean).join(' / '),
    },
    description: flower.description,
    isLiked: flower.isLiked ?? false,
    images: flower.images.map((url) => ({
      url,
      name: flower.name_ko,
    })),
    meanings: flower.meanings.map((m) => ({
      colorName: m.color ?? '전체',
      color: m.icon_color ?? '',
      description: m.meaning,
      tags: m.emotion_tags ?? [],
    })),
    floweringTimes: flower.seasons?.map((season) => ({
      season,
      months: generateMonthRange(season, flower.blooming_start_month, flower.blooming_end_month),
    })) ?? [],
    management: flower.care_tips ?? '',
    similarFlowers: flower.similar_flowers,
  };
}
