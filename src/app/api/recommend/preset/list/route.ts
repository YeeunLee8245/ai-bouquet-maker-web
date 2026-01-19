import { NextRequest, NextResponse } from 'next/server';
import { getAvailableRelationships, getAvailableOccasions, getAllOccasions } from '@/lib/recommend/card-recommendation';

/**
 * @swagger
 * /api/recommend/preset/list:
 *   get:
 *     tags:
 *       - Recommend
 *     summary: 프리셋 선택지 목록 조회
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
 *             example:
 *               success: true
 *               relationships:
 *                 - value: "parents"
 *                   label: "부모님"
 *                   description: "감사와 존경의 마음을 전하는 꽃"
 *                 - value: "lover"
 *                   label: "연인"
 *                   description: "사랑과 로맨스를 전하는 꽃"
 *               occasions:
 *                 - value: "birthday"
 *                   label: "생일"
 *                   description: "새로운 한 해의 시작을 축하하는 꽃"
 *                 - value: "anniversary"
 *                   label: "기념일"
 *                   description: "특별한 날을 기억하는 꽃"
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const relationship = searchParams.get('relationship');

    // relationship 파라미터가 있으면 해당 관계에 맞는 상황만 반환
    if (relationship) {
      const occasions = await getAvailableOccasions(relationship);
      return NextResponse.json({
        success: true,
        occasions,
      });
    }

    // relationship 파라미터가 없으면 전체 관계 + 전체 상황 목록 반환
    const relationships = await getAvailableRelationships();
    const occasions = await getAllOccasions();

    return NextResponse.json({
      success: true,
      relationships,
      occasions,
    });
  } catch (error) {
    console.error('Preset List API Error:', error);
    return NextResponse.json(
      { error: '옵션 조회 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
