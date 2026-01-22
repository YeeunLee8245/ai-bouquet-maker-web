// TODO: yeeun jotai로 구현
// import { RedirectType, useRouter } from 'next/navigation';
// import { createSAFStore } from '@/store/utilsStore';

// export const getInitModalStoreInfo = () => ({
//   component: undefined,
//   path: '',
//   type: undefined,
//   fallback: undefined,
// });

// const useModalInfoStore = createSAFStore<IModelStore>((set) => ({
//   values: getInitModalStoreInfo(),
//   setValues: (values: IModelInfos) => set({ values }),
// }));

// export const useOnModal = (type: RedirectType = RedirectType.replace) => {
//   const router = useRouter();
//   const setValues = useModalInfoStore((state) => state.setValues);
//   return (infos: IModelInfos) => {
//     setValues({
//       ...infos,
//       type,
//     });
//     if (infos.path) {
//       if (type === RedirectType.push) {
//         router.push(infos.path);
//         return;
//       }
//       router.replace(infos.path);
//     }
//   };
// };

// export const useModalInfos = () => useModalInfoStore((state) => state.values);
