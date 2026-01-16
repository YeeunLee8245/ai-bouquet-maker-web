import { useRef } from 'react';

/**
 * @description 상태 데이터 속성 이름
 * @example data-state="default"
 * @example data-state="selected"
 * @example data-state="add"
 */
const DATA_ATTR_STATE = 'data-state';

function ColorPicker() {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      {...{ [DATA_ATTR_STATE]: 'default' }}
      type='button'
    >
      ColorPicker
    </button>
  );
}

export default ColorPicker;
