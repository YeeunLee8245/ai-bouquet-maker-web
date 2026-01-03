export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  // 머리 아이콘 추가
  leftIcon?: {
    component: React.ReactNode;
    className?: string;
  }
}
