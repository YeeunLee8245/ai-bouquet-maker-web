export type TModalId = string;

export type TModalPosition = 'bottom' | 'center' | 'right';

export type TModalDescriptor = {
  id: TModalId;
  priority?: number;
  position?: TModalPosition;
  // 배경 클릭 시, 모달 닫기 여부
  canCloseOnBackgroundClick?: boolean;
  component: React.ReactElement;
};

export type TModalProps = {
  modalId?: TModalId;
};
