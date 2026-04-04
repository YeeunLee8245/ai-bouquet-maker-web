import { FlowerType } from '@/types/bouquet';

export interface BouquetDetailFlower {
  flower_id: string;
  flower_name: string;
  tags: string[];
  color_and_quantity: Array<{ color: string; quantity: number }>;
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
