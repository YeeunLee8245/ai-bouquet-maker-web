import type { DIRECTORY_SEASON_NAME_MAP } from '../../_datas';

export type TFlowerDetailResponse = {
  success: boolean;
  data: {
    id: number;
    name_ko: string;
    name_en: string;
    scientific_name?: string;
    description: string;
    care_tips?: string;
    plus_info?: string;
    images: string[];
    blooming_start_month?: number;
    blooming_end_month?: number;
    seasons?: (keyof typeof DIRECTORY_SEASON_NAME_MAP)[];
    isLiked?: boolean;
    meanings: {
      id: number;
      meaning: string;
      color?: string;
      icon_color?: string;
      is_primary?: boolean;
      emotion_tags?: string[];
    }[];
    similar_flowers: {
      id: string;
      name: string;
      imageUrl: string;
      tags: string[];
    }[];
  };
};

export type TFlowerImage = {
  url: string;
  name: string;
};

export type TFlowerMeaning = {
  color: string;
  description: string;
  tags: string[];
};

export type TFlowerFloweringTime = {
  season: (keyof typeof DIRECTORY_SEASON_NAME_MAP);
  months: string[];
};

export type TFlowerSimilarFlower = {
  id: string;
  name: string;
  imageUrl: string;
  tags: string[];
};

export type TFlowerDetail = {
  id: string;
  title: {
    ko: string;
    en: string;
  };
  description: string;
  isLiked: boolean;
  images: TFlowerImage[];
  meanings: TFlowerMeaning[];
  floweringTimes: TFlowerFloweringTime[];
  management: string;
  similarFlowers: TFlowerSimilarFlower[];
};
