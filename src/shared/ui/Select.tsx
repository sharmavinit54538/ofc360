/**
 * @file Select.tsx
 * @description Context-based composable Select component (shadcn/Radix-style API).
 * Supports controlled and uncontrolled usage, keyboard navigation, portal rendering.
 * Also supports legacy native-select via `options` prop for backward compatibility.
 */

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { Portal } from './Portal';

// ==========================================
// Context
// ==========================================

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
  triggerId: string;
  contentId: string;
  /** Map from item value → item label, so the trigger can display the selected label. */
  registerItem: (value: string, label: string) => void;
  unregisterItem: (value: string) => void;
  itemLabels: Record<string, string>;
}

const SelectContext = createContext<SelectContextValue | null>(null);

const useSelectContext = () => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('Select compound components must be used within <Select>.');
  return ctx;
};

// ==========================================
// Select Root
// ==========================================

export interface SelectProps {
  /** Controlled value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  // ---- Legacy native-select compat ----
  /** If provided, renders a native <select> with these options instead of the composable UI. */
  options?: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  error?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  id?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      disabled,
      children,
      // Native-select compat props:
      options,
      placeholder,
      error,
      className,
      onChange,
      name,
      id,
      ...rest
    },
    ref,
  ) => {
    // ---- Legacy native-<select> path ----
    if (options !== undefined) {
      return (
        <select
          ref={ref}
          name={name}
          id={id}
          value={controlledValue}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={(e) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
          }}
          className={cn(
            'w-full px-3 py-2 rounded-lg border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-rose-500 focus:ring-rose-500',
            !error && 'border-neutral-300 dark:border-neutral-600',
            className,
          )}
          {...(rest as any)}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    // ---- Composable (shadcn-style) path ----
    return (
      <SelectRoot
        value={controlledValue}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        {children}
      </SelectRoot>
    );
  },
);
Select.displayName = 'Select';

// ==========================================
// SelectRoot (internal)
// ==========================================

interface SelectRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const SelectRoot: React.FC<SelectRootProps> = ({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  disabled,
  children,
}) => {
  const uid = useId();
  const triggerId = `select-trigger-${uid}`;
  const contentId = `select-content-${uid}`;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [itemLabels, setItemLabels] = useState<Record<string, string>>({});

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) setInternalValue(newValue);
      onValueChange?.(newValue);
      setOpen(false);
    },
    [isControlled, onValueChange],
  );

  const registerItem = useCallback((itemValue: string, label: string) => {
    setItemLabels((prev) => (prev[itemValue] === label ? prev : { ...prev, [itemValue]: label }));
  }, []);

  const unregisterItem = useCallback((itemValue: string) => {
    setItemLabels((prev) => {
      if (!(itemValue in prev)) return prev;
      const next = { ...prev };
      delete next[itemValue];
      return next;
    });
  }, []);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
        disabled,
        triggerId,
        contentId,
        registerItem,
        unregisterItem,
        itemLabels,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};

// ==========================================
// SelectTrigger
// ==========================================

export interface SelectTriggerProps {
  className?: string;
  children?: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, error, disabled: localDisabled }, ref) => {
    const ctx = useSelectContext();
    const { open, setOpen, disabled: ctxDisabled, triggerId, contentId, value, itemLabels } = ctx;
    const isDisabled = localDisabled ?? ctxDisabled;

    // Determine label to display
    const selectedLabel = value ? (itemLabels[value] ?? value) : undefined;

    return (
      <button
        ref={ref}
        id={triggerId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={contentId}
        aria-haspopup="listbox"
        disabled={isDisabled}
        onClick={() => {
          if (!isDisabled) setOpen(!open);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isDisabled) setOpen(!open);
          }
          if (e.key === 'Escape') setOpen(false);
        }}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 rounded-lg border bg-white dark:bg-neutral-900 text-left text-sm',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-600',
          !error && 'hover:border-indigo-500 dark:hover:border-indigo-500',
          className,
        )}
      >
        {/* Show selected label or children (which may contain SelectValue) */}
        <span
          className={cn(
            'flex-1 truncate',
            selectedLabel
              ? 'text-neutral-900 dark:text-white'
              : 'text-neutral-400 dark:text-neutral-500',
          )}
        >
          {selectedLabel ?? children}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-neutral-400 flex-shrink-0 ml-2 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
    );
  },
);
SelectTrigger.displayName = 'SelectTrigger';

// ==========================================
// SelectValue (placeholder / fallback display)
// ==========================================

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder, className }) => {
  // The trigger reads from context; SelectValue just renders the placeholder text.
  return (
    <span className={cn('text-neutral-400 dark:text-neutral-500', className)}>
      {placeholder}
    </span>
  );
};
SelectValue.displayName = 'SelectValue';

// ==========================================
// SelectContent (portal dropdown)
// ==========================================

export interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
  const { open, setOpen, triggerId, contentId } = useSelectContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const focusedIndexRef = useRef<number>(-1);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      const trigger = document.getElementById(triggerId);
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        trigger &&
        !trigger.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open, setOpen, triggerId]);

  // Close on Esc; arrow-key navigation
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        document.getElementById(triggerId)?.focus();
        return;
      }
      const items = contentRef.current?.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])');
      if (!items || items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusedIndexRef.current = Math.min(focusedIndexRef.current + 1, items.length - 1);
        items[focusedIndexRef.current]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusedIndexRef.current = Math.max(focusedIndexRef.current - 1, 0);
        items[focusedIndexRef.current]?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, setOpen, triggerId]);

  // Position the dropdown under the trigger
  const [style, setStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    if (!open) return;
    const trigger = document.getElementById(triggerId);
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setStyle({
      position: 'fixed',
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }, [open, triggerId]);

  if (!open) return null;

  return (
    <Portal>
      <div
        ref={contentRef}
        id={contentId}
        role="listbox"
        style={style}
        className={cn(
          'max-h-60 overflow-y-auto rounded-lg border border-neutral-200 dark:border-neutral-700',
          'bg-white dark:bg-neutral-900 shadow-xl py-1',
          'animate-in fade-in-0 zoom-in-95 duration-100',
          className,
        )}
      >
        {children}
      </div>
    </Portal>
  );
};
SelectContent.displayName = 'SelectContent';

// ==========================================
// SelectItem
// ==========================================

export interface SelectItemProps {
  value: string;
  children?: React.ReactNode;
  label?: string;
  disabled?: boolean;
  className?: string;
  /** @deprecated use children */
  onSelect?: (value: string) => void;
  /** @deprecated use context-driven selection */
  selected?: boolean;
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children, label, disabled, className, onSelect, selected: _selected }, ref) => {
    const ctx = useSelectContext();
    const { value: selectedValue, onValueChange, registerItem, unregisterItem } = ctx;
    const isSelected = selectedValue === value;

    // Derive the display text for this item
    const displayText = children ?? label ?? value;
    const labelStr = typeof displayText === 'string' ? displayText : (label ?? value);

    // Register / unregister label so the trigger can display it
    useEffect(() => {
      registerItem(value, labelStr);
      return () => unregisterItem(value);
    }, [value, labelStr, registerItem, unregisterItem]);

    const handleSelect = () => {
      if (!disabled) {
        onValueChange(value);
        onSelect?.(value);
      }
    };

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect();
          }
        }}
        className={cn(
          'px-3 py-2 cursor-pointer text-sm transition-colors select-none outline-none',
          'hover:bg-neutral-100 dark:hover:bg-neutral-800',
          'focus:bg-neutral-100 dark:focus:bg-neutral-800',
          isSelected && 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
          !isSelected && 'text-neutral-900 dark:text-white',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
      >
        <span className="flex items-center gap-2">
          {isSelected ? (
            <Check className="w-4 h-4 flex-shrink-0" />
          ) : (
            <span className="w-4 flex-shrink-0" />
          )}
          {displayText}
        </span>
      </div>
    );
  },
);
SelectItem.displayName = 'SelectItem';

// ==========================================
// SelectGroup / SelectLabel (optional extras for completeness)
// ==========================================

export interface SelectGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectGroup: React.FC<SelectGroupProps> = ({ children, className }) => (
  <div role="group" className={cn('py-1', className)}>
    {children}
  </div>
);
SelectGroup.displayName = 'SelectGroup';

export interface SelectLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectLabel: React.FC<SelectLabelProps> = ({ children, className }) => (
  <div
    className={cn(
      'px-3 py-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide',
      className,
    )}
  >
    {children}
  </div>
);
SelectLabel.displayName = 'SelectLabel';

export interface SelectSeparatorProps {
  className?: string;
}

export const SelectSeparator: React.FC<SelectSeparatorProps> = ({ className }) => (
  <div className={cn('my-1 border-t border-neutral-200 dark:border-neutral-700', className)} />
);
SelectSeparator.displayName = 'SelectSeparator';