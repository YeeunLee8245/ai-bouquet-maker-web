type TProps = {
  children: React.ReactNode;
  // variant: 'primary' | 'secondary' | 'tertiary';
  size: 'sm' | 'md' | 'lg';
  onClick: () => void;
  className?: string;
};

// const buttonVariants: Record<TProps['variant'], string> = {
//   primary: 'bg-primary-600 text-white',
//   // secondary: 'bg-secondary-600 text-white',
//   // tertiary: 'bg-tertiary-600 text-white',
// };

const buttonSizes: Record<TProps['size'], string> = {
  sm: 'py-1 px-2 inline-flex items-center justify-center rounded-3 bg-primary-100 text-ui-cta-sm text-primary-600 hover:bg-primary-400 hover:text-primary-200',
  md: 'w-[156px] h-[32px] py-1 px-2 inline-flex items-center justify-center rounded-3 bg-primary-400 text-ui-cta-md text-white hover:bg-primary-600 hover:text-primary-200',
  lg: 'w-full h-[44px] px-4 inline-flex items-center justify-center rounded-4 bg-primary-400 text-ui-cta-lg text-white hover:bg-primary-600 hover:text-primary-200',
};

function Button({ children, size, onClick, className }: TProps) {
  return (
    <button className={`cursor-pointer ${buttonSizes[size]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
