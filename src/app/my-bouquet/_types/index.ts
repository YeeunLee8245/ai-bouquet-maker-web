export interface BouquetListFlower {
  flower_id: string;
  flower_name: string;
  quantity: number;
  color: string | null;
}

export interface BouquetListItemData {
  id: string;
  name: string;
  occasion: string | null;
  recipient: string | null;
  message: string | null;
  flowers: BouquetListFlower[];
  created_at: string;
  updated_at: string;
}

export interface BouquetListData {
  bouquets: BouquetListItemData[];
  total: number;
  page: number;
  limit: number;
  has_next_page: boolean;
}

export interface BouquetListResponse {
  success: boolean;
  data: BouquetListData;
}
