import { NextRequest, NextResponse } from 'next/server';
import { getCardRecommendations, getAvailableRelationships, getAvailableOccasions, getAllOccasions } from '@/lib/card-recommendation';

/**
 * @swagger
 * /api/recommend/preset:
 *   post:
 *     tags:
 *       - Recommend
 *     summary: 카드 선택 기반 꽃 추천
 *     description: |
 *       대상(relationship)과 상황(occasion) 카드를 선택하여 꽃을 추천받습니다.
 *       AI를 사용하지 않고 DB 기반 고정 점수 계산 방식을 사용합니다.
 *
 *       ## 점수 계산 방식
 *
 *       | 요소 | 점수 | 설명 |
 *       |------|------|------|
 *       | 관계 특성 매칭 | **+5점** (per tag) | recommendedTraits와 emotion_tags 매칭 |
 *       | 상황 추천 꽃 | **+10점** | occasionGuides.recommendedFlowers에 포함된 꽃 |
 *       | 색상 매칭 | **+3점** | 상황별 권장 색상과 매칭 |
 *       | 계절 보너스 | **+4점** | 현재 계절 제철 꽃 |
 *       | 대표 꽃말 | **+2점** | is_primary가 true인 꽃말 |
 *       | 회피 특성 | **-15점** | avoidTraits에 해당하면 감점 |
 *
 *       **계절 필터링**: 현재 계절에 맞는 꽃만 추천
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - relationship
 *               - occasion
 *             properties:
 *               relationship:
 *                 type: string
 *                 enum: [parents, lover, friend, colleague, teacher, elder, child]
 *                 description: |
 *                   대상 선택
 *                   - parents: 부모님
 *                   - lover: 연인
 *                   - friend: 친구
 *                   - colleague: 직장동료/상사
 *                   - teacher: 선생님/스승
 *                   - elder: 어르신
 *                   - child: 아이/조카
 *                 example: "lover"
 *               occasion:
 *                 type: string
 *                 enum: [birthday, anniversary, congratulation, sympathy, recovery, apology, proposal, graduation_admission, holiday, teachersday, promotion, retirement]
 *                 description: |
 *                   상황 선택
 *                   - birthday: 생일
 *                   - anniversary: 기념일
 *                   - congratulation: 축하
 *                   - graduation_admission: 졸업/입학
 *                   - holiday: 명절
 *                   - 등등
 *                 example: "birthday"
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
 *                 recommendations:
 *                   type: array
 *                   description: UI 렌더링용 추천 꽃 목록
 *                 ranked:
 *                   type: array
 *                   description: DB 저장용 추천 데이터
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     relationship:
 *                       type: string
 *                     occasion:
 *                       type: string
 *                     flower_count:
 *                       type: integer
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 해당 조건에 맞는 꽃 없음
 *       500:
 *         description: 서버 오류
 *   get:
 *     tags:
 *       - Recommend
 *     summary: 카드 기반 추천 선택지(대상,상황) 목록 조회
 *     description: |
 *       사용 가능한 대상(relationship) 목록과 상황(occasion) 목록을 조회합니다.
 *
 *       - relationship 파라미터 없음: 관계 목록 + 전체 상황 목록 반환
 *       - relationship 파라미터 있음: 해당 관계에 맞는 상황 목록만 반환
 *     parameters:
 *       - in: query
 *         name: relationship
 *         schema:
 *           type: string
 *         required: false
 *         description: 관계 타입 (선택사항)
 *         example: "lover"
 *     responses:
 *       200:
 *         description: 옵션 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 relationships:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                       label:
 *                         type: string
 *                       description:
 *                         type: string
 *                 occasions:
 *                   type: array
 *                   description: relationship 파라미터가 있을 때만 반환
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { relationship, occasion } = body;

    // 입력 검증
    if (!relationship || typeof relationship !== 'string') {
      return NextResponse.json(
        { error: 'relationship을 선택해주세요.' },
        { status: 400 },
      );
    }

    if (!occasion || typeof occasion !== 'string') {
      return NextResponse.json(
        { error: 'occasion을 선택해주세요.' },
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

    return NextResponse.json({
      success: true,
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
    console.error('Select Recommend API Error:', error);
    return NextResponse.json(
      { error: '추천 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const relationship = searchParams.get('relationship');

    // relationship 파라미터가 있으면 해당 관계에 맞는 상황만 반환
    if (relationship) {
      const occasions = getAvailableOccasions(relationship);
      return NextResponse.json({
        success: true,
        occasions,
      });
    }

    // relationship 파라미터가 없으면 전체 관계 + 전체 상황 목록 반환
    const relationships = getAvailableRelationships();
    const occasions = getAllOccasions();

    return NextResponse.json({
      success: true,
      relationships,
      occasions,
    });
  } catch (error) {
    console.error('Select Options API Error:', error);
    return NextResponse.json(
      { error: '옵션 조회 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
