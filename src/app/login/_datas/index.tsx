import GoogleIcon from '@shared/assets/icons/google.svg';
import KakaoIcon from '@shared/assets/icons/kakao.svg';

export type TLoginPlatform = 'google' | 'kakao';

export type TLoginProvider = {
  id: TLoginPlatform;
  name: string;
  iconComponent: React.ReactElement;
  link: string;
};

export const LOGIN_PROVIDER_LIST: TLoginProvider[] = [
  {
    id: 'google',
    name: '구글',
    iconComponent: <GoogleIcon />,
    link: '/api/auth/login?provider=google',
  },
  {
    id: 'kakao',
    name: '카카오',
    iconComponent: <KakaoIcon />,
    link: '/api/auth/login?provider=kakao',
  },
];
