import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';
import { toSupabaseResizedImageUrl } from '@shared/utils/image-url';

/**
 * @swagger
 * /api/recommend/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: 추천 기록 UUID
 *       schema:
 *         type: string
 *         format: uuid
 *   get:
 *     tags:
 *       - Recommend
 *     summary: 추천 상세 조회
 *     description: |
 *       특정 추천 기록의 상세 정보를 조회합니다.
 *       단순 DB 기록뿐만 아니라, 사용자가 선택한 꽃 정보를 실제 꽃 데이터와 JOIN하여 상세하게 반환합니다.
 *
 *       ### 🎨 프론트엔드 개발 가이드
 *       - **`selected_flowers`**: 유저가 추천 결과에서 선택(체크)한 꽃들의 상세 정보입니다. 꽃다발 에디터 진입 시 이 데이터를 초기 꽃바구니 상태로 사용하세요.
 *       - **`analysis_result`**: AI 추천 결과의 원본 데이터(JSON)입니다. 제목, 메시지 외에도 AI가 분석한 원본 태그 정보 등이 포함될 수 있습니다.
 *       - **`status`**: `success` 상태인 기록만 정상적으로 조회하는 것이 권장됩니다.
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
 *                   required: [id, recommendation_type, status]
 *                   properties:
 *                     id: { type: string, format: uuid }
 *                     recommendation_type: { type: string, enum: ["emotion", "recipient", "preset"], example: "emotion" }
 *                     status: { type: string, enum: ["pending", "success", "failed"], example: "success" }
 *                     input_text: { type: string, description: "사용자 입력 원문", example: "친구 생일 선물" }
 *                     relationship: { type: string, nullable: true, example: "친구" }
 *                     occasion: { type: string, nullable: true, example: "생일" }
 *                     analysis_result:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         title: { type: string, example: "우정을 위한 노란 꽃다발" }
 *                         message: { type: string, example: "항상 곁에 있어준 친구에게 고마움을 전하세요." }
 *                     selected_flower_meanings_ids:
 *                       type: array
 *                       items: { type: integer }
 *                       example: [10, 45]
 *                     selected_flowers:
 *                       type: array
 *                       description: "추천 정보와 JOIN된 꽃 상세 정보 목록 (에디터 바로 사용 가능)"
 *                       items:
 *                         type: object
 *                         properties:
 *                           flower_meaning_id: { type: integer, example: 10 }
 *                           meaning: { type: string, example: "변치 않는 우정" }
 *                           color: { type: string, example: "#FFFF00" }
 *                           icon_color: { type: string, example: "#FFD700" }
 *                           flower_id: { type: integer, example: 5 }
 *                           name: { type: string, example: "프리지아" }
 *                           image_url: { type: string, nullable: true, example: "https://.../freesia.png" }
 *             examples:
 *               success_response:
 *                 summary: "추천 상세 조회 성공 (꽃 데이터 포함)"
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "18561ccb-20c4-4bdb-8905-ec2647f471c5"
 *                     recommendation_type: "emotion"
 *                     status: "success"
 *                     input_text: "친구가 우울해해서 위로해주고 싶어요"
 *                     relationship: "친구"
 *                     occasion: "위로"
 *                     analysis_result:
 *                       title: "따뜻한 위로의 노란 꽃다발"
 *                       message: "친구분의 마음이 빨리 회복되길 바라는 마음을 담았습니다."
 *                     selected_flower_meanings_ids: [10, 45]
 *                     selected_flowers:
 *                       - flower_meaning_id: 10
 *                         meaning: "변치 않는 우정"
 *                         color: "#FFFF00"
 *                         icon_color: "#FFD700"
 *                         flower_id: 5
 *                         name: "프리지아"
 *                         image_url: "https://example.com/flowers/freesia.png"
 *                       - flower_meaning_id: 45
 *                         meaning: "영원한 사랑"
 *                         color: "#FFC0CB"
 *                         icon_color: "#FF69B4"
 *                         flower_id: 22
 *                         name: "리시안셔스"
 *                         image_url: "https://example.com/flowers/lisianthus.png"
 *       401:
 *         description: 로그인 필요 (본인 기록만 조회 가능)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "로그인이 필요한 서비스입니다." }
 *       404:
 *         description: 추천 기록을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "해당 추천 기록을 찾을 수 없습니다." }
 *       500:
 *         description: 서버 오류
 */
export async function GET(
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

    // 1. 추천 기록 조회
    const { data: recommendation, error: recError } = await supabase
      .from('recommendations')
      .select('*')
      .eq('id', id)
      .eq('user_id', publicUser.id)
      .single();

    if (recError || !recommendation) {
      if (recError?.code === 'PGRST116') {
        return NextResponse.json(
          { error: '추천 기록을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { error: '추천 기록 조회 중 오류가 발생했습니다.' },
        { status: 500 },
      );
    }

    // 2. 선택된 꽃(flower_meanings) 정보 조회
    const selectedIds = recommendation.selected_flower_meanings_ids || [];
    interface SelectedFlower {
      flower_meaning_id: number;
      meaning: string;
      color: string | null;
      icon_color: string | null;
      flower_id: number;
      name: string;
      image_url: string | null;
    }
    let selected_flowers: SelectedFlower[] = [];

    if (selectedIds.length > 0) {
      const { data: meanings, error: meaningError } = await supabase
        .from('flower_meanings')
        .select(`
          id,
          meaning,
          color,
          icon_color,
          flower_id,
          flowers (
            id,
            name_ko,
            images
          )
        `)
        .in('id', selectedIds);

      if (meaningError) {
        console.error('Error fetching flower meanings:', meaningError);
      } else if (meanings) {
        selected_flowers = (meanings as unknown as {
          id: number;
          meaning: string;
          color: string | null;
          icon_color: string | null;
          flower_id: number;
          flowers: { name_ko: string; images: string[] | null } | { name_ko: string; images: string[] | null }[] | null;
        }[]).map((m) => {
          const flower = Array.isArray(m.flowers) ? m.flowers[0] : m.flowers;
          return {
            flower_meaning_id: m.id,
            meaning: m.meaning,
            color: m.color,
            icon_color: m.icon_color,
            flower_id: m.flower_id,
            name: flower?.name_ko || '알 수 없음',
            image_url: toSupabaseResizedImageUrl(flower?.images?.[0]),
          };
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...recommendation,
        selected_flowers,
      },
    });
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
