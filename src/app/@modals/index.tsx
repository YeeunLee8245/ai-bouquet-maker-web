// TODO: yeeun jotai로 구현
// 'use client';

// import { redirect, RedirectType, useRouter } from 'next/navigation';
// import { getInitModalStoreInfo, useModalInfos, useOnModal } from './modalStore';
// import { IHiddenModalsPageProps, IModalsPageProps } from './$types';

// const initDatas = getInitModalStoreInfo();

// /**
//  * intercepting Modal
//  */
// export const withInterceptingModals =
//   <P extends object>(Component: React.ComponentType<P>, fallbackPath: string) => {
//     const InterceptingModal = (props: P) => {
//       if (Component === undefined) {
//         console.log('redirect', fallbackPath);
//         return redirect(fallbackPath, RedirectType.replace);
//       }
//       return <Component {...props} fallbackPath={fallbackPath} />;
//     };
//     InterceptingModal.displayName = `withInterceptingModals(${Component?.displayName || Component?.name || 'Component'})`;
//     return InterceptingModal;
//   };

// /**
//  * 일반적인 Modal
//  */
// export function DefaultModalsPage() {
//   const { component, path } = useModalInfos();
//   const setValues = useOnModal();

//   if (!component || path) {return null;}

//   const handleClose = () => {
//     setValues(initDatas);
//   };

//   const handleConfirm = (/* type?: TConfirmType */) => {
//     setValues(initDatas);
//   };

//   const Component = component;
//   return (
//     <section id='modal'>
//       <Component onClose={handleClose} onConfirm={handleConfirm} />
//     </section>
//   );
// }

// /**
//  * route 하는 Modal
//  */
// export default function ModalsPage(props: IModalsPageProps) {
//   const { fallbackPath } = props as unknown as IHiddenModalsPageProps;
//   const router = useRouter();
//   const { component, type, fallback } = useModalInfos();
//   const setValues = useOnModal();
//   const moveFallback = fallback || fallbackPath;

//   if (!component) {return null;}

//   const handleClose = () => {
//     setValues(initDatas);
//     if (type && type === RedirectType.push) {
//       router.back();
//     } else if (moveFallback) {
//       router.replace(moveFallback);
//     }
//   };

//   const handleConfirm = (/* type?: TConfirmType */) => {
//     setValues(initDatas);
//   };

//   const Component = component;
//   return (
//     <section id='modal'>
//       <Component onClose={handleClose} onConfirm={handleConfirm} />
//     </section>
//   );
// }

/**
 * 사용(e.g. /login/[path]/@modals/(.)[path]/page.tsx, default.tsx 파일에서 null 리턴 잊지말기)
 * export default withInterceptingModals(ModalsPage, '/login');
 *
 *  const modal = useOnModal();
 *
 *
 * 해당 페이지에서 모달 데이터 지정 시, 사용
  const events: IEventHub = {
    onVisibilityLoginAuthCodeModal: (datas: IEventDatas) => {
      if (datas.valid && datas.email) {
        modal({
          component: Modal(datas),
          path: `/login/auth`,
        });
      }
    },
  };
 */
