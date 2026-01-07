export type TTabItem = {
  id: string;
  label: string;
};

export type TTabsContextValue = {
  value: string;
  setValue: (v: string) => void;
  idBase: string;
};

export type TTabsProps = {
  items: TTabItem[];
  defaultId?: string;
  onValueChange?: (id: string) => void;
  children: React.ReactNode;
};

export type TTabsListProps = React.HTMLAttributes<HTMLDivElement>;

export type TTabsTriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'onClick'
> & {
  value: string;
};

export type TTabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};
