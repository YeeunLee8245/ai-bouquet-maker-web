import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { analyzeRecipient } from '@services/recipient-analysis';
import { getRecommendationsFromAnalysis } from '@/lib/recommendation';
import { spendToken, getUserBalance } from '@/lib/wallet';

/**
 * @swagger
 * /api/recommend/ai/recipient:
 *   post:
 *     tags:
 *       - Recommend
 *     summary: AI 대상 맞춤 꽃 추천
 *     description: |
 *       받는 사람에 대한 설명을 AI가 분석하여 맞춤 꽃을 추천합니다.
 *       최대 10개의 추천 결과를 반환하며, 페이징을 지원하지 않습니다.
 *       **요청 1회당 AI 추천 토큰 1개가 소진됩니다.**
 *
 *       <details>
 *       <summary>📊 점수 계산 방식 (클릭하여 펼치기)</summary>
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
 *       </details>
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
 *                 recommendation_id:
 *                   type: string
 *                   format: uuid
 *                   nullable: true
 *                 total_count:
 *                   type: integer
 *                   description: "검색된 꽃의 총 개수 (최대 10개)"
 *                 recommendations:
 *                   type: array
 *             example:
 *               success: true
 *               recommendation_id: "a2b3c4d5-e6f7-8901-abcd-ef1234567890"
 *               total_count: 2
 *               recommendations:
 *                 - flower_id: 15
 *                   flower_meaning_id: 30
 *                   flower_name: "작약"
 *                   meaning: "수줍음"
 *                   color: "분홍"
 *                   score: 35
 *                   image_url: "peony.jpg"
 *                 - flower_id: 1
 *                   flower_meaning_id: 2
 *                   flower_name: "장미"
 *                   meaning: "불타는 사랑"
 *                   color: "빨강"
 *                   score: 28
 *                   image_url: "rose.jpg"
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 필요 (로그인 필수)
 *       403:
 *         description: 토큰 부족 (AI 추천 토큰 필요)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "사용 가능한 토큰 부족"
 *       500:
 *         description: 서버 오류
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인 (AI 추천은 로그인 필수)
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요한 서비스입니다.' },
        { status: 401 },
      );
    }

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

    // AI 분석 전 토큰 선검사
    const balance = await getUserBalance(user.id);
    if (balance < 1) {
      return NextResponse.json(
        { error: '사용 가능한 토큰 부족' },
        { status: 403 },
      );
    }

    // AI 분석
    const analysis = await analyzeRecipient(text);

    // 점수 계산 및 꽃 추천
    const { recommendations, ranked } = await getRecommendationsFromAnalysis(analysis, 'recipient');

    // DB에 저장 (이미 인증된 사용자)
    let recommendationId: string | null = null;
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

        if (recommendationId) {
          try {
            await spendToken(user.id, recommendationId);
          } catch (tokenError: any) {
            // 토큰 부족 시 저장된 추천 데이터 삭제 (선택 사항)
            await supabase.from('recommendations').delete().eq('id', recommendationId);
            
            return NextResponse.json(
              { error: tokenError.message || '토큰이 부족합니다.' },
              { status: 403 },
            );
          }
        }
      } else {
        console.error('Failed to save recommendation:', saveError);
      }
    }

    // 표준화된 응답 형식으로 변환
    const standardizedRecommendations = recommendations.map(rec => ({
      flower_id: rec.flower.id,
      flower_meaning_id: rec.flowerMeaningId || 0,
      flower_name: rec.flower.name_ko,
      meaning: rec.flower.flower_meanings?.find(m => m.id === rec.flowerMeaningId)?.meaning || '',
      color: rec.flower.flower_meanings?.find(m => m.id === rec.flowerMeaningId)?.color || '',
      score: rec.score,
      image_url: rec.flower.image_url || null,
    }));

    return NextResponse.json({
      success: true,
      recommendation_id: recommendationId,
      total_count: standardizedRecommendations.length,
      recommendations: standardizedRecommendations,
    });
  } catch (error) {
    console.error('AI Recipient Recommend Error:', error);
    return NextResponse.json(
      { error: '추천 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
