import { atom } from 'jotai';

export type RecommendedFlower = {
  id: string;
  flowerMeaningId: string;
  name: string;
  meaning: string;
  tags: string[];
  colors: string[];
  score: number;
  imageUrl: string | null;
};

export type AIRecommendationResult = {
  recommendationId: string;
  title: string;
  message: string;
  recipient: string | null;
  occasion: string | null;
  inputText: string;
  recommendations: RecommendedFlower[];
};

export const aiRecommendationResultAtom = atom<AIRecommendationResult | null>(null);
