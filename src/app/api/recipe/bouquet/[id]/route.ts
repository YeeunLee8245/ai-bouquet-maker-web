import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { BouquetRecipeContent, BouquetLayout } from '@/types/recommendation';

/**
 * @swagger
 * /api/recipe/bouquet/{id}:
 *   get:
 *     tags:
 *       - Recipe
 *     summary: 꽃다발 레시피 상세 조회
 *     description: |
 *       특정 꽃다발 레시피의 상세 정보를 조회합니다.
 *       꽃다발의 구성(꽃종류, 수량, 색상), 포장 옵션, 그리고 미리보기를 위한 레이아웃 좌표 정보를 포함합니다.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 꽃다발 레시피 ID (UUID)
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - data
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BouquetRecipeDetail'
 *             examples:
 *               standard:
 *                 summary: 일반적인 꽃다발
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "550e8400-e29b-41d4-a716-446655440000"
 *                     name: "생일 축하 꽃다발"
 *                     occasion: "생일"
 *                     recipient: "어머니"
 *                     message: "항상 건강하세요!"
 *                     flowers:
 *                       - flower_id: 1
 *                         flower_name: "장미"
 *                         image_url: "https://example.com/rose.png"
 *                         quantity: 3
 *                         color: "빨강"
 *                         flower_meaning_id: 10
 *                     wrapping:
 *                       ribbonColor: "#FF0000"
 *                       wrappingColor: "#FFFFFF"
 *                     layout:
 *                       items:
 *                         - flower_id: 1
 *                           x: 100
 *                           y: 150
 *                     created_at: "2025-12-06T09:24:00Z"
 *                     updated_at: "2025-12-06T09:24:00Z"
 *               no_flowers:
 *                 summary: 꽃 구성이 없는 경우 (초기 상태 등)
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "550e8400-e29b-41d4-a716-446655440001"
 *                     name: "빈 꽃다발"
 *                     occasion: null
 *                     recipient: null
 *                     message: null
 *                     flowers: []
 *                     wrapping:
 *                       ribbonColor: null
 *                       wrappingColor: null
 *                     layout: null
 *                     created_at: "2025-12-06T10:00:00Z"
 *                     updated_at: "2025-12-06T10:00:00Z"
 *       404:
 *         description: 레시피를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "해당 꽃다발 레시피를 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "꽃다발 상세 조회 중 오류가 발생했습니다."
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
          { status: 404 }
        );
      }
      console.error('Bouquet detail query error:', error);
      return NextResponse.json(
        { error: '꽃다발 상세 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 2. 꽃 정보 추출 및 조회
    const recipe = bouquet.recipe as BouquetRecipeContent | null;
    const flowerIds = Array.from(new Set((recipe?.flowers || []).map(f => f.flower_id)));

    let flowerMap: Record<number, { name_ko: string; image_url: string | null }> = {};
    if (flowerIds.length > 0) {
      const { data: flowers } = await supabase
        .from('flowers')
        .select('id, name_ko, image_url')
        .in('id', flowerIds);

      if (flowers) {
        flowerMap = Object.fromEntries(
          flowers.map(f => [f.id, { name_ko: f.name_ko, image_url: f.image_url }])
        );
      }
    }

    // 3. 데이터 포맷팅
    const flowers = (recipe?.flowers || []).map(f => ({
      flower_id: f.flower_id,
      flower_name: flowerMap[f.flower_id]?.name_ko || '알 수 없음',
      image_url: flowerMap[f.flower_id]?.image_url || null,
      quantity: f.quantity,
      color: f.color || null,
      flower_meaning_id: f.flower_meaning_id || null,
    }));

    const responseData = {
      id: bouquet.id,
      name: bouquet.name || '이름 없음',
      occasion: bouquet.occasion || null,
      recipient: bouquet.recipient || null,
      message: bouquet.message || null,
      flowers,
      wrapping: recipe?.wrapping || { ribbonColor: null, wrappingColor: null },
      layout: (bouquet.layout as BouquetLayout) || null,
      created_at: bouquet.created_at,
      updated_at: bouquet.updated_at,
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Bouquet detail error:', error);
    return NextResponse.json(
      { error: '꽃다발 상세 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
