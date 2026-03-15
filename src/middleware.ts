import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

async function getUser(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
    {
      cookies: {
        getAll() {
          // 세션 토큰을 쿠키에서 읽어옴
          return request.cookies.getAll();
        },
        setAll() {}, // 세션 갱신할 필요 없기 때문에 빈 함수
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 배포 환경(production)에서 특정 경로 접근 제한
  if (process.env.NODE_ENV === 'production') {
    const restrictedPaths = ['/api-docs', '/dev'];
    if (restrictedPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/not-found', request.url));
    }
  }

  // / → /main redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/main', request.url));
  }

  // /make-bouquet 직접 접근 차단 (쿠키 플래그 없으면 /main redirect)
  if (pathname.startsWith('/make-bouquet')) {
    const allowed = request.cookies.get('make-bouquet-allowed');
    if (!allowed) {
      return NextResponse.redirect(new URL('/main', request.url));
    }
    const response = NextResponse.next();
    response.cookies.delete('make-bouquet-allowed');
    return response;
  }

  // 보호된 라우트: 미로그인 시 /login redirect
  const protectedPaths = ['/my-bouquet', '/my-profile'];
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // /login: 로그인 상태이면 /main redirect
  if (pathname === '/login') {
    const user = await getUser(request);
    if (user) {
      return NextResponse.redirect(new URL('/main', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'experimental-edge', // Cloudflare Workers (Edge Runtime) 지원
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
