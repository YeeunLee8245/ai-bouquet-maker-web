import { createClient } from '@shared/supabase/server';

const SignInActions = () => {
  const next = encodeURIComponent('/dev/auth');
  const loginLink = `/api/auth/login?next=${next}`;

  return (
    <div className="flex flex-col gap-3 w-full">
      <a
        href={loginLink}
        className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-center text-sm font-medium text-zinc-900 transition hover:border-zinc-400"
      >
        구글로 로그인
      </a>
      <a
        href={loginLink}
        className="rounded-lg border border-dashed border-zinc-300 px-4 py-3 text-center text-sm text-zinc-600 transition hover:border-zinc-500 hover:text-zinc-900"
      >
        구글로 회원가입
      </a>
    </div>
  );
};

const SignOutActions = () => (
  <a
    href="/api/auth/logout?next=/"
    className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
  >
    로그아웃
  </a>
);

const Greeting = ({ email, name }: { email: string | null; name: string | null }) => (
  <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
    <p className="text-sm text-zinc-500">현재 로그인된 계정</p>
    <p className="mt-2 text-lg font-semibold text-zinc-900">
      {name ?? email ?? '알 수 없음'}
    </p>
    {email && (
      <p className="text-sm text-zinc-500" aria-label="email">
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12 font-sans">
      <main className="flex w-full max-w-md flex-col gap-6 rounded-3xl bg-white p-8 shadow-lg">
        <div className="flex flex-col gap-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            AI Bouquet Maker
          </p>
          <h1 className="text-2xl font-bold text-zinc-900">
            {isSignedIn ? '환영합니다!' : '시작하려면 로그인하세요'}
          </h1>
          <p className="text-sm text-zinc-500">
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
