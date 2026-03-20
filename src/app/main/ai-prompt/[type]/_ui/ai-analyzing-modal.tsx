'use client';

const PETALS = [0, 72, 144, 216, 288];
// TODO: yeeun 기존 꽃 svg로 대체 고민
function AIAnalyzingModal() {
  return (
    <div className='bg-white rounded-4 px-10 py-8 flex flex-col items-center gap-4'>
      <style>{`
        @keyframes ai-flower-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .ai-flower-g {
          transform-box: fill-box;
          transform-origin: center;
          animation: ai-flower-spin 6s linear infinite;
        }
        @keyframes ai-petal-bloom {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 1; }
        }
        .ai-petal { animation: ai-petal-bloom 1.8s ease-in-out infinite; }
        .ai-petal:nth-child(1) { animation-delay: 0s; }
        .ai-petal:nth-child(2) { animation-delay: 0.28s; }
        .ai-petal:nth-child(3) { animation-delay: 0.56s; }
        .ai-petal:nth-child(4) { animation-delay: 0.84s; }
        .ai-petal:nth-child(5) { animation-delay: 1.12s; }
      `}</style>
      <svg width='64' height='64' viewBox='0 0 56 56' fill='none'>
        <g className='ai-flower-g'>
          {PETALS.map((angle, i) => (
            <g key={i} transform={`rotate(${angle}, 28, 28)`}>
              <ellipse
                className='ai-petal'
                cx='28'
                cy='14'
                rx='5'
                ry='11'
                fill='#9CADAC'
              />
            </g>
          ))}
          <circle cx='28' cy='28' r='5.5' fill='#78918F' />
        </g>
      </svg>
      <p className='text-body-md text-gray-400'>꽃을 고르는 중이에요...</p>
    </div>
  );
}

export default AIAnalyzingModal;
