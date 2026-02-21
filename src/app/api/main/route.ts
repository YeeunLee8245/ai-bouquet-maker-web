import { NextResponse } from 'next/server';
import { getMainData } from './getMainData';

/**
 * @swagger
 * /api/main:
 *   get:
 *     tags:
 *       - Main
 *     summary: 홈 화면 데이터 조회
 *     description: 홈 화면에 필요한 빠른 대상 추천, 인기 꽃(최근 24시간), 오늘의 꽃 정보를 조회합니다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   required: [recipients, popularFlowers, todaysFlower]
 *                   properties:
 *                     recipients:
 *                       type: array
 *                       description: 빠른 대상 추천 리스트 (프론트엔드 홈 화면 상단 노출용)
 *                       items:
 *                         type: object
 *                         required: [id, label]
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: 관계 슬러그 (추천 API 파라미터로 사용)
 *                             example: lover
 *                           label:
 *                             type: string
 *                             description: 표시 이름
 *                             example: 연인
 *                     popularFlowers:
 *                       type: array
 *                       description: 인기 꽃 리스트 (최근 24시간 내 좋아요 기반 랜덤 10개)
 *                       items:
 *                         type: object
 *                         required: [id, name_ko, image_url, representative_meanings]
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name_ko:
 *                             type: string
 *                             example: 장미
 *                           image_url:
 *                             type: string
 *                             example: https://example.com/flowers/rose.png
 *                           representative_meanings:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: [사랑, 행복]
 *                     todaysFlower:
 *                       type: object
 *                       description: 오늘의 꽃 (현재 계절 + 주간 인기 꽃 조합)
 *                       nullable: true
 *                       required: [id, name_ko, image_url, representative_meanings]
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 12
 *                         name_ko:
 *                           type: string
 *                           example: 프리지아
 *                         image_url:
 *                           type: string
 *                           example: https://example.com/flowers/freesia.png
 *                         representative_meanings:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: [응원, 시작]
 *             examples:
 *               main_data_success:
 *                 summary: 홈 데이터 조회 성공 예시
 *                 value:
 *                   success: true
 *                   data:
 *                     recipients:
 *                       - id: lover
 *                         label: 연인
 *                       - id: parents
 *                         label: 부모님
 *                     popularFlowers:
 *                       - id: 1
 *                         name_ko: 장미
 *                         image_url: https://example.com/flowers/rose.png
 *                         representative_meanings: [사랑]
 *                     todaysFlower:
 *                       id: 12
 *                       name_ko: 프리지아
 *                       image_url: https://example.com/flowers/freesia.png
 *                       representative_meanings: [응원]
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 서버 에러가 발생했습니다.
 */
export async function GET() {
  try {
    const { recipients, popularFlowers, todaysFlower } = await getMainData();

    return NextResponse.json({
      success: true,
      data: {
        recipients,
        popularFlowers,
        todaysFlower,
      },
    });
  } catch (error) {
    console.error('Main API Error:', error);
    return NextResponse.json(
      { success: false, message: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
