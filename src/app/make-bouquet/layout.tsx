type TProps = {
  children: React.ReactNode;
  // modal: React.ReactNode;
};

export default function MakeBouquetLayout({ children }: TProps) {
  return (
    <div className='relative h-full flex flex-col overflow-y-auto'>
      {children}
      {/* {modal} */}
    </div>
  );
}
