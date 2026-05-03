import PageScroll from '@/widgets/footer/page-scroll';

type TProps = {
  children: React.ReactNode;
};

export default function MakeBouquetLayout({ children }: TProps) {
  return (
    <PageScroll className='relative h-full flex flex-col'>
      {children}
    </PageScroll>
  );
}
