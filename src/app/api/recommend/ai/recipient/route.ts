import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { analyzeRecipient } from '@services/recipient-analysis';
import { getRecommendationsFromAnalysis } from '@/lib/recommendation';

/**
 * @swagger
 * /api/recommend/ai/recipient:
 *   post:
 *     tags:
 *       - Recommend
 *     summary: AI 대상 맞춤 꽃 추천
 *     description: |
 *       받는 사람에 대한 설명을 AI가 분석하여 맞춤 꽃을 추천합니다.
 *
 *       ## 점수 계산 방식
 *
 *       | 요소 | 가중치 | 설명 |
 *       |------|--------|------|
 *       | relation_tags 매칭 | **6점** | 관계 태그 매칭 (최우선) |
 *       | style_tags 매칭 | **5점** | 스타일 태그 매칭 |
 *       | emotion_tags 매칭 | **3점** | 감정 태그 매칭 |
 *       | situation_tags 매칭 | **3점** | 상황 태그 매칭 |
 *       | AI 추천 꽃 보너스 | **+18점** | AI가 직접 추천한 꽃 |
 *       | 추천 색상 매칭 | **+6점** | AI 추천 색상과 일치 |
 *       | 대표 꽃말 보너스 | **+2점** | is_primary가 true인 꽃말 |
 *
 *       **계절 필터링**: 현재 계절에 맞는 꽃만 추천
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 description: 받는 사람에 대한 설명
 *                 example: "30대 여자친구, 차분하고 우아한 스타일을 좋아해요"
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
 *                   $ref: '#/components/schemas/RecipientAnalysisResponse'
 *                 recommendations:
 *                   type: array
 *                   description: UI 렌더링용 추천 꽃 목록
 *                 ranked:
 *                   type: array
 *                   description: DB 저장용 추천 데이터
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    // 입력 검증
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

    // AI 분석
    const analysis = await analyzeRecipient(text);

    // 점수 계산 및 꽃 추천
    const { recommendations, ranked } = await getRecommendationsFromAnalysis(analysis, 'recipient');

    // 로그인 사용자면 DB에 저장
    let recommendationId: string | null = null;
    const user = await getUser();

    if (user) {
      const supabase = await createClient();

      const { data: publicUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!userError && publicUser) {
        const { data: newRecommendation, error: saveError } = await supabase
          .from('recommendations')
          .insert({
            user_id: publicUser.id,
            recommendation_type: 'recipient',
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

    return NextResponse.json({
      success: true,
      recommendation_id: recommendationId,
      analysis,
      recommendations,
      ranked,
      metadata: {
        type: 'recipient',
        input_text: text,
        flower_count: recommendations.length,
      },
    });
  } catch (error) {
    console.error('AI Recipient Recommend Error:', error);
    return NextResponse.json(
      { error: '추천 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
