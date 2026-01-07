import BottomActionFooter from '@/widgets/footer/BottomActionFooter';

export default function FlowerDirectoryLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <div className='relative h-full flex flex-col'>
      <div className='relative flex flex-1 overflow-y-auto'>
        {children}
        {modal}
      </div>
      <BottomActionFooter />
    </div>
  );
}
