import BottomActionFooter from '@/widgets/footer/BottomActionFooter';

type TProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function FlowerDirectoryLayout({ children, modal }: TProps) {
  return (
    <div className='relative h-full flex flex-col'>
      <div className='relative flex flex-1 overflow-y-auto'>
        {children}
        {modal}
      </div>
      <BottomActionFooter title='꽃다발 만들기' />
    </div>
  );
}
