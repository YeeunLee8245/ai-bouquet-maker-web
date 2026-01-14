export const USER_MACHINE_STATES = {
  INITIAL: 'initial',
  LOADING: 'loading',
  ERROR: 'error',
  /** 미로그인 */
  NOT_LOGGED_IN: 'notLoggedIn',
  /** 로그인 */
  LOGGED_IN: 'loggedIn',
} as const;

export const USER_MACHINE_EVENTS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  SET_USER: 'setUser',
  MODIFY_USER: 'modifyUser',
} as const;

type TBouquet = {
  id: string;
  name: string;
  flowers: {
    id: string;
    name: string;
    count: number;
  }[];
};

export type TUserMachineContext = {
  email: string;
  name: string;
  /** 소개말 */
  introduction: string;
  /** 가입일 */
  createdAt: string;
  /** 좋아하는 꽃 */
  favoriteFlowerNames: string[];
  /** 꽃다발 히스토리 정보 */
  bouquetHistory: {
    totalCount: number;
    recentBouquet: TBouquet;
  };
};
