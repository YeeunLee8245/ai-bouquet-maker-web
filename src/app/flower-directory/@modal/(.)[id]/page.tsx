import React from 'react';
import FlowerDetailPage from '../../[id]/page';

function FlowerDetailModalPage() {
  return (
    <div className='absolute inset-0 z-modal bg-background'>
      <FlowerDetailPage/>
    </div>
  );
};

export default FlowerDetailModalPage;
