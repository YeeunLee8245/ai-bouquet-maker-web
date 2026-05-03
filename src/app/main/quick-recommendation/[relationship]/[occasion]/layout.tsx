import BottomActionFooter from '@/widgets/footer/bottom-action-footer';
import { SelectedFlowersInitializer } from '@/entities/flower/model/selected-flowers';
import PageScroll from '@/app/_ui/page-scroll';

function QuickRecommendationOccasionLayout({ children }: { children: React.ReactNode }) {
  return <div className='relative h-full flex flex-col'>
    <PageScroll className='relative flex flex-1'>
      {children}
    </PageScroll>
    <SelectedFlowersInitializer />
    <BottomActionFooter title='꽃다발 만들기' fromAiPrompt />
  </div>;
}

export default QuickRecommendationOccasionLayout;
