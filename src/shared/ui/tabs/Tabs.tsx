'use client';

import * as React from 'react';
import type { TTabsProps, TTabsListProps, TTabsTriggerProps, TTabsContentProps } from './types';
import { useId } from 'react';
import { TabsContext, useTabsContext } from './hooks/use-tabs-context';

function TabsRoot({ value, defaultValue, onValueChange, children, ...props }: TTabsProps) {
  const idBase = useId();

  const current = defaultValue ?? value;

  const setValue = (v: string) => {
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value: current, setValue, idBase }}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  );
}

const TabsList = React.forwardRef<HTMLDivElement, TTabsListProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} role="tablist" {...props}>
        {children}
      </div>
    );
  },
);
TabsList.displayName = 'Tabs.List';

const TabsTrigger = React.forwardRef<HTMLButtonElement, TTabsTriggerProps>(
  ({ value, children, ...props }, ref) => {
    const { value: active, setValue: setValue, idBase } = useTabsContext();
    const selected = active === value;
    const tabId = `${idBase}-tab-${value}`;
    const panelId = `${idBase}-panel-${value}`;

    const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setValue(value);
      }
      props.onKeyDown?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={tabId}
        aria-selected={selected}
        aria-controls={panelId}
        tabIndex={selected ? 0 : -1}
        data-state={selected ? 'active' : 'inactive'}
        onClick={() => setValue(value)}
        onKeyDown={onKeyDown}
        {...props}
      >
        {children}
      </button>
    );
  },
);
TabsTrigger.displayName = 'Tabs.Trigger';

const TabsContent = React.forwardRef<HTMLDivElement, TTabsContentProps>(
  ({ value, children, ...props }, ref) => {
    const { value: active, idBase } = useTabsContext();
    const selected = active === value;
    const tabId = `${idBase}-tab-${value}`;
    const panelId = `${idBase}-panel-${value}`;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        hidden={!selected}
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TabsContent.displayName = 'Tabs.Content';

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
