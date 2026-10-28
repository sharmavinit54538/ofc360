/**
 * @file SignatureAuditTimeline.tsx
 * @description Immutable cryptographic audit trail timeline component with SHA-256 fingerprinting,
 * actor identity, IP, user-agent details, and timestamp records.
 */

import React from 'react';
import {
  FilePlus,
  Send,
  Eye,
  KeyRound,
  CheckCircle2,
  XCircle,
  Bell,
  Clock,
  Ban,
  Award,
  Download,
  ShieldCheck,
  Hash,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/Badge';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useGetSignatureAuditQuery } from '../api/signaturesApi';
import type { AuditEventType } from '../types/signatures.types';

export interface SignatureAuditTimelineProps {
  requestId: string;
  sha256?: string;
  className?: string;
}

const getEventConfig = (
  type: AuditEventType
): {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  color: string;
  bgColor: string;
  badgeVariant: 'success' | 'warning' | 'danger' | 'info' | 'slate';
} => {
  switch (type) {
    case 'CREATED':
      return {
        icon: FilePlus,
        title: 'Draft Created',
        color: 'text-slate-600 dark:text-zinc-300',
        bgColor: 'bg-slate-100 dark:bg-zinc-800',
        badgeVariant: 'slate',
      };
    case 'SENT':
      return {
        icon: Send,
        title: 'Sent for Signature',
        color: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
        badgeVariant: 'info',
      };
    case 'VIEWED':
      return {
        icon: Eye,
        title: 'Document Viewed',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-950/40',
        badgeVariant: 'info',
      };
    case 'OTP_VERIFIED':
      return {
        icon: KeyRound,
        title: 'Email OTP Verified',
        color: 'text-teal-600 dark:text-teal-400',
        bgColor: 'bg-teal-50 dark:bg-teal-950/40',
        badgeVariant: 'info',
      };
    case 'SIGNED':
      return {
        icon: CheckCircle2,
        title: 'Signed Electronically',
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
        badgeVariant: 'success',
      };
    case 'DECLINED':
      return {
        icon: XCircle,
        title: 'Signature Declined',
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-50 dark:bg-rose-950/40',
        badgeVariant: 'danger',
      };
    case 'REMINDER_SENT':
      return {
        icon: Bell,
        title: 'Reminder Notification Dispatched',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/40',
        badgeVariant: 'warning',
      };
    case 'EXPIRED':
      return {
        icon: Clock,
        title: 'Document Expired',
        color: 'text-zinc-600 dark:text-zinc-400',
        bgColor: 'bg-zinc-100 dark:bg-zinc-800',
        badgeVariant: 'slate',
      };
    case 'CANCELLED':
      return {
        icon: Ban,
        title: 'Request Voided / Cancelled',
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-50 dark:bg-rose-950/40',
        badgeVariant: 'danger',
      };
    case 'COMPLETED':
      return {
        icon: Award,
        title: 'Completed & Certified',
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
        badgeVariant: 'success',
      };
    case 'DOWNLOADED':
      return {
        icon: Download,
        title: 'Archived Document Downloaded',
        color: 'text-slate-600 dark:text-zinc-400',
        bgColor: 'bg-slate-100 dark:bg-zinc-800',
        badgeVariant: 'slate',
      };
    default:
      return {
        icon: ShieldCheck,
        title: 'Audit Event',
        color: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
        badgeVariant: 'info',
      };
  }
};

export const SignatureAuditTimeline: React.FC<SignatureAuditTimelineProps> = ({
  requestId,
  sha256,
  className,
}) => {
  const { data: events = [], isLoading } = useGetSignatureAuditQuery(requestId);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Cryptographic SHA-256 Proof Card */}
      {sha256 && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-zinc-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Hash className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 block">
              Cryptographic SHA-256 Document Hash
            </span>
            <code className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 break-all select-all block mt-0.5">
              {sha256}
            </code>
          </div>
        </div>
      )}

      {/* Timeline Events */}
      {isLoading ? (
        <div className="space-y-4 py-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-slate-400 dark:text-zinc-600 text-xs">
          No audit entries recorded yet.
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-zinc-800">
          {events.map((event) => {
            const config = getEventConfig(event.type);
            const Icon = config.icon;
            const dateStr = new Date(event.timestamp).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            });

            return (
              <div key={event.id} className="relative group">
                {/* Timeline Node Dot */}
                <div
                  className={cn(
                    'absolute -left-6 top-0.5 w-6 h-6 rounded-full border-2 border-white dark:border-[#1a1a1a] flex items-center justify-center transition-transform group-hover:scale-110',
                    config.bgColor,
                    config.color
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-zinc-800/80 p-3 rounded-xl shadow-xs space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {config.title}
                    </span>
                    <Badge variant={config.badgeVariant} size="sm">
                      {event.type}
                    </Badge>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium text-slate-700 dark:text-zinc-300">
                      {event.actorName}
                    </span>
                    {event.actorEmail && (
                      <span className="text-slate-400 dark:text-zinc-500">
                        ({event.actorEmail})
                      </span>
                    )}
                    <span>•</span>
                    <span>{dateStr}</span>
                  </div>

                  {/* Network / Hardware audit fingerprint */}
                  {(event.ipAddress || event.userAgent) && (
                    <div className="pt-1 mt-1 border-t border-slate-50 dark:border-zinc-800/60 text-[10px] text-slate-400 dark:text-zinc-500 flex flex-wrap gap-x-3">
                      {event.ipAddress && <span>IP: {event.ipAddress}</span>}
                      {event.userAgent && <span className="truncate max-w-xs">Device: {event.userAgent}</span>}
                    </div>
                  )}

                  {/* Metadata notes */}
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="pt-1 text-[11px] text-slate-600 dark:text-zinc-300">
                      {typeof event.metadata.reason === 'string' && (
                        <p className="italic text-rose-600 dark:text-rose-400">
                          Reason: &ldquo;{event.metadata.reason}&rdquo;
                        </p>
                      )}
                      {typeof event.metadata.method === 'string' && (
                        <span className="text-[10px] font-mono bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          Method: {event.metadata.method}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SignatureAuditTimeline;

