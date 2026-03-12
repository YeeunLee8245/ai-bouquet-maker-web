'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { getColorNameFromHsl, hslString } from '@/shared/utils/color';

type TProps = {
  initialColor: string;
  onApply: (color: string) => void;
};

function parseHsl(color: string): [number, number, number] {
  const match = color.match(/hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)/);
  if (match) {
    return [Number(match[1]), Number(match[2]), Number(match[3])];
  }
  return [0, 100, 50];
}

export default function InlineColorPicker({ initialColor, onApply }: TProps) {
  const [h, s, l] = parseHsl(initialColor);
  const [hue, setHue] = useState(h);
  const saturation = s;
  const [lightness, setLightness] = useState(l);

  const previewColor = hslString(hue, saturation, lightness);

  return (
    <div className='px-4 pb-4'>
      <div className='flex items-center gap-3 mb-3'>
        <div
          className='w-8 h-8 rounded-full border-1 border-gray-100 shrink-0'
          style={{ backgroundColor: previewColor }}
        />
        <p className='text-body-xsm text-gray-400'>
          {getColorNameFromHsl(hue, saturation, lightness)}
        </p>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <label className='text-body-xsm text-gray-500'>색상</label>
          <input
            type='range'
            min='0'
            max='360'
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className='input-range w-full h-2 rounded-6'
            style={{
              background:
                'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%))',
            }}
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-body-xsm text-gray-500'>밝기</label>
          <input
            type='range'
            min='0'
            max='100'
            value={lightness}
            onChange={(e) => setLightness(Number(e.target.value))}
            className='input-range w-full h-2 rounded-6'
            style={{
              background: `linear-gradient(to right, hsl(${hue},${saturation}%,0%), hsl(${hue},${saturation}%,50%), hsl(${hue},${saturation}%,100%))`,
            }}
          />
        </div>
      </div>

      <Button
        size='md'
        className='mt-4'
        onClick={() => onApply(previewColor)}
      >
        색상 적용
      </Button>
    </div>
  );
}
