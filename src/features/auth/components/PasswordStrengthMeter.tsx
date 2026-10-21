import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password?: string;
  showDetails?: boolean;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password = '',
  showDetails = true,
}) => {
  const requirements = useMemo(() => {
    return [
      { id: 'length', label: '8+ characters', met: password.length >= 8 },
      { id: 'upper', label: 'Uppercase letter', met: /[A-Z]/.test(password) },
      { id: 'lower', label: 'Lowercase letter', met: /[a-z]/.test(password) },
      { id: 'number', label: 'At least 1 number', met: /\d/.test(password) },
      {
        id: 'special',
        label: 'Special character (@$!%*?&...)',
        met: /[@$!%*?&^#()_+=\-[\]{}|;:,.<>]/.test(password),
      },
    ];
  }, [password]);

  const score = requirements.filter((r) => r.met).length;

  const strength = useMemo(() => {
    if (!password) return { text: '', color: 'bg-slate-750', percent: 0, textClass: 'text-slate-500' };
    if (score <= 2) return { text: 'Weak', color: 'bg-rose-500', percent: 25, textClass: 'text-rose-400' };
    if (score === 3) return { text: 'Fair', color: 'bg-amber-500', percent: 50, textClass: 'text-amber-400' };
    if (score === 4) return { text: 'Good', color: 'bg-blue-500', percent: 75, textClass: 'text-blue-400' };
    return { text: 'Strong', color: 'bg-emerald-500', percent: 100, textClass: 'text-emerald-400' };
  }, [password, score]);

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">Password Strength:</span>
        <span className={`font-semibold ${strength.textClass}`}>{strength.text}</span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((step) => {
          const isFilled = (score >= 1 && step === 1) ||
                           (score >= 3 && step === 2) ||
                           (score >= 4 && step === 3) ||
                           (score === 5 && step === 4);

          return (
            <div
              key={step}
              className={`rounded-full transition-all duration-300 ${
                isFilled ? strength.color : 'bg-slate-800'
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
                req.met ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              {req.met ? (
                <Check className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 shrink-0 opacity-40" />
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
