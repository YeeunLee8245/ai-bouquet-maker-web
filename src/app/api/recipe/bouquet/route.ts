import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { getPublicUser } from '@/lib/users/auth';

/**
 * @swagger
 * /api/recipe/bouquet:
 *   post:
 *     tags:
 *       - Recipe
 *     summary: 꽃다발 레시피 생성
 *     description: |
 *       사용자가 직접 구성한 꽃다발 레시피를 저장합니다.
 *       AI 추천 결과(recommendation_id)를 기반으로 생성하거나, 처음부터 직접 만들 수 있습니다.
 *
 *       ### 🎨 프론트엔드 개발 가이드
 *       - **`color` (Hex)**: 사용자가 미리보기나 색상피커를 통해 자유롭게 선택한 '미리보기용 꽃 색상'입니다. 실제 꽃다발 렌더링에 사용됩니다.
 *       - **`icon_color` (Hex)**: DB에 정의된 꽃말별 '상징 색상'입니다. 꽃 구성 목록이나 선택 버튼의 아이콘 색상으로 사용됩니다.
 *       - **색상 커스텀 시**: 유저가 색상을 커스텀하게 바꿀 때는 `flower_meaning_id`를 해당 꽃의 대표 ID(`is_primary: true`)로 유지하는 것을 권장합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - recipe
 *             properties:
 *               name:
 *                 type: string
 *                 description: 꽃다발의 이름 (유저가 입력)
 *                 example: "어머니를 위한 카네이션 꽃다발"
 *               occasion:
 *                 type: string
 *                 description: 선물하는 상황/목적
 *                 example: "어버이날"
 *               recipient:
 *                 type: string
 *                 description: 꽃다발을 받는 사람
 *                 example: "어머니"
 *               message:
 *                 type: string
 *                 description: 함께 전달할 카드 메시지
 *                 example: "항상 사랑하고 감사합니다."
 *               recommendation_id:
 *                 type: string
 *                 format: uuid
 *                 description: 기반이 된 AI 추천 기록 ID (없을 경우 null)
 *                 example: "18561ccb-20c4-4bdb-8905-ec2647f471c5"
 *               recipe:
 *                 type: object
 *                 description: 꽃다발의 기술적 구성 정보 (꽃 종류, 수량, 포장재 등)
 *                 required: [flowers]
 *                 properties:
 *                   flowers:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required: [flower_id, flower_meaning_id, quantity, color]
 *                       properties:
 *                         flower_id:
 *                           type: integer
 *                           description: 꽃 기본 정보 ID (flowers 테이블)
 *                           example: 1
 *                         flower_meaning_id:
 *                           type: integer
 *                           description: 선택한 구체적인 꽃말/색상 ID (flower_meanings 테이블)
 *                           example: 101
 *                         quantity:
 *                           type: integer
 *                           description: 해당 꽃의 포함 수량
 *                           example: 3
 *                         color:
 *                           type: string
 *                           description: 선택한 실제 렌더링 색상 (Hex Code)
 *                           example: "#FF8D3E"
 *                   wrapping:
 *                     type: object
 *                     description: 포장지 및 리본 구성 (선택 사항)
 *                     properties:
 *                       ribbonColor:
 *                         type: string
 *                         description: 리본 색상 (Hex Code)
 *                         example: "#FF0000"
 *                       wrappingColor:
 *                         type: string
 *                         description: 포장지 색상 (Hex Code)
 *                         example: "#FFFFFF"
 *               layout:
 *                 type: object
 *                 description: 캔버스 미리보기 배치를 위한 좌표 정보
 *                 properties:
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       description: 개별 꽃 오브젝트의 위치 및 상태
 *                       properties:
 *                         flower_id: { type: integer, description: "꽃 ID" }
 *                         flower_meaning_id: { type: integer, description: "꽃말 ID" }
 *                         x: { type: number, description: "X 좌표 (px 또는 비율)", example: 150.5 }
 *                         y: { type: number, description: "Y 좌표 (px 또는 비율)", example: 200.0 }
 *                         rotation: { type: number, description: "회전 각도 (degree)", example: 45 }
 *                         z_index: { type: integer, description: "레이어 순서", example: 1 }
 *           examples:
 *             general:
 *               summary: 직접 커스텀하여 만들기
 *               description: 유저가 캔버스에서 직접 꽃들을 배치하고 이름을 지어 저장하는 일반적인 상황
 *               value:
 *                 name: "친구 생일 축하 노란 장미 꽃다발"
 *                 occasion: "생일"
 *                 recipient: "친구"
 *                 message: "생일 축하해! 이 꽃처럼 밝은 한 해 되길."
 *                 recipe:
 *                   flowers:
 *                     - flower_id: 112
 *                       flower_meaning_id: 301
 *                       quantity: 2
 *                       color: "#FFD700"
 *                   wrapping:
 *                     ribbonColor: "#FFD700"
 *                     wrappingColor: "#F5F5DC"
 *                 layout:
 *                   items:
 *                     - flower_id: 112
 *                       flower_meaning_id: 301
 *                       x: 150
 *                       y: 200
 *                       rotation: 0
 *                       z_index: 2
 *                     - flower_id: 112
 *                       flower_meaning_id: 301
 *                       x: 180
 *                       y: 220
 *                       rotation: 15
 *                       z_index: 1
 *             from_recommendation:
 *               summary: AI 추천 결과 바로 저장
 *               description: AI가 추천해준 조합을 그대로 또는 약간 수정하여 저장하는 상황
 *               value:
 *                 name: "AI가 추천해준 '열정적인 사랑' 꽃다발"
 *                 recommendation_id: "18561ccb-20c4-4bdb-8905-ec2647f471c5"
 *                 occasion: "프로포즈"
 *                 recipient: "연인"
 *                 recipe:
 *                   flowers:
 *                     - flower_id: 45
 *                       flower_meaning_id: 204
 *                       quantity: 9
 *                       color: "#E31C25"
 *                 layout:
 *                   items: []
 *     responses:
 *       201:
 *         description: 꽃다발 레시피 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       description: 생성된 레시피의 UUID
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *       401:
 *         description: 인증 실패 (로그인 필요)
 *       500:
 *         description: 서버 내부 오류 (DB 저장 실패 등)
 */
export async function POST(request: NextRequest) {
  try {
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
      recommendation_id,
    } = body;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('bouquet_recipes')
      .insert({
        user_id: publicUser.id,
        name,
        occasion,
        recipient,
        message,
        recipe,
        layout,
        recommendation_id,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to create bouquet recipe:', error);
      return NextResponse.json(
        { error: '레시피 생성에 실패했습니다.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating bouquet recipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
