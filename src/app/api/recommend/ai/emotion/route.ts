import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { analyzeEmotion } from '@services/emotion-analysis';
import { getRecommendationsFromAnalysis } from '@/lib/recommendation';

/**
 * @swagger
 * /api/recommend/ai/emotion:
 *   post:
 *     tags:
 *       - Recommend
 *     summary: AI 감정 기반 꽃 추천
 *     description: |
 *       사용자의 감정/상황 텍스트를 AI가 분석하여 꽃을 추천합니다.
 *
 *       <details>
 *       <summary>📊 점수 계산 방식 (클릭하여 펼치기)</summary>
 *
 *       | 요소 | 가중치 | 설명 |
 *       |------|--------|------|
 *       | emotion_tags 매칭 | **6점** | 감정 태그 매칭 (최우선) |
 *       | situation_tags 매칭 | **5점** | 상황 태그 매칭 |
 *       | relation_tags 매칭 | **3점** | 관계 태그 매칭 |
 *       | style_tags 매칭 | **2점** | 스타일 태그 매칭 |
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
 *                 description: 분석할 감정/상황 텍스트
 *                 example: "요즘 많이 지쳐있어서 위로받고 싶어요"
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
 *                 analysis:
 *                   type: object
 *                 recommendations:
 *                   type: array
 *                 ranked:
 *                   type: array
 *                 metadata:
 *                   type: object
 *             example:
 *               success: true
 *               recommendation_id: "18561ccb-20c4-4bdb-8905-ec2647f471c5"
 *               analysis:
 *                 title: "위로의 꽃"
 *                 tags:
 *                   emotion_tags: ["위로", "희망"]
 *                   situation_tags: []
 *                   relation_tags: []
 *                   style_tags: []
 *                 recommend_flowers:
 *                   - flower_name: "안개꽃"
 *                     color: "하양"
 *                     reason: "순수하고 편안한 느낌을 줍니다."
 *                 message: "힘든 날이 지나가고, 당신에게 평화가 찾아오길 바랍니다."
 *                 recipient: ""
 *               recommendations:
 *                 - flower:
 *                     id: 12
 *                     name_ko: "안개꽃"
 *                     image_url: "gypsophila.jpg"
 *                   score: 26
 *                   matchedTags: ["위로", "AI 추천", "하양 컬러"]
 *                 - flower:
 *                     id: 5
 *                     name_ko: "프리지아"
 *                     image_url: "freesia.jpg"
 *                   score: 18
 *                   matchedTags: ["희망"]
 *               ranked:
 *                 - flower_id: 12
 *                   flower_meaning_id: 24
 *                   score: 26
 *                 - flower_id: 5
 *                   flower_meaning_id: 10
 *                   score: 18
 *               metadata:
 *                 type: "emotion"
 *                 input_text: "요즘 많이 지쳐있어서 위로받고 싶어요"
 *                 flower_count: 2
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 필요 (로그인 필수)
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

    // AI 분석
    const analysis = await analyzeEmotion(text);

    // 점수 계산 및 꽃 추천
    const { recommendations, ranked } = await getRecommendationsFromAnalysis(analysis, 'emotion');

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
          recommendation_type: 'emotion',
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
    return NextResponse.json({
      success: true,
      recommendation_id: recommendationId,
      analysis,
      recommendations,
      ranked,
      metadata: {
        type: 'emotion',
        input_text: text,
        flower_count: recommendations.length,
      },
    });
  } catch (error) {
    console.error('AI Emotion Recommend Error:', error);
    return NextResponse.json(
      { error: '추천 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
