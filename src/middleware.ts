import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Refresh Token Rotation 시 새 토큰을 request와 response 모두에 저장
          // server component에서 토큰을 저장
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // middleware에서 토큰을 저장하기 위해 response에 저장
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser(); // 현재 사용자 정보 조회(token 발급 체크)

  return { user, response };
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

  // 모든 요청에서 세션 갱신 (token rotation 처리)
  const { user, response } = await updateSession(request);

  // 보호된 라우트: 미로그인 시 /login redirect
  const protectedPaths = ['/my-bouquet', '/my-profile'];
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // /login: 로그인 상태이면 /main redirect
  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/main', request.url));
  }

  return response;
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
