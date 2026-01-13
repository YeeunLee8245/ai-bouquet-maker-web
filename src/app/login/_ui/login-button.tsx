import { TLoginProvider } from '../_datas';
import { cn } from '@/shared/utils/styles';

type TProps = {
  provider: TLoginProvider;
  /**
   * 로그인 완료 후 리다이렉트할 경로
   * e.g. '/flower-directory'
   */
  nextPath?: string;
  className?: string;
};

export function LoginButton({ provider, nextPath, className }: TProps) {
  const { id, iconComponent, name } = provider;

  return (
    <a
      href={`/api/auth/login?provider=${id}&next=${encodeURIComponent(nextPath ?? '/main')}`}
      className={
        cn(
          'relative w-full h-[48px] px-2 rounded-4 transition',
          className,
        )}>
      <span className='absolute top-1/2 -translate-y-1/2'>
        {iconComponent}
      </span>
      <p className='pb-micro text-body-md w-full h-full text-center content-center'>{name} 로그인</p>
    </a>
  );
}

export default LoginButton;
