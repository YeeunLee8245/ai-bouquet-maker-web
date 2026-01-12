import GoogleIcon from '@shared/assets/icons/google.svg';
import KakaoIcon from '@shared/assets/icons/kakao.svg';

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
        <button className="relative w-full h-[48px] px-2 border border-gray-100 rounded-4 transition hover:border-primary-400 hover:shadow-sm">
          <GoogleIcon className="absolute left-[11.33px] top-1/2 -translate-y-1/2" />
          <p className='pb-micro text-body-md'>Google 로그인</p>
        </button>
        <button className="relative w-full h-[48px] px-2 bg-[#FFE400] rounded-4 transition hover:brightness-95 hover:shadow-inner">
          <KakaoIcon className="absolute left-[12.3px] top-1/2 -translate-y-1/2" />
          <p className='pb-micro text-body-md'>카카오 로그인</p>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
