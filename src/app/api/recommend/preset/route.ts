import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getUser } from '@/lib/users/auth';
import { getCardRecommendations } from '@/lib/recommend/card-recommendation';

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
 *       최대 10개의 추천 결과를 반환하며, 페이징을 지원하지 않습니다.
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
 *               properties:
 *                 success:
 *                   type: boolean
 *                 recommendation_id:
 *                   type: string
 *                   format: uuid
 *                 total_count:
 *                   type: integer
 *                   description: "검색된 꽃의 총 개수 (최대 10개)"
 *                 recommendations:
 *                   type: array
 *             example:
 *               success: true
 *               recommendation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               total_count: 2
 *               recommendations:
 *                 - flower_id: 28
 *                   flower_meaning_id: 58
 *                   flower_name: "안스리움"
 *                   meaning: "사랑에 번민하는 마음"
 *                   color: "분홍"
 *                   score: 17
 *                   image_url: "anthurium.jpg"
 *                 - flower_id: 1
 *                   flower_meaning_id: 2
 *                   flower_name: "장미"
 *                   meaning: "불타는 사랑"
 *                   color: "빨강"
 *                   score: 16
 *                   image_url: "rose.jpg"
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
    console.error('Preset Recommend API Error:', error);
    return NextResponse.json(
      { error: '추천 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
