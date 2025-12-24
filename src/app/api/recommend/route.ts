import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { analyzeEmotion } from '@services/emotion-analysis';
import { analyzeRecipient } from '@services/recipient-analysis';
import { getRecommendationsFromAnalysis } from '@/lib/recommendation';
import type { EmotionAnalysisResponse, RecipientAnalysisResponse } from '@/lib/openai';

/**
 * @swagger
 * /api/recommend:
 *   post:
 *     tags:
 *       - Recommend
 *     summary: 통합 꽃 추천 API
 *     description: |
 *       텍스트를 분석하여 꽃을 추천하고 DB에 저장합니다.
 *       한 번의 호출로 분석 → 추천 → 저장까지 완료됩니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - text
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [emotion, recipient]
 *                 description: 분석 타입 (감정 기반 / 대상 기반)
 *                 example: "emotion"
 *               text:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 description: 분석할 텍스트
 *                 example: "친구의 생일을 축하해주고 싶어요"
 *     responses:
 *       200:
 *         description: 추천 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 recommendation_id:
 *                   type: string
 *                   format: uuid
 *                   description: 저장된 추천 ID (로그인 시에만)
 *                 analysis:
 *                   $ref: '#/components/schemas/EmotionAnalysisResponse'
 *                 recommendations:
 *                   type: array
 *                   description: |
 *                     UI 렌더링용 추천 꽃 목록.
 *                     꽃 이름, 이미지, 매칭된 태그 등 사용자에게 보여줄 정보를 포함합니다.
 *                   items:
 *                     type: object
 *                     properties:
 *                       flower:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name_ko:
 *                             type: string
 *                           image_url:
 *                             type: string
 *                             nullable: true
 *                       score:
 *                         type: number
 *                         description: 추천 점수
 *                       matchedTags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: 매칭된 감정/상황 태그
 *                 ranked:
 *                   type: array
 *                   description: |
 *                     DB 저장용 추천 데이터.
 *                     꽃 ID와 점수만 포함하여 가볍게 저장합니다.
 *                     사용자가 꽃을 선택한 후 user_recommendations_ranked 테이블에 저장할 때 사용됩니다.
 *                   items:
 *                     type: object
 *                     properties:
 *                       flower_id:
 *                         type: integer
 *                       flower_meaning_id:
 *                         type: integer
 *                       score:
 *                         type: number
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, text } = body;

    // 1. 입력 검증
    if (!type || !['emotion', 'recipient'].includes(type)) {
      return NextResponse.json(
        { error: 'type은 "emotion" 또는 "recipient"이어야 합니다.' },
        { status: 400 },
      );
    }

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: '텍스트를 입력해주세요.' },
        { status: 400 },
      );
    }

    if (text.length < 10) {
      return NextResponse.json(
        { error: '좀 더 자세히 설명해주세요. (최소 10자)' },
        { status: 400 },
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { error: '텍스트가 너무 깁니다. (최대 1000자)' },
        { status: 400 },
      );
    }

    // 2. AI 분석
    let analysis: EmotionAnalysisResponse | RecipientAnalysisResponse;
    if (type === 'emotion') {
      analysis = await analyzeEmotion(text);
    } else {
      analysis = await analyzeRecipient(text);
    }

    // 3. 점수 계산 및 꽃 추천
    const { recommendations, ranked } = await getRecommendationsFromAnalysis(analysis, type);

    // 4. 로그인 사용자면 DB에 저장
    let recommendationId: string | null = null;
    const user = await getUser();

    if (user) {
      const supabase = await createClient();

      // public.users에서 사용자 ID 조회
      const { data: publicUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!userError && publicUser) {
        // recommendations 테이블에 저장
        const { data: newRecommendation, error: saveError } = await supabase
          .from('recommendations')
          .insert({
            user_id: publicUser.id,
            recommendation_type: type,
            input_text: text,
            analysis_result: analysis,
            recommended_flowers: ranked,
            created_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (!saveError && newRecommendation) {
          recommendationId = newRecommendation.id;
        } else {
          console.error('Failed to save recommendation:', saveError);
        }
      }
    }

    // 5. 응답 반환
    return NextResponse.json({
      success: true,
      recommendation_id: recommendationId,
      analysis,
      recommendations,
      ranked,
      metadata: {
        type,
        input_text: text,
        flower_count: recommendations.length,
      },
    });
  } catch (error) {
    console.error('Recommend API Error:', error);
    return NextResponse.json(
      { error: '추천 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
