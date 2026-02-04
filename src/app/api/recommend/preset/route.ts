import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getUser } from '@/lib/users/auth';
import { getCardRecommendations } from '@/lib/recommend/card-recommendation';
import { getRelationshipLabel, getOccasionLabel } from '@/lib/recommend/relationship-templates';

/**
 * @swagger
 * /api/recommend/preset:
 *   get:
 *     tags:
 *       - Recommend
 *     summary: 카드 선택 기반 꽃 추천
 *     description: |
 *       사전에 정의된 대상(Relationship)과 상황(Occasion) 카드를 선택하여 추천 꽃 목록을 조회합니다.
 *       AI 분석을 거치지 않으므로 토큰 소진이 없으며, 즉각적인 결과를 제공합니다.
 *
 *       ### 🎨 프론트엔드 개발 가이드
 *       - **비용**: **무료** (토큰 소진 없음)
 *       - **파라미터**: `/api/recommend/preset/list`에서 제공하는 `value`(Slug)를 사용해야 합니다.
 *       - **추천 방식**: 데이터베이스의 태그(`relation_tags`, `situation_tags`)를 기반으로 점수를 계산하여 가장 적합한 꽃들을 추천합니다.
 *
 *       <details>
 *       <summary>📊 점수 계산 방식 (클릭하여 펼치기)</summary>
 *
 *       | 요소 | 점수 | 설명 |
 *       |------|------|------|
 *       | 대상 태그 매칭 | **+15점** | DB의 `relation_tags`와 일치할 때 |
 *       | 상황 태그 매칭 | **+15점** | DB의 `situation_tags`와 일치할 때 |
 *       | 색상 매칭 | **+3점** | 상황별 권장 색상과 일치할 때 |
 *       | 계절 보너스 | **+4점** | 현재 계절 제철 꽃인 경우 |
 *       | 대표 꽃말 | **+2점** | `is_primary`가 `true`인 대표 꽃말 |
 *       | 회피 특성 | **-15점** | `avoidTraits`에 해당 시 감점 |
 *
 *       **정렬**: 점수 높은 순으로 정렬하되, 동일 점수인 경우 무작위로 섞어 다양한 추천 결과를 제공합니다.
 *       </details>
 *
 *       <details>
 *       <summary>🔄 결과 도출 및 정렬 (클릭하여 펼치기)</summary>
 *
 *       1. **점수 합산**: 위 표의 모든 요소를 계산하여 합산 점수를 산출합니다.
 *       2. **정렬**: 합산 점수가 높은 순서대로 1차 정렬합니다.
 *       3. **랜덤성**: 점수가 동일할 경우 내부적으로 무작위 섞기를 수행하여 매번 조금씩 다른 결과를 제공합니다.
 *       4. **최종 선정**: 상위 9~10개의 꽃을 최종 추천 목록으로 반환합니다.
 *       해당 꽃이 특정 '대상'과 '상황'에 적합한지 **DB 태그(`relation_tags`, `situation_tags`)를 0순위로 체크**하는 데이터 기반 정밀 추천 알고리즘입니다.
 *       </details>
 *
 *       **Slug 예시**:
 *       - `relationship`: `lover` (연인), `parents` (부모님), `friend` (친구) 등
 *       - `occasion`: `birthday_anniversary` (생일/기념일), `comfort_recovery` (위로/회복) 등
 *     parameters:
 *       - in: query
 *         name: relationship
 *         required: true
 *         schema:
 *           type: string
 *         description: "대상 관계 고유 Slug (예: lover)"
 *         example: "lover"
 *       - in: query
 *         name: occasion
 *         required: true
 *         schema:
 *           type: string
 *         description: "상황 고유 Slug (예: birthday_anniversary)"
 *         example: "birthday_anniversary"
 *     responses:
 *       200:
 *         description: 추천 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, recommendation_id, recommendations]
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 recommendation_id: { type: string, format: uuid, description: "생성된 추천 기록 ID" }
 *                 title: { type: string, example: "연인에게 전하는 생일/기념일 꽃다발" }
 *                 recipient: { type: string, example: "연인" }
 *                 occasion: { type: string, example: "생일/기념일" }
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       flower_id: { type: integer, example: 1 }
 *                       flower_meaning_id: { type: integer, example: 2 }
 *                       flower_name: { type: string, example: "장미" }
 *                       meaning: { type: string, example: "불타는 사랑" }
 *                       color: { type: string, example: "빨강" }
 *                       score: { type: integer, example: 42 }
 *                       image_url: { type: string, nullable: true, example: "/images/rose.jpg" }
 *             examples:
 *               preset_success:
 *                 summary: "카드 선택 기반 추천 성공"
 *                 value:
 *                   success: true
 *                   recommendation_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                   title: "연인에게 전하는 생일/기념일 꽃다발"
 *                   recipient: "연인"
 *                   occasion: "생일/기념일"
 *                   recommendations:
 *                     - flower_id: 11
 *                       flower_meaning_id: 22
 *                       flower_name: "거베라"
 *                       meaning: "신비, 수수께끼"
 *                       color: "주황"
 *                       score: 38
 *                       image_url: "https://.../gerbera.png"
 *       400:
 *         description: 필수 파라미터 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string }
 *             examples:
 *               missing_relationship:
 *                 summary: "relationship 파라미터 누락"
 *                 value: { error: "relationship 파라미터가 필요합니다." }
 *               missing_occasion:
 *                 summary: "occasion 파라미터 누락"
 *                 value: { error: "occasion 파라미터가 필요합니다." }
 *       404:
 *         description: 해당 조건에 맞는 꽃 데이터가 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "해당 조건에 맞는 꽃을 찾을 수 없습니다." }
 *       500:
 *         description: 서버 내부 오류
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

      const relationshipLabel = getRelationshipLabel(relationship);
      const occasionLabel = getOccasionLabel(occasion);

      const { data: newRecommendation, error: saveError } = await supabase
        .from('recommendations')
        .insert({
          user_id: userId,
          recommendation_type: 'preset',
          input_text: `${relationshipLabel}:${occasionLabel}`,
          relationship: relationshipLabel,
          occasion: occasionLabel,
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

    // preset 추천의 경우 title, message 등은 별도로 생성하지 않으므로 기본값 또는 label 사용
    // AI 추천과의 응답 형식 통일을 위해 추가
    const relationshipLabel = getRelationshipLabel(relationship);
    const occasionLabel = getOccasionLabel(occasion);

    return NextResponse.json({
      success: true,
      recommendation_id: recommendationId,
      total_count: standardizedRecommendations.length,
      title: `${relationshipLabel}에게 전하는 ${occasionLabel} 꽃다발`, // 간단한 제목 생성
      message: '', // preset은 메시지 생성 안 함
      recipient: relationshipLabel,
      occasion: occasionLabel,
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
