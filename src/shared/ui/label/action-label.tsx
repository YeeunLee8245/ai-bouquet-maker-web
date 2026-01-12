import React from 'react';
import { IActionLabelProps } from './types';

function ActionLabel({ icon, text, ...props }: IActionLabelProps) {
  return (
    <span {...props}>
      {icon}
      {text}
    </span>
  );
}

export default ActionLabel;
