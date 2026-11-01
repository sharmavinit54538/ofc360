import React, { createContext, useContext, useState, forwardRef } from 'react';
import { cn } from '../lib/utils';

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
  id: string;
  orientation: 'horizontal' | 'vertical';
  dir: 'ltr' | 'rtl';
  activationMode: 'automatic' | 'manual';
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs provider');
  }
  return context;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'dir'> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  dir?: 'ltr' | 'rtl';
  activationMode?: 'automatic' | 'manual';
  children: React.ReactNode;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      defaultValue,
      value: controlledValue,
      onValueChange,
      orientation = 'horizontal',
      dir = 'ltr',
      activationMode = 'automatic',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
    const id = React.useId();

    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : uncontrolledValue;

    const handleValueChange = (newVal: string) => {
      if (!isControlled) {
        setUncontrolledValue(newVal);
      }
      onValueChange?.(newVal);
    };

    return (
      <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange, id, orientation, dir, activationMode }}>
        <div ref={ref} dir={dir} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = useTabsContext();
    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        data-orientation={orientation}
        className={cn(
          'inline-flex items-center justify-start sm:justify-center max-w-full overflow-x-auto no-scrollbar rounded-xl bg-neutral-100 p-1 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
          className
        )}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, children, disabled, onClick, onKeyDown, ...props }, ref) => {
    const { value: activeValue, onValueChange, id, orientation, dir, activationMode } = useTabsContext();
    const isActive = activeValue === value;
    const encodedValue = encodeURIComponent(value);
    const tabId = `${id}-tab-${encodedValue}`;
    const panelId = `${id}-panel-${encodedValue}`;

    return (
      <button
        ref={ref}
        type="button"
        id={tabId}
        role="tab"
        aria-selected={isActive}
        aria-controls={panelId}
        tabIndex={isActive ? 0 : -1}
        data-state={isActive ? 'active' : 'inactive'}
        data-orientation={orientation}
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented && !disabled) {
            onValueChange(value);
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || disabled) return;

          const nextKey = orientation === 'horizontal'
            ? (dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight')
            : 'ArrowDown';
          const previousKey = orientation === 'horizontal'
            ? (dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft')
            : 'ArrowUp';
          const tabList = event.currentTarget.closest('[role="tablist"]');
          const tabs = tabList
            ? Array.from(tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'))
            : [];
          const currentIndex = tabs.indexOf(event.currentTarget);
          let nextIndex = currentIndex;

          if (event.key === nextKey) nextIndex = (currentIndex + 1) % tabs.length;
          else if (event.key === previousKey) nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') nextIndex = 0;
          else if (event.key === 'End') nextIndex = tabs.length - 1;
          else return;

          if (tabs.length === 0) return;
          event.preventDefault();
          const nextTab = tabs[nextIndex];
          nextTab?.focus();
          if (activationMode === 'automatic') {
            const nextValue = nextTab?.getAttribute('data-value');
            if (nextValue) onValueChange(nextValue);
          }
        }}
        data-value={value}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow-sm dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-800 dark:data-[state=active]:bg-neutral-900 dark:data-[state=active]:text-neutral-50 cursor-pointer select-none',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, children, ...props }, ref) => {
    const { value: activeValue, id, orientation } = useTabsContext();
    const isActive = activeValue === value;

    if (!isActive) return null;

    const encodedValue = encodeURIComponent(value);

    return (
      <div
        ref={ref}
        id={`${id}-panel-${encodedValue}`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${encodedValue}`}
        tabIndex={0}
        data-state={isActive ? 'active' : 'inactive'}
        data-orientation={orientation}
        className={cn(
          'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-800 animate-in fade-in-50 duration-150',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = 'TabsContent';

export default Tabs;
