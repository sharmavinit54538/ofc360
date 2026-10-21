import React, { useRef, useState, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  hasError = false,
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
    <div className="flex items-center justify-between gap-2 sm:gap-3">
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
          className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl bg-slate-900/90 border transition-all duration-200 outline-none
            ${
              hasError
                ? 'border-rose-500/70 text-rose-300 focus:ring-2 focus:ring-rose-500/20'
                : digits[idx]
                ? 'border-brand-500 text-brand-300 shadow-sm shadow-brand-500/20'
                : 'border-slate-800 text-slate-100 hover:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
      ))}
    </div>
  );
};
