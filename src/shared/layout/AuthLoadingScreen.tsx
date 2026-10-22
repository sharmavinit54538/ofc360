import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface AuthLoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({
  message = 'Securing Enterprise Session...',
  subMessage = 'Validating cryptographic tokens and role-based clearance...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-[#212121] text-gray-900 dark:text-[#ececec] p-6 select-none overflow-hidden transition-colors duration-200">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 w-80 h-80 bg-brand-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

      <div className="relative flex flex-col items-center text-center max-w-sm space-y-6">
        {/* Animated Brand Emblem */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-2 shadow-2xl flex items-center justify-center animate-pulse">
            <img src="/logo.png" alt="OFC360" className="w-14 h-14 object-contain animate-in zoom-in-75 duration-500" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-[#171717] border-2 border-gray-200 dark:border-zinc-800 flex items-center justify-center text-emerald-400 shadow-md">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Status Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec] tracking-tight">{message}</h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">{subMessage}</p>
        </div>

        {/* Security watermark */}
        <div className="pt-8 flex items-center gap-2 text-[11px] text-gray-500 dark:text-zinc-500 tracking-wider uppercase font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          <span>OFC360 Enterprise Gateway v2.4</span>
        </div>
      </div>
    </div>
  );
};
