import type { Property } from 'csstype';

export type TModalId = string;

export type TModalPosition = 'bottom' | 'center' | 'right';

export type TAnchorSide = 'top' | 'bottom' | 'left' | 'right';

export type TModalDescriptor = {
  id: TModalId;
  priority?: number;
  position?: TModalPosition | 'anchor';
  // backgroundColor?: string;
  backgroundColor?: Property.BackgroundColor;
  // 배경 클릭 시, 모달 닫기 여부
  canCloseOnBackgroundClick?: boolean;
  component: React.ReactElement;
  // anchor 포지션 전용
  anchorEl?: HTMLElement | null;
  anchorSide?: TAnchorSide;
};

export type TModalProps = {
  modalId?: TModalId;
};
