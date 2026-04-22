import type { FallbackProps } from 'react-error-boundary';

export function WidgetErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className='flex flex-col items-center justify-center py-8 gap-3'>
      <p className='text-body-md text-gray-400'>정보를 불러올 수 없습니다.</p>
      <button
        onClick={resetErrorBoundary}
        className='text-ui-textbtn-sm text-primary-600 hover:text-primary-400'
      >
        다시 시도
      </button>
    </div>
  );
}
