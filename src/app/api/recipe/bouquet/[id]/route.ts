import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { BouquetRecipeContent, BouquetLayout } from '@/types/recommendation';
import { getPublicUser } from '@/lib/users/auth';

function toTagsFromMeaning(meaning: string | null | undefined): string[] {
  if (!meaning) {
    return [];
  }

  return meaning
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}

/**
 * @swagger
 * /api/recipe/bouquet/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: 꽃다발 레시피 ID (UUID)
 *       schema:
 *         type: string
 *         format: uuid
 *       example: "550e8400-e29b-41d4-a716-446655440000"
 *   get:
 *     tags:
 *       - Recipe
 *     summary: 꽃다발 레시피 상세 조회
 *     description: |
 *       특정 꽃다발 레시피의 상세 정보를 조회합니다.
 *       꽃다발의 구성(꽃종류, 수량, 색상), 포장 옵션, 그리고 미리보기를 위한 레이아웃 좌표 정보를 포함합니다.
 *
 *       ### 🎨 프론트엔드 개발 가이드 (v2 - colorInfos 기반)
 *       - **`color` (Hex)**: 저장된 꽃 색상 (렌더링용)
 *       - **`meaningId`**: 해당 색상에 매핑된 flower_meaning_id
 *       - **`tags` (Array)**: `flower_meanings.meaning`을 쉼표 기준으로 분리한 태그들
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
 *                   $ref: '#/components/schemas/BouquetRecipeDetail'
 *             examples:
 *               success_detail:
 *                 summary: "꽃다발 상세 정보 조회 성공"
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "550e8400-e29b-41d4-a716-446655440000"
 *                     name: "어머니 생신 축하 꽃다발"
 *                     occasion: "생일"
 *                     recipient: "어머니"
 *                     message: "항상 건강하세요!"
 *                     flowers:
 *                       - flower_id: "1"
 *                         flower_name: "장미"
 *                         tags: ["사랑", "열정", "감사"]
 *                         color_and_quantity:
 *                           - color: "#FF0000"
 *                             quantity: 3
 *                           - color: "#FFC0CB"
 *                             quantity: 2
 *                     wrapping: { wrappingColor: "#FFFFFF", ribbonColor: "#FF0000" }
 *                     layout: { items: [] }
 *                     created_at: "2024-02-04T12:00:00Z"
 *                     updated_at: "2024-02-04T12:00:00Z"
 *       404:
 *         description: 레시피를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "해당 꽃다발 레시피를 찾을 수 없습니다." }
 *       500:
 *         description: 서버 내부 오류
 *   put:
 *     tags:
 *       - Recipe
 *     summary: 꽃다발 레시피 수정
 *     description: |
 *       사용자가 만든 기존 꽃다발 레시피의 정보를 업데이트합니다.
 *       본인이 작성한 레시피만 수정 가능합니다.
 *
 *       ### 🎨 프론트엔드 개발 가이드 (v2 - colorInfos 기반)
 *       - **필드 선택적 수정**: 수정하려는 필드만 보내는 것이 아니라, **전체 객체 구조**를 맞춰서 보내는 것을 권장합니다 (특히 `recipe`, `layout`).
 *       - **`tags` 기준**: 상세 응답의 `tags`는 `flower_meanings.meaning`을 쉼표(,)로 분리한 값입니다.
 *       - **hex ↔ meaningId 1:1 매핑**: 색상을 변경하면 해당 colorInfo의 `meaningId`를 `flower_meaning_id`로 저장합니다.
 *       - **`color`**: 선택한 색상의 hex 값 (렌더링용)
 *       - **`flower_meaning_id`**: 선택한 색상에 매핑된 meaningId (`flower_meanings.meaning` 조회용)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, description: "꽃다발 이름", example: "수정된 결혼 기념일 꽃다발" }
 *               occasion: { type: string, description: "상황", example: "결혼 기념일" }
 *               recipient: { type: string, description: "받는 사람", example: "아내" }
 *               message: { type: string, description: "카드 메시지", example: "세상에서 제일 사랑해" }
 *               recipe:
 *                 type: object
 *                 description: 꽃다발 구성 (꽃, 포장)
 *                 properties:
 *                   flowers:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required: [flower_id, flower_meaning_id, quantity, color]
 *                       properties:
 *                         flower_id: { type: string, example: "1" }
 *                         flower_meaning_id: { type: string, example: "101" }
 *                         quantity: { type: integer, example: 12 }
 *                         color: { type: string, example: "#FFC0CB" }
 *                   wrapping:
 *                     type: object
 *                     properties:
 *                       wrappingColor: { type: string, example: "#F0F8FF" }
 *                       ribbonColor: { type: string, example: "#FF69B4" }
 *               layout:
 *                 type: object
 *                 description: 캔버스 배치 정보
 *                 properties:
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         flower_id: { type: string }
 *                         x: { type: number, example: 0.5 }
 *                         y: { type: number, example: 0.7 }
 *                         scale: { type: number, example: 1.0 }
 *                         z_index: { type: integer, example: 1 }
 *                         type: { type: string, description: "등록된 아이콘 키 (예: rose, marigold, tulip 등)", example: "rose" }
 *           examples:
 *             full_update:
 *               summary: "전체 정보 수정 예시"
 *               value:
 *                 name: "수정된 결혼 기념일 꽃다발"
 *                 occasion: "결혼 기념일"
 *                 recipient: "아내"
 *                 message: "세상에서 제일 사랑해"
 *                 recipe:
 *                   flowers:
 *                     - flower_id: "1"
 *                       flower_meaning_id: "101"
 *                       quantity: 12
 *                       color: "#FFC0CB"
 *                   wrapping:
 *                     wrappingColor: "#F0F8FF"
 *                     ribbonColor: "#FF69B4"
 *                 layout:
 *                   items:
 *                     - flower_id: "1"
 *                       x: 0.5
 *                       y: 0.7
 *                       z_index: 1
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "로그인이 필요한 서비스입니다." }
 *       403:
 *         description: 권한 없음 (타인의 레시피 수정 시도)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "수정 권한이 없습니다." }
 *       404:
 *         description: 레시피를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "레시피를 찾을 수 없습니다." }
 *   delete:
 *     tags:
 *       - Recipe
 *     summary: 꽃다발 레시피 삭제 (단일/일괄)
 *     description: |
 *       저장된 꽃다발 레시피를 삭제합니다. 본인 것만 삭제 가능합니다.
 *
 *       ### 삭제 방식
 *       - **단일 삭제**: URL 경로의 id 파라미터만 사용 (기존 방식)
 *       - **일괄 삭제**: Request Body에 ids 배열을 전달하면 해당 ID들을 일괄 삭제
 *         - 일괄 삭제 시 URL의 id 파라미터는 무시됩니다
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: 일괄 삭제할 꽃다발 레시피 ID 배열
 *                 example: ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
 *           examples:
 *             bulk_delete:
 *               summary: "일괄 삭제 예시"
 *               value:
 *                 ids: ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 deletedCount: { type: integer, description: "삭제된 레시피 수 (일괄 삭제 시)", example: 3 }
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "로그인이 필요한 서비스입니다." }
 *       403:
 *         description: 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "삭제 권한이 없습니다." }
 *       404:
 *         description: 레시피를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "레시피를 찾을 수 없습니다." }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // 1. 꽃다발 레시피 조회
    const { data: bouquet, error } = await supabase
      .from('bouquet_recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !bouquet) {
      if (error?.code === 'PGRST116') { // Not found
        return NextResponse.json(
          { error: '해당 꽃다발 레시피를 찾을 수 없습니다.' },
          { status: 404 },
        );
      }
      console.error('Bouquet detail query error:', error);
      return NextResponse.json(
        { error: '꽃다발 상세 조회 중 오류가 발생했습니다.' },
        { status: 500 },
      );
    }

    // 2. 꽃 정보 추출 및 조회
    const recipe = bouquet.recipe as BouquetRecipeContent | null;
    const flowersInRecipe = recipe?.flowers || [];
    const flowerIds = Array.from(new Set(flowersInRecipe.map(f => f.flower_id)));
    const meaningIds = Array.from(new Set(flowersInRecipe.map(f => f.flower_meaning_id).filter(Boolean)));

    // 꽃 이름 맵
    let flowerMap: Record<string, string> = {};
    if (flowerIds.length > 0) {
      const { data: flowers } = await supabase
        .from('flowers')
        .select('id, name_ko')
        .in('id', flowerIds);

      if (flowers) {
        flowerMap = Object.fromEntries(
          flowers.map(f => [String(f.id), f.name_ko]),
        );
      }
    }

    // 꽃말 맵 (icon_color + meaning)
    let meaningMap: Record<string, { icon_color: string | null; meaning: string | null }> = {};
    if (meaningIds.length > 0) {
      const { data: meanings } = await supabase
        .from('flower_meanings')
        .select('id, icon_color, meaning')
        .in('id', meaningIds);

      if (meanings) {
        meaningMap = Object.fromEntries(
          meanings.map(m => [String(m.id), { icon_color: m.icon_color, meaning: m.meaning }]),
        );
      }
    }

    // 3. 데이터 포맷팅 - flower_id 기준으로 그룹핑
    const flowersGrouped = new Map<string, {
      flower_id: string;
      flower_name: string;
      tags: string[];
      color_and_quantity: Array<{ color: string; quantity: number; meaningId: string | null }>;
    }>();

    for (const f of flowersInRecipe) {
      const meaningInfo = f.flower_meaning_id ? meaningMap[String(f.flower_meaning_id)] : null;
      const color = f.color || meaningInfo?.icon_color || '#CCCCCC';
      const meaningTags = toTagsFromMeaning(meaningInfo?.meaning);

      if (flowersGrouped.has(f.flower_id)) {
        const existing = flowersGrouped.get(f.flower_id)!;
        // color_and_quantity 배열에 추가
        existing.color_and_quantity.push({ color, quantity: f.quantity, meaningId: f.flower_meaning_id || null });
        // 중복되지 않는 태그 추가
        for (const tag of meaningTags) {
          if (!existing.tags.includes(tag)) {
            existing.tags.push(tag);
          }
        }
      } else {
        flowersGrouped.set(f.flower_id, {
          flower_id: f.flower_id,
          flower_name: flowerMap[f.flower_id] || '알 수 없음',
          tags: [...meaningTags],
          color_and_quantity: [{ color, quantity: f.quantity, meaningId: f.flower_meaning_id || null }],
        });
      }
    }

    const flowers = Array.from(flowersGrouped.values());

    const responseData = {
      id: bouquet.id,
      name: bouquet.name || '이름 없음',
      occasion: bouquet.occasion || null,
      recipient: bouquet.recipient || null,
      message: bouquet.message || null,
      created_at: bouquet.created_at,
      updated_at: bouquet.updated_at,
      flowers,
      wrapping: recipe?.wrapping || { ribbonColor: null, wrappingColor: null },
      layout: (bouquet.layout as BouquetLayout) || null,
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Bouquet detail error:', error);
    return NextResponse.json(
      { error: '꽃다발 상세 조회 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const publicUser = await getPublicUser();
    if (!publicUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      occasion,
      recipient,
      message,
      recipe,
      layout,
    } = body;

    const supabase = await createClient();

    // 본인 확인 및 업데이트
    const { data, error } = await supabase
      .from('bouquet_recipes')
      .update({
        name,
        occasion,
        recipient,
        message,
        recipe,
        layout,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', publicUser.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update bouquet recipe:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '레시피를 찾을 수 없거나 수정 권한이 없습니다.' },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { error: '레시피 수정에 실패했습니다.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating bouquet recipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const publicUser = await getPublicUser();
    if (!publicUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Request Body에서 ids 배열 확인 (일괄 삭제)
    let ids: string[] = [];
    try {
      const body = await request.json();
      if (Array.isArray(body.ids) && body.ids.length > 0) {
        ids = body.ids.filter((id: unknown): id is string => typeof id === 'string');
      }
    } catch {
      // Body가 없거나 파싱 실패 시 단일 삭제로 처리
    }

    // 일괄 삭제 (ids 배열이 있는 경우)
    if (ids.length > 0) {
      const { data, error } = await supabase
        .from('bouquet_recipes')
        .delete()
        .in('id', ids)
        .eq('user_id', publicUser.id)
        .select('id');

      if (error) {
        console.error('Failed to bulk delete bouquet recipes:', error);
        return NextResponse.json(
          { error: '레시피 일괄 삭제에 실패했습니다.' },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        deletedCount: data?.length || 0,
      });
    }

    // 단일 삭제 (기존 방식)
    const { error } = await supabase
      .from('bouquet_recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', publicUser.id);

    if (error) {
      console.error('Failed to delete bouquet recipe:', error);
      return NextResponse.json(
        { error: '레시피 삭제에 실패했습니다.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bouquet recipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
