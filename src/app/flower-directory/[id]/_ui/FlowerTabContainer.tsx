'use client';

import { Tabs } from '@/shared/ui/tabs';
import React, { useState } from 'react';
import { flowerTabItems } from '../_datas';

function FlowerTabContainer() {
  const [value, setValue] = useState<string>(flowerTabItems[0].value);

  return (
    <div>
      <Tabs value={value} onValueChange={setValue}>
        <Tabs.List>
          {flowerTabItems.map(({ value, label }) => (
            <Tabs.Trigger key={value} value={value}>{label}</Tabs.Trigger>
          ))}
        </Tabs.List>
        {flowerTabItems.map(({ value, label }) => (
          <Tabs.Content key={value} value={value}>
            <p>{label}</p>
          </Tabs.Content>
        ))}
      </Tabs>
    </div>
  );
}

export default FlowerTabContainer;
