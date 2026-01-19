import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

/**
 * @swagger
 * /api/users/withdraw:
 *   post:
 *     tags:
 *       - Users
 *     summary: 회원 탈퇴
 *     description: |
 *       현재 로그인된 사용자의 정보를 익명화하고 계정을 완전히 삭제합니다.
 *       1. public.users 테이블의 개인정보를 익명화 처리합니다. (Soft Delete)
 *       2. auth.users 테이블에서 사용자를 삭제합니다. (Hard Delete)
 *     responses:
 *       200:
 *         description: 탈퇴 및 로그아웃 성공
 *       401:
 *         description: 인증되지 않은 사용자 (세션 없음)
 *       404:
 *         description: 사용자 정보를 찾을 수 없음
 *       500:
 *         description: 서버 처리 중 오류 발생
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. 현재 사용자 세션 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 },
      );
    }

    const userId = user.id;

    // 2. public.users 테이블 정보 조회 (익명화를 위해 id 필요)
    const { data: publicUser, error: publicUserError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', userId)
      .single();

    if (publicUserError || !publicUser) {
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const internalId = publicUser.id;

    // 3. public.users 데이터 익명화 (Soft Delete)
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email: `deleted+${internalId}@example.invalid`,
        nickname: '탈퇴회원',
        name: null,
        phone: null,
        avatar_url: null,
        is_active: false,
        deleted_at: new Date().toISOString(),
        auth_id: null, // auth.users에서 삭제될 것이므로 명시적으로 연결 해제
      })
      .eq('id', internalId);

    if (updateError) {
      throw updateError;
    }

    // 4. auth.users에서 사용자 삭제 (Admin 클라이언트 필요)
    // 서비스 역할 키(SERVICE_ROLE_KEY)를 사용하여 관리자 클라이언트 생성
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Auth user delete error:', deleteError);
      // 이미 public.users는 익명화되었으므로, auth 삭제 실패 시 로그만 남기고 진행할 수도 있으나
      // 여기서는 엄격하게 에러를 던집니다. (단, 이 시점에서 이미 public.users는 업데이트됨)
      throw deleteError;
    }

    // 5. 현재 세션 로그아웃 처리
    await supabase.auth.signOut();

    return NextResponse.json({ message: '탈퇴가 완료되었습니다.' }, { status: 200 });

  } catch (error) {
    console.error('Withdrawal error:', error);
    const message = error instanceof Error ? error.message : '탈퇴 처리 중 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
