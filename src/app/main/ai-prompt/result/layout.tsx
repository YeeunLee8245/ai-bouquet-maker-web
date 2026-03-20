import BottomActionFooter from '@/widgets/footer/bottom-action-footer';

function AiPromptResultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative h-full flex flex-col'>
      <div className='relative flex flex-1 overflow-y-auto'>
        {children}
      </div>
      <BottomActionFooter title='꽃다발 만들기' />
    </div>
  );
}

export default AiPromptResultLayout;
