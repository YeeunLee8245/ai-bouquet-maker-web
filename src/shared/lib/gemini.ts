export const MODEL = 'gemini-3.1-flash-lite';
export const FALLBACK_MODEL = 'gemini-2.5-flash';

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
  recipient?: string;
  occasion?: string;
}

export interface RecipientAnalysisResponse extends EmotionAnalysisResponse {
  recipient?: string;
  occasion?: string;
}

/**
 * 특정 Gemini 모델을 지정하여 API 호출을 실행합니다.
 */
async function callGeminiWithModel(model: string, prompt: string, text: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해 주세요.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${prompt}\n\n사용자 입력 문장: "${text}"` }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Gemini API Error (${model}):`, errorBody);
    throw new Error(`Gemini API 호출에 실패했습니다: ${response.statusText} (${response.status}) - ${errorBody}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error(`Gemini API 응답에서 텍스트 결과를 추출할 수 없습니다. (${model})`);
  }

  return content;
}

/**
 * Gemini API를 호출하여 구조화된 JSON 문자열 응답을 반환합니다.
 * gemini-3.1-flash-lite가 무료 할당량 초과(429)로 실패할 경우, 자동으로 gemini-2.5-flash로 폴백합니다.
 */
export async function callGemini(prompt: string, text: string): Promise<string> {
  try {
    return await callGeminiWithModel(MODEL, prompt, text);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    // 429 Too Many Requests, RESOURCE_EXHAUSTED, quota 초과 에러 감지 시 폴백 적용
    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota')) {
      console.warn(`[Gemini Fallback] ${MODEL} 무료 할당량 초과. ${FALLBACK_MODEL} 모델로 우회 호출을 시도합니다...`);
      try {
        return await callGeminiWithModel(FALLBACK_MODEL, prompt, text);
      } catch (fallbackError) {
        console.error(`[Gemini Fallback Failed] ${FALLBACK_MODEL} 우회 호출도 실패했습니다:`, fallbackError);
        throw fallbackError;
      }
    }

    throw error;
  }
}
