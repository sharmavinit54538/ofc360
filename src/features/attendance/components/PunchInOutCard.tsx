import React, { useEffect, useMemo, useState } from 'react';
import { Clock, MapPin, Fingerprint, Navigation, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useToast } from '@/shared/ui/Toast';
import { cn } from '@/shared/lib/utils';
import {
  useGetTodayStatusQuery,
  usePunchInMutation,
  usePunchOutMutation,
} from '../api/attendanceApi';
import { punchInSchema, punchOutSchema } from '../schemas/attendance.schemas';
import type { WorkMode } from '../types/attendance.types';

const WORK_MODES: { id: WorkMode; label: string }[] = [
  { id: 'OFFICE', label: 'Office' },
  { id: 'WFM', label: 'Work From Home' },
  { id: 'FIELD', label: 'Field Duty' },
];

const formatElapsed = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${String(mins).padStart(2, '0')}m`;
};

const formatTime = (iso?: string): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export const PunchInOutCard: React.FC = () => {
  const toast = useToast();
  const { data: todayStatus, isLoading } = useGetTodayStatusQuery();
  const [punchIn, { isLoading: isPunchingIn }] = usePunchInMutation();
  const [punchOut, { isLoading: isPunchingOut }] = usePunchOutMutation();

  const [workMode, setWorkMode] = useState<WorkMode>('OFFICE');
  const [workNotes, setWorkNotes] = useState('');
  const [geoState, setGeoState] = useState<{ status: 'idle' | 'fetching' | 'ready' | 'denied'; coords?: GeolocationCoordinates }>({
    status: 'idle',
  });

  // Live elapsed timer ticking every 30 seconds while punched in
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!todayStatus?.isPunchedIn) return;
    const interval = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(interval);
  }, [todayStatus?.isPunchedIn]);

  const elapsedMinutes = useMemo(() => {
    if (!todayStatus?.isPunchedIn || !todayStatus.punchInTime) {
      return todayStatus?.totalWorkedMinutes ?? 0;
    }
    const punchedAt = new Date(todayStatus.punchInTime).getTime();
    return Math.max(0, Math.floor((now - punchedAt) / 60000));
  }, [todayStatus, now]);

  // Best-effort geolocation capture for punch metadata
  const captureLocation = () => {
    if (!navigator.geolocation) {
      setGeoState({ status: 'denied' });
      return;
    }
    setGeoState((prev) => ({ ...prev, status: 'fetching' }));
    navigator.geolocation.getCurrentPosition(
      (position) => setGeoState({ status: 'ready', coords: position.coords }),
      () => setGeoState({ status: 'denied' }),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePunchIn = async () => {
    const payload = {
      timestamp: new Date().toISOString(),
      workMode,
      ...(geoState.coords
        ? { latitude: geoState.coords.latitude, longitude: geoState.coords.longitude }
        : {}),
      deviceInfo: navigator.userAgent,
    };

    const validation = punchInSchema.safeParse(payload);
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || 'Invalid punch-in details', 'Validation Error');
      return;
    }

    try {
      await punchIn(payload).unwrap();
      toast.success(`Punched in at ${formatTime(payload.timestamp)} (${workMode.replace('WFM', 'WFH')})`, 'Shift Started');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to punch in. Please try again.', 'Punch-In Error');
    }
  };

  const handlePunchOut = async () => {
    const payload = {
      timestamp: new Date().toISOString(),
      workNotes: workNotes.trim() || undefined,
      ...(geoState.coords
        ? { latitude: geoState.coords.latitude, longitude: geoState.coords.longitude }
        : {}),
    };

    const validation = punchOutSchema.safeParse(payload);
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || 'Invalid punch-out details', 'Validation Error');
      return;
    }

    try {
      await punchOut(payload).unwrap();
      toast.success(`Punched out at ${formatTime(payload.timestamp)}. Total logged: ${formatElapsed(elapsedMinutes)}`, 'Shift Ended');
      setWorkNotes('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to punch out. Please try again.', 'Punch-Out Error');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-4">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  const isPunchedIn = todayStatus?.isPunchedIn ?? false;
  const isBusy = isPunchingIn || isPunchingOut;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 border border-blue-600 shadow-lg text-white space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Status block */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'w-2.5 h-2.5 rounded-full',
                isPunchedIn ? 'bg-emerald-300 animate-pulse' : 'bg-blue-200/70'
              )}
            />
            <h3 className="text-base font-bold">
              {isPunchedIn ? 'Currently Punched In' : todayStatus?.punchOutTime ? 'Shift Completed For Today' : 'Not Punched In Yet'}
            </h3>
            {todayStatus?.isLate && isPunchedIn && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-[10px] font-semibold text-amber-200">
                <AlertTriangle className="w-3 h-3" /> Late Arrival
              </span>
            )}
          </div>
          <p className="text-xs text-blue-100">
            {todayStatus?.assignedShift
              ? `Shift: ${todayStatus.assignedShift.name} • ${todayStatus.assignedShift.startTime} – ${todayStatus.assignedShift.endTime}`
              : 'No shift assigned for today'}
            {' • '}
            In: {formatTime(todayStatus?.punchInTime)} / Out: {formatTime(todayStatus?.punchOutTime)}
          </p>
          <p className="text-xs text-blue-100 font-semibold">
            Worked today: {formatElapsed(elapsedMinutes)}
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-3 shrink-0">
          {!isPunchedIn && !todayStatus?.punchOutTime && (
            <div className="inline-flex p-1 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold">
              {WORK_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setWorkMode(mode.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg transition-all',
                    workMode === mode.id
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-blue-100 hover:text-white'
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={captureLocation}
              disabled={geoState.status === 'fetching'}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-medium text-blue-100 hover:bg-white/20 hover:text-white transition-colors disabled:opacity-60"
            >
              <Navigation className={cn('w-3.5 h-3.5', geoState.status === 'fetching' && 'animate-spin')} />
              {geoState.status === 'ready'
                ? 'Location Attached'
                : geoState.status === 'denied'
                  ? 'Location Unavailable'
                  : 'Attach Location'}
            </button>

            {isPunchedIn ? (
              <Button
                variant="danger"
                size="md"
                onClick={handlePunchOut}
                isLoading={isBusy}
                leftIcon={<Clock className="w-4 h-4" />}
              >
                Punch Out
              </Button>
            ) : !todayStatus?.punchOutTime ? (
              <Button
                variant="primary"
                size="md"
                onClick={handlePunchIn}
                isLoading={isBusy}
                leftIcon={<Fingerprint className="w-4 h-4" />}
                className="bg-white text-blue-700 hover:bg-blue-50"
              >
                Punch In Now
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Optional work notes before punch-out */}
      {isPunchedIn && (
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-200" />
          <input
            type="text"
            value={workNotes}
            onChange={(e) => setWorkNotes(e.target.value)}
            placeholder="Optional: summarize today's work before punching out (max 500 chars)..."
            maxLength={500}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/15 focus:border-blue-300 text-white placeholder-blue-200 text-xs focus:outline-none transition-colors"
          />
        </div>
      )}
    </div>
  );
};

export default PunchInOutCard;
