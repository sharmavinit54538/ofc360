import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password?: string;
  showDetails?: boolean;
  compact?: boolean;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password = '',
  showDetails = true,
  compact = false,
}) => {
  const requirements = useMemo(() => {
    return [
      { id: 'length', label: '8+ chars', met: password.length >= 8 },
      { id: 'upper', label: 'Uppercase', met: /[A-Z]/.test(password) },
      { id: 'lower', label: 'Lowercase', met: /[a-z]/.test(password) },
      { id: 'number', label: '1+ number', met: /\d/.test(password) },
      {
        id: 'special',
        label: 'Special symbol',
        met: /[@$!%*?&^#()_+=\-[\]{}|;:,.<>]/.test(password),
      },
    ];
  }, [password]);

  const score = requirements.filter((r) => r.met).length;

  const strength = useMemo(() => {
    if (!password) return { text: '', color: 'bg-gray-200 dark:bg-zinc-700', percent: 0, textClass: 'text-gray-500 dark:text-zinc-400' };
    if (score <= 2) return { text: 'Weak', color: 'bg-rose-500', percent: 25, textClass: 'text-rose-500 dark:text-rose-400' };
    if (score === 3) return { text: 'Fair', color: 'bg-amber-500', percent: 50, textClass: 'text-amber-500 dark:text-amber-400' };
    if (score === 4) return { text: 'Good', color: 'bg-blue-500', percent: 75, textClass: 'text-blue-500 dark:text-blue-400' };
    return { text: 'Strong', color: 'bg-emerald-500', percent: 100, textClass: 'text-emerald-600 dark:text-emerald-400' };
  }, [password, score]);

  if (!password) return null;

  if (compact) {
    return (
      <div className="space-y-1.5 pt-0.5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 dark:text-zinc-400 font-medium">Strength:</span>
            <span className={`font-semibold ${strength.textClass}`}>{strength.text}</span>
          </div>

          {/* 4-bar indicator */}
          <div className="flex gap-1 w-24 h-1.5">
            {[1, 2, 3, 4].map((step) => {
              const isFilled =
                (score >= 1 && step === 1) ||
                (score >= 3 && step === 2) ||
                (score >= 4 && step === 3) ||
                (score === 5 && step === 4);

              return (
                <div
                  key={step}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    isFilled ? strength.color : 'bg-gray-200 dark:bg-zinc-700'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Compact 1-line requirements */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px]">
          {requirements.map((req) => (
            <div
              key={req.id}
              className={`flex items-center gap-1 transition-colors ${
                req.met ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-500 dark:text-zinc-400'
              }`}
            >
              {req.met ? (
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-600 inline-block" />
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-zinc-400">Password Strength:</span>
        <span className={`font-semibold ${strength.textClass}`}>{strength.text}</span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((step) => {
          const isFilled =
            (score >= 1 && step === 1) ||
            (score >= 3 && step === 2) ||
            (score >= 4 && step === 3) ||
            (score === 5 && step === 4);

          return (
            <div
              key={step}
              className={`rounded-full transition-all duration-300 ${
                isFilled ? strength.color : 'bg-gray-200 dark:bg-zinc-700'
              }`}
            />
          );
        })}
      </div>

      {showDetails && (
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {requirements.map((req) => (
            <div
              key={req.id}
              className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                req.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-zinc-400'
              }`}
            >
              {req.met ? (
                <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <X className="w-3.5 h-3.5 shrink-0 opacity-40 text-gray-500 dark:text-zinc-400" />
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
