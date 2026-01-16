import { createClient } from '@shared/supabase/server';

const SignInActions = () => {
  const next = encodeURIComponent('/dev/auth');
  const googleLoginLink = `/api/auth/login?provider=google&next=${next}`;
  const kakaoLoginLink = `/api/auth/login?provider=kakao&next=${next}`;

  return (
    <div className='flex flex-col gap-3 w-full'>
      <a
        href={googleLoginLink}
        className='flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-400'
      >
        <svg className='h-5 w-5' viewBox='0 0 24 24'>
          <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
          <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
          <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
          <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
        </svg>
        구글로 로그인
      </a>
      <a
        href={kakaoLoginLink}
        className='flex items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4 py-3 text-sm font-medium text-[#191919] transition hover:bg-[#F5DC00]'
      >
        <svg className='h-5 w-5' viewBox='0 0 24 24'>
          <path fill='#191919' d='M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.8 5.18 4.5 6.54-.2.72-.72 2.62-.82 3.02-.12.48.18.47.38.34.16-.1 2.5-1.7 3.52-2.4.78.12 1.58.18 2.42.18 5.52 0 10-3.48 10-7.78S17.52 3 12 3z'/>
        </svg>
        카카오로 로그인
      </a>
    </div>
  );
};

const SignOutActions = () => (
  <a
    href='/api/auth/logout?next=/'
    className='rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-700 transition hover:bg-rose-100'
  >
    로그아웃
  </a>
);

const Greeting = ({ email, name }: { email: string | null; name: string | null }) => (
  <div className='rounded-xl border border-zinc-200 bg-white p-6 text-center'>
    <p className='text-sm text-zinc-500'>현재 로그인된 계정</p>
    <p className='mt-2 text-lg font-semibold text-zinc-900'>
      {name ?? email ?? '알 수 없음'}
    </p>
    {email && (
      <p className='text-sm text-zinc-500' aria-label='email'>
        {email}
      </p>
    )}
  </div>
);

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isSignedIn = Boolean(user);

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12 font-sans'>
      <main className='flex w-full max-w-md flex-col gap-6 rounded-3xl bg-white p-8 shadow-lg'>
        <div className='flex flex-col gap-1 text-center'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400'>
            AI Bouquet Maker
          </p>
          <h1 className='text-2xl font-bold text-zinc-900'>
            {isSignedIn ? '환영합니다!' : '시작하려면 로그인하세요'}
          </h1>
          <p className='text-sm text-zinc-500'>
            구글 계정 하나로 로그인/회원가입을 빠르게 끝낼 수 있어요.
          </p>
        </div>

        {isSignedIn && user ? (
          <>
            <Greeting email={user.email ?? null} name={user.user_metadata.full_name ?? null} />
            <SignOutActions />
          </>
        ) : (
          <SignInActions />
        )}
      </main>
    </div>
  );
}
