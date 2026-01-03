import React from 'react';

function BottomActionFooter() {
  return (
    <footer className='py-3 px-4 pb-8 w-full' style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
      <div>
        <span className='text-body-lg'>
          선택한 꽃
        </span>
      </div>
    </footer>
  );
}

export default BottomActionFooter;
