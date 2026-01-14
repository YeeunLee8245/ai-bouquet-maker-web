type TProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function MakeBouquetLayout({ children, modal }: TProps) {
  return (
    <div className='relative h-full flex flex-col'>
      {children}
      {modal}
    </div>
  );
}
