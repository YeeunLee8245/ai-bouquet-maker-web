import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { getCardRecommendations } from '@/lib/card-recommendation';

/**
 * @swagger
 * /api/recommend/preset:
 *   get:
 *     tags:
 *       - Recommend
 *     summary: 카드 선택 기반 꽃 추천
 *     description: |
 *       대상(relationship)과 상황(occasion)을 선택하여 꽃을 추천받습니다.
 *       AI를 사용하지 않고 DB 기반 고정 점수 계산 방식을 사용합니다.
 *       URL 공유가 가능하며, 조회 기록이 DB에 저장됩니다.
 *
 *       **사용 예시:**
 *       - `GET /api/recommend/preset?relationship=lover&occasion=birthday_anniversary`
 *       - `GET /api/recommend/preset?relationship=parents&occasion=comfort_recovery`
 *
 *
 *       <details>
 *       <summary>📊 점수 계산 방식 (클릭하여 펼치기)</summary>
 *
 *       | 요소 | 점수 | 설명 |
 *       |------|------|------|
 *       | 대상 태그 매칭 | **+15점** | DB의 relation_tags와 매칭 |
 *       | 상황 태그 매칭 | **+15점** | DB의 situation_tags와 매칭 |
 *       | 색상 매칭 | **+3점** | 상황별 권장 색상과 매칭 |
 *       | 계절 보너스 | **+4점** | 현재 계절 제철 꽃 |
 *       | 대표 꽃말 | **+2점** | is_primary가 true인 꽃말 |
 *       | 회피 특성 | **-15점** | avoidTraits에 해당하면 감점 |
 *
 *       **계절 필터링**: 현재 계절에 맞는 꽃만 추천
 *       </details>
 *
 *       <details>
 *       <summary>🔄 결과 도출 및 정렬 (클릭하여 펼치기)</summary>
 *
 *       1. **점수 합산**: 위 표의 모든 요소를 계산하여 합산 점수를 산출합니다.
 *       2. **정렬**: 합산 점수가 높은 순서대로 1차 정렬합니다.
 *       3. **랜덤성**: 점수가 동일할 경우 내부적으로 무작위 섞기를 수행하여 매번 조금씩 다른 결과를 제공합니다.
 *       4. **최종 선정**: 상위 9~10개의 꽃을 최종 추천 목록으로 반환합니다.
 *
 *       **요약하자면**:
 *       과거의 단순 이름 검색(`getFlowersByKeywords`) 방식에서 벗어나, 해당 꽃이 특정 '대상'과 '상황'에 적합한지 **DB 태그(`relation_tags`, `situation_tags`)를 0순위로 체크**하는 데이터 기반 정밀 추천 알고리즘입니다.
 *       </details>
 *     parameters:
 *       - in: query
 *         name: relationship
 *         required: true
 *         schema:
 *           type: string
 *           description: "대상 선택 (영문 Slug)"
 *           example: "lover"
 *       - in: query
 *         name: occasion
 *         required: true
 *         schema:
 *           type: string
 *           description: "상황 선택 (영문 Slug)"
 *           example: "birthday_anniversary"
 *     responses:
 *       200:
 *         description: 추천 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               recommendation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               recommendations:
 *                 - flower:
 *                     id: 28
 *                     name_ko: "안스리움"
 *                     image_url: "anthurium.jpg"
 *                   score: 17
 *                   matchedTags: ["사랑", "행복", "분홍 컬러"]
 *                   inSeason: true
 *                 - flower:
 *                     id: 1
 *                     name_ko: "장미"
 *                     image_url: "rose.jpg"
 *                   score: 16
 *                   matchedTags: ["사랑", "상황 추천 꽃"]
 *                   inSeason: true
 *               ranked:
 *                 - flower_id: 28
 *                   flower_meaning_id: 58
 *                   score: 17
 *               metadata:
 *                 type: "preset"
 *                 relationship: "lover"
 *                 occasion: "birthday"
 *                 flower_count: 2
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 해당 조건에 맞는 꽃 없음
 *       500:
 *         description: 서버 오류
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const relationship = searchParams.get('relationship');
    const occasion = searchParams.get('occasion');

    // 입력 검증
    if (!relationship) {
      return NextResponse.json(
        { error: 'relationship 파라미터가 필요합니다.' },
        { status: 400 },
      );
    }

    if (!occasion) {
      return NextResponse.json(
        { error: 'occasion 파라미터가 필요합니다.' },
        { status: 400 },
      );
    }

    // 카드 기반 추천 실행
    const { recommendations, ranked } = await getCardRecommendations(relationship, occasion);

    if (recommendations.length === 0) {
      return NextResponse.json(
        { error: '해당 조건에 맞는 꽃을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // DB에 저장 (비회원도 저장)
    let recommendationId: string | null = null;

    try {
      const supabase = await createClient();
      const user = await getUser();

      let userId: string | null = null;

      if (user) {
        const { data: publicUser } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.id)
          .single();

        userId = publicUser?.id || null;
      }

      const { data: newRecommendation, error: saveError } = await supabase
        .from('recommendations')
        .insert({
          user_id: userId,
          recommendation_type: 'preset',
          input_text: `${relationship}:${occasion}`,
          relationship,
          occasion,
          recommended_flowers: ranked,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (!saveError && newRecommendation) {
        recommendationId = newRecommendation.id;
      } else if (saveError) {
        console.error('Save error:', saveError);
      }
    } catch (dbError) {
      console.error('Failed to save preset recommendation:', dbError);
    }

    return NextResponse.json({
      success: true,
      recommendation_id: recommendationId,
      recommendations,
      ranked,
      metadata: {
        type: 'preset',
        relationship,
        occasion,
        flower_count: recommendations.length,
      },
    });
  } catch (error) {
    console.error('Preset Recommend API Error:', error);
    return NextResponse.json(
      { error: '추천 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
