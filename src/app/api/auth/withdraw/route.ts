import { NextResponse } from 'next/server';
import { createClient } from '@shared/supabase/server';

/**
 * @swagger
 * /api/auth/withdraw:
 *   post:
 *     tags:
 *       - Auth
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
export async function POST() {
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

    // 4. auth.users에서 사용자 삭제 준비 (Admin 클라이언트 생성)
    const { createAdminClient } = await import('@shared/supabase/admin');
    const supabaseAdmin = createAdminClient();

    // 3. public.users 데이터 익명화 (Soft Delete)
    // 일반 유저 클라이언트는 RLS 정책에 의해 자신의 정보를 특정 방식으로 수정하지 못할 수 있으므로
    // 관리자(Admin) 클라이언트를 사용하여 확실하게 처리합니다.
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        email: `deleted+${internalId}@example.invalid`,
        nickname: '탈퇴회원',
        name: null,
        phone: null,
        avatar_url: null,
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_reason: '직접탈퇴',
        auth_id: null,
      })
      .eq('id', internalId);

    if (updateError) {
      console.error('[Withdraw] Anonymization error:', updateError);
      throw updateError;
    }

    // 4. auth.users에서 사용자 삭제 (Admin 클라이언트 사용)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('[Withdraw] Auth user delete error:', deleteError);
      throw deleteError;
    }

    // 5. 현재 세션 로그아웃 처리
    await supabase.auth.signOut();

    return NextResponse.json({ message: '탈퇴가 완료되었습니다.' }, { status: 200 });

  } catch (error) {
    console.error('[Withdraw] Global error:', error);
    const message = error instanceof Error ? error.message : '탈퇴 처리 중 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
