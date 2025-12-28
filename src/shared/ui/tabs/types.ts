export type TTabsContextValue = {
  value: string
  setValue: (v: string) => void
  idBase: string
};

export type TTabsProps = {
  value: string
  defaultValue?: string
  onValueChange?: (v: string) => void
  children: React.ReactNode
};

export type TTabsListProps = React.HTMLAttributes<HTMLDivElement>;

export type TTabsTriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'onClick'
> & {
  value: string
};

export type TTabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string
};
