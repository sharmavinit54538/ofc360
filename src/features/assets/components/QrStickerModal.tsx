/**
 * @file QrStickerModal.tsx
 * @description Printable hardware QR sticker and barcode asset label modal
 * designed for physical equipment tagging, property marking, and inventory audits.
 */

import React from 'react';
import { X, Printer, ShieldCheck, Box, Hash, Building2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { Asset } from '../types';

interface QrStickerModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QrStickerModal: React.FC<QrStickerModalProps> = ({ asset, isOpen, onClose }) => {
  if (!isOpen || !asset) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50 print:bg-white print:p-0 print:fixed print:inset-0">
      <div
        className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 print:shadow-none print:border-none print:max-w-none print:w-full print:rounded-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="asset-qr-sticker-title"
      >
        {/* Header - Screen Only */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-zinc-900/40 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 dark:text-[#ececec]">
              Asset QR Label Sticker
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-semibold border border-brand-200/50 dark:border-brand-900/30">
              {asset.assetTag}
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

        {/* Sticker Preview Container */}
        <div className="p-6 flex flex-col items-center">
          {/* Printable Sticker Label */}
          <div className="w-full max-w-sm rounded-2xl border-2 border-dashed border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-5 shadow-sm text-gray-900 dark:text-[#ececec] print:border-black print:shadow-none">
            {/* Label Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-gray-900 dark:border-zinc-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span className="text-xs font-black tracking-wider uppercase">
                  OFC360 PROPERTY
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 dark:text-zinc-400">
                DO NOT REMOVE
              </span>
            </div>

            {/* Middle Section: QR + Metadata */}
            <div className="flex items-center gap-4 my-4">
              {/* Vector QR Code */}
              <div className="p-2 bg-white rounded-lg border border-gray-300 shrink-0">
                <svg
                  className="w-24 h-24 text-gray-900"
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

                  {/* Matrix Pattern */}
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

              {/* Asset Information */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="font-mono text-base font-black tracking-wider text-brand-600 dark:text-brand-400 truncate">
                  {asset.assetTag}
                </div>
                <div className="font-bold text-xs truncate">
                  {asset.assetName}
                </div>
                <div className="font-mono text-[11px] text-gray-500 dark:text-zinc-400 truncate">
                  SN: {asset.serialNumber}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-zinc-400">
                  {asset.category} • {asset.location || 'HQ Storage'}
                </div>
              </div>
            </div>

            {/* Bottom Barcode Mock & Security Stamp */}
            <div className="pt-2 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between text-[9px] font-mono text-gray-400 dark:text-zinc-500">
              <span>SCAN TO AUDIT / REPORT ISSUE</span>
              <span>IT OPS VERIFIED</span>
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
            Print Sticker
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QrStickerModal;
