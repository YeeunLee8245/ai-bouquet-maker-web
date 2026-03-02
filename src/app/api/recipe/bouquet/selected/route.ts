import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { toSupabaseResizedImageUrl } from '@shared/utils/image-url';

/**
 * @swagger
 * /api/recipe/bouquet/selected:
 *   post:
 *     tags:
 *       - Recipe
 *     summary: 선택한 꽃 요약 정보 조회
 *     description: |
 *       꽃다발 담기 버튼에서 선택된 꽃 ID 배열을 전달하면
 *       프론트 렌더링에 바로 사용할 수 있는 요약 정보를 반환합니다.
 *
 *       ### 프론트 사용 가이드
 *       - 요청 본문은 **배열 자체**입니다. (예: `[12, 5, 31]`)
 *       - 응답도 **배열 자체**입니다. (예: `[{...}, {...}]`)
 *       - 응답 순서는 요청한 ID 순서를 최대한 유지합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             description: 선택한 꽃 ID 목록 (다중 선택 가능)
 *             items:
 *               oneOf:
 *                 - type: integer
 *                 - type: string
 *           examples:
 *             basic:
 *               summary: 숫자 ID 배열
 *               value: [12, 5, 31]
 *             string_ids:
 *               summary: 문자열 ID 배열
 *               value: ["12", "5", "31"]
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required: [id, name_ko, tags, imageUrl, colors]
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: 꽃 ID
 *                     example: "12"
 *                   name_ko:
 *                     type: string
 *                     description: 꽃 한글명
 *                     example: "튤립"
 *                   tags:
 *                     type: array
 *                     description: 대표 꽃말 태그
 *                     items:
 *                       type: string
 *                     example: ["사랑", "응원", "감사"]
 *                   imageUrl:
 *                     type: string
 *                     nullable: true
 *                     description: 대표 이미지 URL
 *                     example: "https://example.com/tulip.png"
 *                   colors:
 *                     type: array
 *                     description: 대표 색상(hex) 목록
 *                     items:
 *                       type: string
 *                     example: ["#F8BBD0", "#FF4D6D"]
 *             examples:
 *               success:
 *                 summary: 정상 조회 응답
 *                 value:
 *                   - id: "12"
 *                     name_ko: "튤립"
 *                     tags: ["사랑", "응원"]
 *                     imageUrl: "/images/flowers/tulip.png"
 *                     colors: ["#F8BBD0", "#FF4D6D"]
 *                   - id: "5"
 *                     name_ko: "장미"
 *                     tags: ["열정", "감사"]
 *                     imageUrl: "/images/flowers/rose.png"
 *                     colors: ["#E31C25", "#FF8A80"]
 *       400:
 *         description: 요청 형식 오류 (배열이 아니거나 유효한 ID 없음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 요청 본문은 유효한 꽃 ID 배열이어야 합니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 선택한 꽃 정보를 조회하는 중 오류가 발생했습니다.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const selectedIds = Array.isArray(body)
      ? body
        .map(item => Number(item))
        .filter(id => Number.isInteger(id) && id > 0)
      : [];

    if (selectedIds.length === 0) {
      return NextResponse.json(
        { error: '요청 본문은 유효한 꽃 ID 배열이어야 합니다.' },
        { status: 400 },
      );
    }

    const uniqueIds = Array.from(new Set(selectedIds));
    const supabase = await createClient();

    const { data: flowers, error } = await supabase
      .from('flowers')
      .select(`
        id,
        name_ko,
        images,
        representative_meanings_tags,
        flower_meanings (
          id,
          meaning,
          color,
          icon_color,
          is_primary
        )
      `)
      .in('id', uniqueIds);

    if (error) {
      console.error('Selected flowers query error:', error);
      return NextResponse.json(
        { error: '선택한 꽃 정보를 조회하는 중 오류가 발생했습니다.' },
        { status: 500 },
      );
    }

    const orderMap = new Map<number, number>();
    selectedIds.forEach((id, index) => {
      if (!orderMap.has(id)) {
        orderMap.set(id, index);
      }
    });

    const responseItems = (flowers || [])
      .map(flower => {
        const colors = Array.from(new Set(
          (flower.flower_meanings || [])
            .map(meaning => meaning.icon_color)
            .filter((color): color is string => typeof color === 'string' && color.length > 0),
        ));

        return {
          id: String(flower.id),
          name_ko: flower.name_ko,
          imageUrl: toSupabaseResizedImageUrl((flower.images as string[] | null)?.[0]),
          tags: flower.representative_meanings_tags || [],
          colors,
        };
      })
      .sort((a, b) => (orderMap.get(Number(a.id)) ?? 0) - (orderMap.get(Number(b.id)) ?? 0));

    return NextResponse.json(responseItems);
  } catch (error) {
    console.error('Selected flowers API error:', error);
    return NextResponse.json(
      { error: '선택한 꽃 정보를 조회하는 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
