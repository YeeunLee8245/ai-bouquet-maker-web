import { JSX } from 'react';

type RedirectType = import('next/navigation').RedirectType;
type TConfirmType = import('./define').TConfirmType;

export interface IModalEvents {
  onClose: () => void;
  onConfirm?: (type?: TConfirmType) => void;
}

export interface IModalInfos {
  component?: (events: IModalEvents) => JSX.Element;
  path?: string;
  type?: RedirectType;
  fallback?: string;
}

export interface IModalModelStore {
  values: IModalInfos;
  setValues: (values: IModalInfos) => void;
}

export interface IHiddenModalsPageProps {
  fallbackPath: string;
}

export interface IModalsPageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string };
}
