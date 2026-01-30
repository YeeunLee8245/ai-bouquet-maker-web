type TProps = {
  children: React.ReactNode;
};

export default function MakeBouquetLayout({ children }: TProps) {
  return (
    <div className='relative h-full flex flex-col overflow-y-auto'>
      {children}
    </div>
  );
}
