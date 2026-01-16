import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/shared/supabase/update-session';

export async function proxy(request: NextRequest) {
  // 배포 환경(production)에서 특정 경로 접근 제한
  if (process.env.NODE_ENV === 'production') {
    const { pathname } = request.nextUrl;

    // 차단할 경로 접두사 목록 (/api-docs, /dev)
    const restrictedPaths = ['/api-docs', '/dev'];

    // 해당 경로로 시작하는 요청은 404 처리
    if (restrictedPaths.some(path => pathname.startsWith(path))) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  // Supabase 세션 관리 및 보호된 라우트 처리
  if (request.nextUrl.pathname.startsWith('/users')) {
    return await updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
