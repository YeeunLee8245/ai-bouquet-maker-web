import { NextRequest, NextResponse } from 'next/server';
import { queryDirectory } from '@/lib/flowers/query-directory';

/**
 * @swagger
 * /api/flowers/dictionary:
 *   get:
 *     tags:
 *       - Flowers
 *     summary: 꽃 사전 목록 조회
 *     description: |
 *       필터, 검색, 정렬을 지원하는 꽃 사전 API입니다.
 *       사용자가 꽃을 검색하거나 계절별, 색상별로 탐색할 때 사용합니다.
 *
 *       ### 🎨 프론트엔드 개발 가이드
 *       - **`default_season`**: 현재 서버 시간 기준 추천 계절입니다. 초기 진입 시 이 값을 기반으로 필터를 설정할 수 있습니다.
 *       - **`isLiked` 활성화**: 사용자가 로그인 상태일 때만 `true`/`false`가 제공됩니다. 비로그인 시 `isLiked` 키 자체가 응답에 없으므로(`undefined`) 하트 아이콘을 비활성 상태로 그려주세요.
 *       - **이미지 최적화**: `imageUrl`이 없는 경우 프론트엔드 기본 이미지를 사용하도록 구현하는 것이 좋습니다.
 *
 *       **정렬 기준**:
 *       - `name`: 가나다순 (기본값)
 *       - `popular`: 좋아요가 많은 인기순
 *     parameters:
 *       - name: seasons
 *         in: query
 *         description: |
 *           계절 필터 (콤마로 구분된 여러 개 가능)
 *           - 지원 값: `spring`, `summer`, `autumn`, `winter`, `all_year`
 *           - 미지정 시 전체 계절 조회
 *         schema:
 *           type: string
 *           example: spring,summer
 *       - name: colors
 *         in: query
 *         description: |
 *           색상 이름 필터 (콤마로 구분된 여러 개 가능)
 *           - 현재 지원 색상: 노랑, 보라, 분홍, 빨강, 주황, 파랑, 흰색
 *           - 존재하지 않는 색상 입력 시 빈 결과 반환
 *         schema:
 *           type: string
 *           example: 빨강,분홍
 *       - name: search
 *         in: query
 *         description: |
 *           꽃 이름 또는 꽃말로 검색 (부분 일치)
 *         schema:
 *           type: string
 *           example: 사랑
 *       - name: sort
 *         in: query
 *         description: 정렬 옵션
 *         schema:
 *           type: string
 *           enum: [popular, name]
 *           default: name
 *       - name: name_only
 *         in: query
 *         description: |
 *           `true` 지정 시 꽃 이름으로만 검색합니다. (꽃말 검색 제외)
 *           꽃다발 만들기 등에서 꽃 이름으로만 빠르게 찾을 때 사용합니다.
 *           미지정 또는 `false`일 경우 이름 + 꽃말 모두 검색합니다.
 *         schema:
 *           type: boolean
 *           default: false
 *       - name: page
 *         in: query
 *         description: 페이지 번호 (1부터 시작)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: 한 페이지에 표시할 아이템 수
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, data]
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   required: [default_season, flowers, total, page, limit, has_next_page]
 *                   properties:
 *                     default_season:
 *                       type: string
 *                       enum: [spring, summer, autumn, winter]
 *                       description: "현재 서버 시간 기준 계절 (추천용)"
 *                       example: spring
 *                     flowers:
 *                       type: array
 *                       description: "꽃 정보 목록 (간략 정보)"
 *                       items:
 *                         type: object
 *                         required: [id, imageUrl, name, colors, tags]
 *                         properties:
 *                           id: { type: string, description: "꽃 ID (상세 조회용)", example: "1" }
 *                           imageUrl: { type: string, description: "대표 이미지 URL", example: "/images/flowers/rose.png" }
 *                           name: { type: string, description: "한글 이름", example: "장미" }
 *                           defaultMeaningId: { type: string, description: "기본 꽃말 ID (is_primary:true 우선, 없으면 첫 번째)", example: "101" }
 *                           isLiked: { type: boolean, nullable: true, description: "로그인 유저의 좋아요 여부. 비로그인 시 키 자체가 없음(undefined)", example: true }
 *                           colors: { type: array, items: { type: string }, description: "대표 색상 코드(HEX) 목록", example: ["#FF4D6D"] }
 *                           tags: { type: array, items: { type: string }, description: "상징 꽃말 (최대 3개)", example: ["열정적 사랑", "순결"] }
 *                     total: { type: integer, description: "전체 결과 수", example: 120 }
 *                     page: { type: integer, example: 1 }
 *                     limit: { type: integer, example: 20 }
 *                     has_next_page: { type: boolean, example: true }
 *             examples:
 *               flower_list_success:
 *                 summary: "꽃 목록 조회 성공 (로그인 상태, 봄/분홍 필터)"
 *                 value:
 *                   success: true
 *                   data:
 *                     default_season: "spring"
 *                     flowers:
 *                       - id: "1"
 *                         imageUrl: "/images/flowers/tulip.png"
 *                         name: "튤립"
 *                         defaultMeaningId: "101"
 *                         isLiked: true
 *                         colors: ["#F8BBD0", "#FF4D6D"]
 *                         tags: ["사랑의 고백", "영원한 애정"]
 *                       - id: "5"
 *                         imageUrl: "/images/flowers/cherry_blossom.png"
 *                         name: "벚꽃"
 *                         defaultMeaningId: "205"
 *                         isLiked: false
 *                         colors: ["#F8BBD0", "#E91E63"]
 *                         tags: ["순결", "절세미인"]
 *                     total: 45
 *                     page: 1
 *                     limit: 20
 *                     has_next_page: true
 *               flower_list_no_login:
 *                 summary: "비로그인 조회 (isLiked 키 없음)"
 *                 value:
 *                   success: true
 *                   data:
 *                     default_season: "spring"
 *                     flowers:
 *                       - id: "1"
 *                         imageUrl: "/images/flowers/tulip.png"
 *                         name: "튤립"
 *                         defaultMeaningId: "101"
 *                         colors: ["#F8BBD0", "#FF4D6D"]
 *                         tags: ["사랑의 고백", "영원한 애정"]
 *                     total: 120
 *                     page: 1
 *                     limit: 20
 *                     has_next_page: true
 *       500:
 *         description: 서버 내부 오류 (DB 조회 실패 등)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "꽃 목록 조회 중 오류가 발생했습니다." }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const seasonsParam = searchParams.get('seasons');
    const colorsParam = searchParams.get('colors');
    const search = searchParams.get('search') || '';
    const nameOnly = searchParams.get('name_only') === 'true';
    const sort = searchParams.get('sort') || 'name';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const seasons = seasonsParam
      ? seasonsParam.split(',').map(s => s.trim())
      : null;

    const colors = colorsParam
      ? colorsParam.split(',').map(c => c.trim()).filter(Boolean)
      : [];

    const data = await queryDirectory({ seasons, colors, search, nameOnly, sort, page, limit });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Flower dictionary error:', error);
    return NextResponse.json(
      { error: '꽃 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
