import React, { useRef, useState, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  hasError = false,
  autoFocus = true,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Synchronize internal digits with incoming value
  useEffect(() => {
    const chars = value.split('').slice(0, length);
    const newDigits = Array(length).fill('');
    chars.forEach((c, i) => {
      newDigits[i] = c;
    });
    setDigits(newDigits);
  }, [value, length]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      onChange(newDigits.join(''));
      return;
    }

    const char = val.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    onChange(newDigits.join(''));

    // Move focus to next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasteData) return;

    const newDigits = Array(length).fill('');
    pasteData.split('').forEach((c, i) => {
      newDigits[i] = c;
    });
    setDigits(newDigits);
    onChange(newDigits.join(''));

    // Focus either the next empty slot or the last digit
    const focusIndex = Math.min(pasteData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digits[idx] || ''}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-11 h-13 text-center text-xl font-semibold rounded-xl border transition-all duration-200 outline-none
            ${
              hasError
                ? 'border-rose-400 text-rose-600 dark:text-rose-400 placeholder:text-rose-300 dark:placeholder:text-rose-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                : digits[idx]
                ? 'border-emerald-500 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 placeholder:text-emerald-200 dark:placeholder:text-emerald-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                : 'border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 hover:border-gray-400 dark:hover:border-zinc-600 focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          placeholder=""
        />
      ))}
    </div>
  );
};