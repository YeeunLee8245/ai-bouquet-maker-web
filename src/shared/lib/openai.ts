import OpenAI from 'openai';

// OpenAI 클라이언트 인스턴스
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 사용할 모델
export const MODEL = 'gpt-4o-mini';

// 분석 응답 타입
export interface AnalysisTags {
  emotion_tags: string[];
  situation_tags: string[];
  relation_tags: string[];
  style_tags: string[];
}

export interface RecommendFlower {
  flower_name: string;
  color: string;
  reason: string;
}

export interface EmotionAnalysisResponse {
  title: string;
  tags: AnalysisTags;
  recommend_flowers: RecommendFlower[];
  message: string;
}

export interface RecipientAnalysisResponse extends EmotionAnalysisResponse {
  recipient?: string;
}
