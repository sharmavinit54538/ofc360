import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelRight?: React.ReactNode;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  inputSize?: 'sm' | 'md';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      labelRight,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isPassword = false,
      inputSize = 'md',
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const isSm = inputSize === 'sm';

    return (
      <div className={`w-full ${isSm ? 'space-y-1' : 'space-y-1.5'}`}>
        {(label || labelRight) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={inputId}
                className={`block font-semibold text-gray-900 dark:text-[#ececec] ${isSm ? 'text-[11px] sm:text-xs' : 'text-xs'}`}
              >
                {label}
              </label>
            )}
            {labelRight && <div>{labelRight}</div>}
          </div>
        )}

        <div className="relative rounded-xl">
          {leftIcon && (
            <div className={`absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-500 dark:text-zinc-400 ${isSm ? 'pl-3' : 'pl-3.5'}`}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={`w-full rounded-xl bg-white dark:bg-[#171717] border text-gray-900 dark:text-[#ececec] placeholder-gray-500 dark:placeholder-zinc-500 transition-all duration-200 outline-none
              ${isSm ? 'text-xs sm:text-sm py-2 sm:py-2.5' : 'text-sm py-3'}
              ${leftIcon ? (isSm ? 'pl-9' : 'pl-10') : (isSm ? 'px-3 sm:px-3.5' : 'px-4')}
              ${rightIcon || isPassword ? (isSm ? 'pr-9 sm:pr-10' : 'pr-11') : (isSm ? 'px-3 sm:px-3.5' : 'px-4')}
              ${
                error
                  ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 dark:focus:ring-rose-900/30'
                  : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-[#2f2f2f] focus:bg-white dark:focus:bg-[#171717] focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30'
              }
              ${className}
            `}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-0 right-0 flex items-center text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 focus:outline-none transition-colors ${isSm ? 'pr-3' : 'pr-3.5'}`}
            >
              {showPassword ? <EyeOff className={isSm ? "w-3.5 h-3.5" : "w-4 h-4"} /> : <Eye className={isSm ? "w-3.5 h-3.5" : "w-4 h-4"} />}
            </button>
          ) : (
            rightIcon && (
              <div className={`absolute inset-y-0 right-0 flex items-center pointer-events-none text-gray-500 dark:text-zinc-400 ${isSm ? 'pr-3' : 'pr-3.5'}`}>
                {rightIcon}
              </div>
            )
          )}
        </div>

        {/* Error message displayed cleanly underneath input (no overlap) */}
        {error ? (
          <div className="flex items-center gap-1.5 pt-0.5 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
            <div className="w-3.5 h-3.5 rounded bg-rose-600 text-white flex items-center justify-center font-bold text-[9px] shrink-0 leading-none shadow-xs">
              !
            </div>
            <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium leading-tight">
              {error}
            </p>
          </div>
        ) : helperText ? (
          <p className="text-xs text-gray-500 dark:text-zinc-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
