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

    return (
      <div className="w-full space-y-1.5">
        {(label || labelRight) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={inputId}
                className="block text-xs font-semibold text-slate-800"
              >
                {label}
              </label>
            )}
            {labelRight && <div>{labelRight}</div>}
          </div>
        )}

        <div className="relative rounded-xl">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={`w-full rounded-xl bg-[#eef4ff] border text-slate-900 placeholder-slate-400 text-sm py-3 transition-all duration-200 outline-none
              ${leftIcon ? 'pl-10' : 'px-4'}
              ${rightIcon || isPassword ? 'pr-11' : 'px-4'}
              ${
                error
                  ? 'border-rose-400 bg-rose-50/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
                  : 'border-transparent hover:bg-[#e8f0fe] focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100'
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
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : (
            rightIcon && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {/* Error message displayed cleanly underneath input (no overlap) */}
        {error ? (
          <div className="flex items-center gap-2 pt-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
            <div className="w-4 h-4 rounded bg-[#e65100] text-white flex items-center justify-center font-bold text-[10px] shrink-0 leading-none shadow-xs">
              !
            </div>
            <p className="text-xs text-slate-700 font-medium leading-tight">
              {error}
            </p>
          </div>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
