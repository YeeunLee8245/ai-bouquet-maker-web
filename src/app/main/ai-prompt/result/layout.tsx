import BottomActionFooter from '@/widgets/footer/bottom-action-footer';
import { SelectedFlowersInitializer } from '@/shared/model/selected-flowers';

function AiPromptResultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative h-full flex flex-col'>
      <div className='relative flex flex-1 overflow-y-auto'>
        {children}
      </div>
      <SelectedFlowersInitializer />
      <BottomActionFooter title='꽃다발 만들기' fromAiPrompt />
    </div>
  );
}

export default AiPromptResultLayout;
