import type { Property } from 'csstype';
import type { TAnchorPosition } from '@/shared/utils/anchor-position';

export type { TAnchorPosition };

export type TModalId = string;

export type TModalPosition = 'bottom' | 'center' | 'right';

export type TModalDescriptor = {
  id: TModalId;
  priority?: number;
  position?: TModalPosition | 'anchor';
  backgroundColor?: Property.BackgroundColor;
  // 배경 클릭 시, 모달 닫기 여부
  canCloseOnBackgroundClick?: boolean;
  component: React.ReactElement;
  // anchor 포지션 전용
  anchor?: {
    el: HTMLElement | null;
    position?: TAnchorPosition;
    gap?: number;
  };
};

export type TModalProps = {
  modalId?: TModalId;
};
