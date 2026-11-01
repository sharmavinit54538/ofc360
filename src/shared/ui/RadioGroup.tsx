import React, { createContext, forwardRef, useContext, useId, useState } from 'react';
import { cn } from '../lib/utils';

interface RadioGroupContextValue {
  value: string;
  name: string;
  disabled: boolean;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const useRadioGroupContext = (): RadioGroupContextValue => {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error('RadioGroupItem must be used within <RadioGroup>.');
  return context;
};

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  name?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      name,
      disabled = false,
      onValueChange,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const generatedName = useId();
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const handleValueChange = (nextValue: string) => {
      if (!isControlled) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    };

    return (
      <RadioGroupContext.Provider
        value={{ value, name: name ?? `radio-group-${generatedName}`, disabled, onValueChange: handleValueChange }}
      >
        <div
          {...props}
          ref={ref}
          role="radiogroup"
          aria-disabled={disabled || undefined}
          className={cn('grid gap-2', className)}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);
RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'value' | 'checked' | 'defaultChecked' | 'onChange'> {
  value: string;
  children?: React.ReactNode;
  inputClassName?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({
    value,
    children,
    className,
    inputClassName,
    id,
    disabled: itemDisabled,
    onChange,
    ...props
  }, ref) => {
    const context = useRadioGroupContext();
    const generatedId = useId();
    const resolvedId = id ?? `radio-${generatedId}`;
    const disabled = context.disabled || Boolean(itemDisabled);

    return (
      <label
        htmlFor={resolvedId}
        className={cn(
          'inline-flex min-h-5 items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          className,
        )}
      >
        <input
          {...props}
          ref={ref}
          id={resolvedId}
          type="radio"
          name={context.name}
          value={value}
          checked={context.value === value}
          disabled={disabled}
          onChange={(event) => {
            onChange?.(event);
            if (!event.defaultPrevented && event.target.checked) context.onValueChange(value);
          }}
          className={cn('peer sr-only', inputClassName)}
        />
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-neutral-400 bg-white dark:border-neutral-600 dark:bg-neutral-900',
            'peer-checked:border-indigo-600 peer-checked:dark:border-indigo-500',
            'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-neutral-950',
            'peer-disabled:opacity-50',
          )}
        >
          <span className="h-2 w-2 rounded-full bg-indigo-600 opacity-0 peer-checked:opacity-100 dark:bg-indigo-500" />
        </span>
        {children != null && <span>{children}</span>}
      </label>
    );
  },
);
RadioGroupItem.displayName = 'RadioGroupItem';
