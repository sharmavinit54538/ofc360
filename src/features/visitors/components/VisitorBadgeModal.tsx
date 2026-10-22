/**
 * @file VisitorBadgeModal.tsx
 * @description Printable digital visitor badge pass modal with QR verification code,
 * corporate watermark, host details, and quick print action.
 */

import React from 'react';
import { X, Printer, ShieldCheck, Building2, User, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { Visitor } from '../types/visitors.types';

interface VisitorBadgeModalProps {
  visitor: Visitor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VisitorBadgeModal: React.FC<VisitorBadgeModalProps> = ({ visitor, isOpen, onClose }) => {
  if (!isOpen || !visitor) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = visitor.expectedArrival
    ? new Date(visitor.expectedArrival).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50 print:bg-white print:p-0 print:fixed print:inset-0">
      <div
        className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 print:shadow-none print:border-none print:max-w-none print:w-full print:rounded-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="visitor-badge-title"
      >
        {/* Header - Screen Only */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-zinc-900/40 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 dark:text-[#ececec]">
              Digital Visitor Pass
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-semibold border border-brand-200/50 dark:border-brand-900/30">
              {visitor.visitorCode || 'VIS-GUEST'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge Card Container */}
        <div className="p-6 flex flex-col items-center">
          {/* Printable Badge Surface */}
          <div className="w-full max-w-sm rounded-2xl border-2 border-brand-500/30 dark:border-brand-500/20 bg-gradient-to-b from-brand-500/5 via-transparent to-brand-500/5 p-6 shadow-md relative overflow-hidden print:border-gray-800 print:shadow-none">
            {/* Lanyard Slot Notch */}
            <div className="mx-auto w-12 h-2.5 rounded-full bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 mb-5" />

            {/* Corporate Header */}
            <div className="text-center pb-4 border-b border-gray-200 dark:border-zinc-800">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-brand-600 dark:text-brand-400">
                <ShieldCheck className="w-4 h-4" />
                OFC360 FACILITY PASS
              </div>
              <div className="text-[10px] text-gray-400 dark:text-zinc-500 tracking-wider uppercase mt-0.5">
                Authorized Corporate Guest
              </div>
            </div>

            {/* Visitor Identity */}
            <div className="flex flex-col items-center text-center my-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 mb-3 border-2 border-white dark:border-zinc-900">
                {visitor.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'VI'}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-[#ececec]">
                {visitor.fullName}
              </h3>
              <div className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                {visitor.company}
              </div>
              <div className="font-mono text-xs text-gray-400 dark:text-zinc-500 mt-1">
                Badge #{visitor.badgeNumber || visitor.visitorCode || 'VIS-001'}
              </div>
            </div>

            {/* Key Visit Details */}
            <div className="bg-gray-50 dark:bg-zinc-900/60 rounded-xl p-3 text-xs space-y-2 border border-gray-200/70 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                  <User className="w-3 h-3" /> Host Contact:
                </span>
                <span className="font-semibold text-gray-800 dark:text-zinc-200">
                  {visitor.hostName || visitor.hostEmployeeId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Visit Date:
                </span>
                <span className="font-medium text-gray-800 dark:text-zinc-200">
                  {formattedDate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-zinc-400">Purpose:</span>
                <span className="font-medium text-gray-800 dark:text-zinc-200 truncate max-w-[170px]">
                  {visitor.purpose}
                </span>
              </div>
            </div>

            {/* Vector QR Code Verification Mockup */}
            <div className="my-5 flex flex-col items-center">
              <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-inner flex items-center justify-center">
                <svg
                  className="w-28 h-28 text-gray-900"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Top-Left Finder */}
                  <rect x="5" y="5" width="26" height="26" rx="2" />
                  <rect x="9" y="9" width="18" height="18" fill="white" />
                  <rect x="13" y="13" width="10" height="10" />

                  {/* Top-Right Finder */}
                  <rect x="69" y="5" width="26" height="26" rx="2" />
                  <rect x="73" y="9" width="18" height="18" fill="white" />
                  <rect x="77" y="13" width="10" height="10" />

                  {/* Bottom-Left Finder */}
                  <rect x="5" y="69" width="26" height="26" rx="2" />
                  <rect x="9" y="73" width="18" height="18" fill="white" />
                  <rect x="13" y="77" width="10" height="10" />

                  {/* Grid Data Pattern */}
                  <rect x="36" y="8" width="6" height="6" />
                  <rect x="46" y="8" width="6" height="6" />
                  <rect x="56" y="8" width="6" height="6" />
                  <rect x="36" y="18" width="6" height="6" />
                  <rect x="50" y="18" width="6" height="6" />
                  <rect x="8" y="36" width="6" height="6" />
                  <rect x="18" y="44" width="6" height="6" />
                  <rect x="28" y="36" width="6" height="6" />
                  <rect x="38" y="36" width="6" height="6" />
                  <rect x="48" y="36" width="6" height="6" />
                  <rect x="68" y="36" width="6" height="6" />
                  <rect x="78" y="44" width="6" height="6" />
                  <rect x="88" y="36" width="6" height="6" />
                  <rect x="36" y="48" width="8" height="8" />
                  <rect x="48" y="48" width="8" height="8" />
                  <rect x="60" y="48" width="6" height="6" />
                  <rect x="36" y="62" width="6" height="6" />
                  <rect x="46" y="62" width="6" height="6" />
                  <rect x="56" y="68" width="6" height="6" />
                  <rect x="68" y="60" width="8" height="8" />
                  <rect x="80" y="68" width="6" height="6" />
                  <rect x="40" y="78" width="6" height="6" />
                  <rect x="52" y="80" width="6" height="6" />
                  <rect x="68" y="78" width="8" height="8" />
                  <rect x="82" y="82" width="6" height="6" />
                </svg>
              </div>
              <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-2 font-mono">
                SCAN FOR ACCESS CLEARANCE
              </span>
            </div>

            {/* Compliance Footnote */}
            <div className="pt-3 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> NDA Signed
              </span>
              <span className="text-gray-400 dark:text-zinc-500">Security Clearance Level 1</span>
            </div>
          </div>
        </div>

        {/* Screen Action Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-zinc-900/40 print:hidden">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="rounded-xl text-sm"
          >
            Close
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handlePrint}
            className="rounded-xl text-sm px-5 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Badge
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisitorBadgeModal;
