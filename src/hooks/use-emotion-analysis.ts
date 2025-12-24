'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { clearRecommendationSessionData } from '@/lib/recommendation-session';
import type { EmotionAnalysisResponse } from '@/lib/openai';
import { DEFAULT_EMOTION_ANALYSIS } from '@/data/default-analysis';

interface RecommendAPIResponse {
  success: boolean;
  recommendation_id: string | null;
  analysis: EmotionAnalysisResponse;
  recommendations: Array<{
    flower: {
      id: number;
      name_ko: string;
      image_url?: string | null;
    };
    score: number;
    matchedTags: string[];
  }>;
  ranked: Array<{
    flower_id: number;
    flower_meaning_id: number;
    score: number;
  }>;
  error?: string;
}

interface UseEmotionAnalysisReturn {
  analyze: (text: string) => Promise<void>;
  data: EmotionAnalysisResponse | null;
  loading: boolean;
  error: string | null;
}

export function useEmotionAnalysis(): UseEmotionAnalysisReturn {
  const router = useRouter();
  const [data, setData] = useState<EmotionAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const analyze = async (text: string) => {
    setLoading(true);
    setError(null);
    clearRecommendationSessionData();

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 비로그인 사용자는 기본 분석 결과 사용
      if (!user) {
        setData(DEFAULT_EMOTION_ANALYSIS);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('emotionAnalysis', JSON.stringify(DEFAULT_EMOTION_ANALYSIS));
          sessionStorage.setItem('emotionContext', JSON.stringify({
            title: DEFAULT_EMOTION_ANALYSIS.title,
            message: DEFAULT_EMOTION_ANALYSIS.message,
            tags: DEFAULT_EMOTION_ANALYSIS.tags,
            inputText: text,
          }));
          sessionStorage.setItem('recommendationMessage', DEFAULT_EMOTION_ANALYSIS.message || '');
        }
        router.push('/recommend/emotion/result');
        return;
      }

      // 통합 API 호출 (분석 + 추천 + 저장 한번에)
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'emotion',
          text,
        }),
      });

      const result: RecommendAPIResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '분석에 실패했습니다.');
      }

      setData(result.analysis);

      // 세션 스토리지에 저장
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('emotionRecommendations', JSON.stringify(result.recommendations || []));
        sessionStorage.setItem('emotionAnalysis', JSON.stringify(result.analysis));
        sessionStorage.setItem('emotionContext', JSON.stringify({
          title: result.analysis.title,
          message: result.analysis.message,
          tags: result.analysis.tags,
          inputText: text,
        }));
        sessionStorage.setItem('recommendationMessage', result.analysis.message || '');

        if (result.analysis.title) {
          sessionStorage.setItem('recommendationTitle', result.analysis.title);
        }

        const inferredRecipient =
          (result.analysis as { recipient?: string }).recipient ||
          result.analysis.tags?.relation_tags?.[0] ||
          '';
        if (inferredRecipient) {
          sessionStorage.setItem('recommendationRecipient', inferredRecipient);
        }

        if (result.recommendation_id) {
          sessionStorage.setItem('recommendationId', result.recommendation_id);
        }
      }

      router.push('/recommend/emotion/result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { analyze, data, loading, error };
}
