import BottomActionFooter from '@/widgets/footer/BottomActionFooter';

export default function FlowerDirectoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative h-full flex flex-col'>
      <div className='flex-1 overflow-y-auto'>
        {children}
      </div>
      <BottomActionFooter />
    </div>
  );
}
