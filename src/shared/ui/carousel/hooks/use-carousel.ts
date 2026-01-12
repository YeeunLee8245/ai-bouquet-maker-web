import React from 'react';

type TParams = {
  length: number;
  index: number;
  onIndexChange: (index: number) => void;
  children: React.ReactNode;
};

const useCarousel = ({ length, index, onIndexChange, children }: TParams) => {
  const goPrev = () => {
    const nextIndex = Math.max(0, index - 1);
    onIndexChange(nextIndex);
  };
  const goNext = () => {
    const nextIndex = Math.min(length - 1, index + 1);
    onIndexChange(nextIndex);
  };

  return {
    items: React.Children.toArray(children),
    goPrev,
    goNext,
  };
};

export default useCarousel;
