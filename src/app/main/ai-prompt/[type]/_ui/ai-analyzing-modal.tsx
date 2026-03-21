'use client';

import CamelliaIcon from '@/shared/assets/icons/camellia.svg';

function AIAnalyzingModal() {
  return (
    <div className='bg-white rounded-4 px-10 py-8 flex flex-col items-center gap-4'>
      <style>{`
        @keyframes ai-flower-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ai-petal-bloom {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 1; }
        }
        .ai-flower-spin {
          animation: ai-flower-spin 6s linear infinite;
        }
        .ai-flower-spin > g {
          fill: #e8a0bf;
        }
        .ai-flower-spin circle:first-of-type {
          fill: #f5c06a !important;
        }
        .ai-flower-spin circle:last-of-type {
          fill: white !important;
        }
        @keyframes ai-dot {
          0%, 20%  { opacity: 0; }
          50%      { opacity: 1; }
          100%     { opacity: 0; }
        }
        .ai-dot { animation: ai-dot 1.4s ease-in-out infinite; opacity: 0; }
        .ai-dot:nth-child(1) { animation-delay: 0s; }
        .ai-dot:nth-child(2) { animation-delay: 0.2s; }
        .ai-dot:nth-child(3) { animation-delay: 0.4s; }
        .ai-flower-spin > g > g:nth-child(1) {
          animation: ai-petal-bloom 1.8s ease-in-out infinite;
          animation-delay: 0s;
        }
        .ai-flower-spin > g > g:nth-child(2) {
          animation: ai-petal-bloom 1.8s ease-in-out infinite;
          animation-delay: 0.3s;
        }
        .ai-flower-spin > g > g:nth-child(3) {
          animation: ai-petal-bloom 1.8s ease-in-out infinite;
          animation-delay: 0.6s;
        }
      `}</style>
      <CamelliaIcon className='ai-flower-spin w-[64px] h-[64px]' />
      <p className='text-body-md text-gray-400'>
        꽃을 고르는 중이에요
        <span className='ai-dot'>.</span>
        <span className='ai-dot'>.</span>
        <span className='ai-dot'>.</span>
      </p>
    </div>
  );
}

export default AIAnalyzingModal;
