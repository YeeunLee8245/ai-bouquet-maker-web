import { LOGIN_PROVIDER_LIST } from './_datas';
import LoginButton from './_ui/login-button';
import { cn } from '@/shared/utils/styles';

/**
 * 로그인 페이지
 */
const LoginPage = () => {

  return (
    <div className="px-4 pt-4 pb-8 flex flex-col items-center">
      <p className="text-title-lg">로그인</p>
      <p className="text-body-md text-gray-400 mt-1 whitespace-pre-wrap text-center">
        {'꽃다발 레시피에 로그인하고\n맞춤 추천을 받아 보세요.'}
      </p>
      <div className="mt-10 w-full flex flex-col gap-2">
        {LOGIN_PROVIDER_LIST.map((provider) => {
          const { id } = provider;
          return (
            <LoginButton
              key={id}
              provider={provider}
              className={
                cn(
                  id === 'google' && 'border border-gray-100 rounded-4 transition hover:border-primary-400 hover:shadow-sm [&>span]:left-[11.33px]',
                  id === 'kakao' && 'bg-[#FFE400] rounded-4 transition hover:brightness-95 hover:shadow-inner [&>span]:left-[12.3px]',
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default LoginPage;
