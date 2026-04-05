import { FlowerType } from '@/types/bouquet';

export interface IBouquetDetailFlower {
  flower_id: string;
  flower_name: string;
  tags: string[];
  color_and_quantity: Array<{ color: string; quantity: number }>;
}

export interface IBouquetDetailData {
  id: string;
  name: string;
  occasion: string | null;
  recipient: string | null;
  message: string | null;
  flowers: IBouquetDetailFlower[];
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

export interface IBouquetDetailResponse {
  success: boolean;
  data: IBouquetDetailData;
}
