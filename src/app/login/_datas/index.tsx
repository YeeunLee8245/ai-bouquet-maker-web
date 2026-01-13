import GoogleIcon from '@shared/assets/icons/google.svg';
import KakaoIcon from '@shared/assets/icons/kakao.svg';

export type TLoginPlatform = 'google' | 'kakao';

export type TLoginProvider = {
  id: TLoginPlatform;
  name: string;
  iconComponent: React.ReactElement;
};

export const LOGIN_PROVIDER_LIST: TLoginProvider[] = [
  {
    id: 'google',
    name: '구글',
    iconComponent: <GoogleIcon />,
  },
  {
    id: 'kakao',
    name: '카카오',
    iconComponent: <KakaoIcon />,
  },
];
