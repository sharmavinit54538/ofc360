import React from 'react';
import { Building2, ShieldCheck, Loader2 } from 'lucide-react';

interface AuthLoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({
  message = 'Securing Enterprise Session...',
  subMessage = 'Validating cryptographic tokens and role-based clearance...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6 select-none overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 w-80 h-80 bg-brand-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

      <div className="relative flex flex-col items-center text-center max-w-sm space-y-6">
        {/* Animated Brand Emblem */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-0.5 shadow-2xl shadow-brand-500/40 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Building2 className="w-10 h-10 text-brand-400 animate-in zoom-in-75 duration-500" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-950 flex items-center justify-center text-emerald-400 shadow-md">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Status Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
            <h3 className="text-base font-semibold text-white tracking-tight">{message}</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{subMessage}</p>
        </div>

        {/* Security watermark */}
        <div className="pt-8 flex items-center gap-2 text-[11px] text-slate-500 tracking-wider uppercase font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          <span>OFC360 Enterprise Gateway v2.4</span>
        </div>
      </div>
    </div>
  );
};
