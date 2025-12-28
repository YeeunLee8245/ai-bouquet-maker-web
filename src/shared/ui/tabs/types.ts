export type TabsContextValue = {
  value: string
  setValue: (v: string) => void
  idBase: string
};

export type TabsProps = {
  value: string
  defaultValue?: string
  onValueChange?: (v: string) => void
  children: React.ReactNode
};

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

export type TabsTriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'onClick'
> & {
  value: string
};

export type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string
};
