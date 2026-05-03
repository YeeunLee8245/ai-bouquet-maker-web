import { cn } from '@/shared/utils/styles';
import PcFooter from './pc-footer';

type TProps = {
  hidePcFooter?: boolean;
  children: React.ReactNode;
  className?: string;
};

function PageScroll({ children, className, hidePcFooter = false }: TProps) {
  return (
    <div className={cn('h-full overflow-y-auto', className)}>
      {children}
      {!hidePcFooter && <PcFooter />}
    </div>
  );
}

export default PageScroll;
