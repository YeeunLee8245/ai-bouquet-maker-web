export type TModalId = string;

export type TModalPosition = 'bottom' | 'center';

export type TModalDescriptor = {
  id: TModalId;
  priority?: number;
  position?: TModalPosition;
  component: React.ReactElement;
};

export type TModalProps = {
  modalId?: TModalId;
};
