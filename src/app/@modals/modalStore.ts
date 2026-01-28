// TODO: yeeun jotai로 구현
import { RedirectType, useRouter } from 'next/navigation';
import { IModalInfos } from './$types';
import { atom, useSetAtom } from 'jotai';

export const initModalStoreInfo: IModalInfos = {
  component: undefined,
  path: '',
  type: undefined,
  fallback: undefined,
};

export const modalInfoAtom = atom<IModalInfos>(initModalStoreInfo);

export const useOnModal = (type: RedirectType = RedirectType.replace) => {
  const router = useRouter();
  const setValues = useSetAtom(modalInfoAtom);
  return (infos: IModalInfos) => {
    setValues({
      ...infos,
      type,
    });
    if (infos.path) {
      if (type === RedirectType.push) {
        router.push(infos.path);
        return;
      }
      router.replace(infos.path);
    }
  };
};
