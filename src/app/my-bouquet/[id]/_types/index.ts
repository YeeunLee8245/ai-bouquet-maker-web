import { FlowerType } from '@/types/bouquet';

export interface BouquetDetailFlower {
  flower_id: string;
  flower_name: string;
  image_url: string | null;
  quantity: number;
  color: string;
  flower_meaning_id: string;
  meaning: string;
  icon_color: string | null;
  type?: FlowerType;
}

export interface BouquetDetailData {
  id: string;
  name: string;
  occasion: string | null;
  recipient: string | null;
  message: string | null;
  flowers: BouquetDetailFlower[];
  wrapping: {
    ribbonColor: string | null;
    wrappingColor: string | null;
  };
  layout: {
    items: Array<{
      flower_id: string;
      flower_meaning_id: string;
      x: number;
      y: number;
      rotation?: number;
      scale?: number;
      z_index?: number;
      color?: string;
      type?: FlowerType;
    }>;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface BouquetDetailResponse {
  success: boolean;
  data: BouquetDetailData;
}
