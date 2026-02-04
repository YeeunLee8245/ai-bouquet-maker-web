import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';

/**
 * @swagger
 * /api/recommend/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: 추천 ID (UUID)
 *       schema:
 *         type: string
 *         format: uuid
 *   get:
 *     tags:
 *       - Recommend
 *     summary: 추천 상세 조회
 *     description: |
 *       특정 추천 기록의 상세 정보를 조회합니다.
 *       특히 사용자가 선택한 꽃(selected_flower_meanings_ids) 정보를 기반으로, 꽃다발 에디터에서 바로 사용할 수 있도록 **꽃의 한글 이름, 이미지 URL, 색상 정보 등을 JOIN하여 함께 반환**합니다. (selected_flowers 필드)
 *
 *       ### 🎨 프론트엔드 개발 가이드
 *       - **`selected_flowers` 활용**: 이 리스트를 에디터의 초기 꽃 구성 상태로 바인딩하면 됩니다.
 *       - **색상 아이콘**: 리스트 구성 시 `icon_color`를 사용하여 각 꽃말의 상징색을 표시하세요.
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, format: uuid }
 *                     input_text: { type: string, description: "사용자 입력 텍스트" }
 *                     recommendation_type: { type: string, enum: ["general", "emotion", "recipient", "preset"] }
 *                     analysis_result:
 *                       type: object
 *                       properties:
 *                         bouquet_name: { type: string, example: "희망의 노란 꽃다발" }
 *                         delivery_message: { type: string, example: "당신의 새로운 시작을 응원해요!" }
 *                     selected_flower_meanings_ids: { type: array, items: { type: integer } }
 *                     selected_flowers:
 *                       type: array
 *                       description: "추천 정보와 JOIN된 꽃 상세 정보 목록"
 *                       items:
 *                         type: object
 *                         properties:
 *                           flower_meaning_id: { type: integer }
 *                           meaning: { type: string, example: "희망" }
 *                           color: { type: string, example: "yellow" }
 *                           flower_id: { type: integer }
 *                           name: { type: string, example: "거베라" }
 *                           image_url: { type: string, example: "https://.../gerbera.png" }
 *             examples:
 *               full_data:
 *                 summary: 전체 데이터 응답 예시
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "18561ccb-20c4-4bdb-8905-ec2647f471c5"
 *                     input_text: "친구 개업 선물로 줄 밝은 느낌의 꽃"
 *                     recommendation_type: "general"
 *                     analysis_result:
 *                       bouquet_name: "빛나는 시작 꽃다발"
 *                       delivery_message: "사업 번창하시길 기원합니다!"
 *                     selected_flowers:
 *                       - flower_meaning_id: 10
 *                         meaning: "변치 않는 사랑"
 *                         color: "pink"
 *                         flower_id: 5
 *                         name: "리시안셔스"
 *                         image_url: "https://example.com/lisianthus.png"
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 추천 기록을 찾을 수 없습니다.
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
            image_url
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
          flowers: { name_ko: string; image_url: string | null } | { name_ko: string; image_url: string | null }[] | null;
        }[]).map((m) => {
          const flower = Array.isArray(m.flowers) ? m.flowers[0] : m.flowers;
          return {
            flower_meaning_id: m.id,
            meaning: m.meaning,
            color: m.color,
            icon_color: m.icon_color,
            flower_id: m.flower_id,
            name: flower?.name_ko || '알 수 없음',
            image_url: flower?.image_url || null,
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
