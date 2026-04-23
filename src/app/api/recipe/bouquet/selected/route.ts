import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { toSupabaseResizedImageUrl } from '@shared/utils/image-url';

const TAG_TOTAL_CHAR_LIMIT = 8;
const TAG_MAX_COUNT = 3;

function normalizeTags(rawTags: string[] | null | undefined): string[] {
  if (!Array.isArray(rawTags)) {
    return [];
  }

  return rawTags
    .map(tag => tag.trim())
    .filter(Boolean);
}

function mergeTagsWithTotalCharLimit(
  emotionTags: string[],
  styleTags: string[],
): string[] {
  const merged = [...new Set([...emotionTags, ...styleTags])];
  const result: string[] = [];
  let totalChars = 0;

  for (const tag of merged) {
    if (result.length >= TAG_MAX_COUNT) {
      break;
    }

    const nextTotal = totalChars + tag.length;
    if (nextTotal > TAG_TOTAL_CHAR_LIMIT) {
      continue;
    }
    result.push(tag);
    totalChars = nextTotal;
  }

  return result;
}

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
 *       - **colorInfos**: 각 색상(hex)별로 meaningId와 태그가 1:1 매핑됩니다.
 *       - **기본 꽃말 제외**: `color`가 `null`인 기본(회색) 꽃말은 응답에서 제외됩니다.
 *       - **tags 생성 기준**: `emotion_tags + style_tags`를 합쳐 중복 제거 후, 최대 3개/총 글자수 8자 이내로 제공합니다.
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
 *                 required: [id, name_ko, imageUrl, colorInfos]
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: 꽃 ID
 *                     example: "12"
 *                   name_ko:
 *                     type: string
 *                     description: 꽃 한글명
 *                     example: "튤립"
 *                   imageUrl:
 *                     type: string
 *                     nullable: true
 *                     description: 대표 이미지 URL
 *                     example: "https://example.com/tulip.png"
 *                   colorInfos:
 *                     type: array
 *                     description: 색상별 꽃말 정보 (hex-meaningId 1:1 매핑)
 *                     items:
 *                       type: object
 *                       required: [hex, meaningId, tags]
 *                       properties:
 *                         hex:
 *                           type: string
 *                           description: 색상 Hex 코드 (icon_color)
 *                           example: "#F8BBD0"
 *                         meaningId:
 *                           type: string
 *                           description: 꽃말 ID (flower_meanings.id)
 *                           example: "101"
 *                         tags:
 *                           type: array
 *                           description: emotion_tags + style_tags 기반 표시 태그 (중복 제거, 최대 3개, 총 글자수 8자 이내)
 *                           items:
 *                             type: string
 *                           example: ["사랑", "우아한"]
 *             examples:
 *               success:
 *                 summary: 정상 조회 응답
 *                 value:
 *                   - id: "12"
 *                     name_ko: "튤립"
 *                     imageUrl: "/images/flowers/tulip.png"
 *                     colorInfos:
 *                       - hex: "#F8BBD0"
 *                         meaningId: "101"
 *                         tags: ["사랑", "우아한"]
 *                       - hex: "#FF4D6D"
 *                         meaningId: "102"
 *                         tags: ["열정", "화려한"]
 *                   - id: "5"
 *                     name_ko: "장미"
 *                     imageUrl: "/images/flowers/rose.png"
 *                     colorInfos:
 *                       - hex: "#E31C25"
 *                         meaningId: "205"
 *                         tags: ["열정", "로맨틱"]
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
        flower_meanings (
          id,
          color,
          icon_color,
          is_primary,
          emotion_tags,
          style_tags
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
        const meanings = flower.flower_meanings || [];

        // colorInfos: hex-meaningId 1:1 매핑, is_primary를 가장 위로 정렬
        const colorInfos = meanings
          // 기본 꽃말(회색): color가 null인 항목은 제외
          .filter(m => m.color != null && m.icon_color != null && m.icon_color.length > 0)
          .sort((a, b) => {
            // is_primary가 true인 것을 가장 위로
            if (a.is_primary && !b.is_primary) {
              return -1;
            }
            if (!a.is_primary && b.is_primary) {
              return 1;
            }
            return 0;
          })
          .map(m => {
            const emotionTags = normalizeTags(m.emotion_tags);
            const styleTags = normalizeTags(m.style_tags);
            return {
              hex: m.icon_color as string,
              meaningId: String(m.id),
              tags: mergeTagsWithTotalCharLimit(emotionTags, styleTags),
            };
          });

        return {
          id: String(flower.id),
          name_ko: flower.name_ko,
          imageUrl: toSupabaseResizedImageUrl((flower.images as string[] | null)?.[0]),
          colorInfos,
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
