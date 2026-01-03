import { ScrollToTopButton } from '@/shared/ui/scroll-to-top/ScrollToTopButton';
import BottomActionFooter from '@/widgets/footer/BottomActionFooter';
import ArrowUpIcon from '@/shared/assets/icons/up_arrow.svg';

export default function FlowerDirectoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative h-full flex flex-col'>
      <div className='flex-1 overflow-y-auto'>
        {children}
        <ScrollToTopButton className='bottom-[144px]'>
          <ArrowUpIcon />
        </ScrollToTopButton>
      </div>
      <BottomActionFooter />
    </div>
  );
}
