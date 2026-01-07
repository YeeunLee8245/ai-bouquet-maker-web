export type TTabItem = {
  /** 탭 id 값 */
  value: string;
  label: string;
};

export type TTabsContextValue = {
  /** 현재 탭 id 값 */
  value: string;
  /** 탭 id 값 설정 함수 */
  setValue: (v: string) => void;
  /** 웹 접근성 고유 id 값 */
  idBase: string;
};

export type TTabsProps = {
  /** 현재 탭 id 값 */
  value: string;
  /** 기본 탭 id 값 */
  defaultValue?: string;
  /** 탭 id 값 변경 함수 */
  onValueChange?: (value: string) => void;
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
