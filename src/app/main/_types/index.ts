export type TRecipient = {
  id: string;
  label: string;
  description: string;
};

export type TPopularFlower = {
  id: number;
  name_ko: string;
  image_url: string;
  representative_meanings: string[];
};

export type TTodaysFlower = {
  id: number;
  name_ko: string;
  image_url: string;
  description: string;
  representative_meanings: string[];
  seasons: string[];
} | null;

export type TMainResponse = {
  success: boolean;
  data: {
    recipients: TRecipient[];
    popularFlowers: TPopularFlower[];
    todaysFlower: TTodaysFlower;
  };
};
