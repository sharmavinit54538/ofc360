import React, { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  MapPin,
  ScanFace,
  Navigation,
  AlertTriangle,
  Building2,
  Home,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
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
import { FaceAttendanceModal, type FaceAttendanceResult } from './FaceAttendanceModal';

const WORK_MODES: { id: WorkMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'OFFICE', label: 'Office', icon: Building2 },
  { id: 'WFM', label: 'WFH', icon: Home },
  { id: 'FIELD', label: 'Field Duty', icon: Briefcase },
];

const formatElapsed = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${String(mins).padStart(2, '0')}m`;
};

const formatTime = (iso?: string | null): string => {
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
  const [faceModalAction, setFaceModalAction] = useState<'IN' | 'OUT' | null>(null);
  const [geoState, setGeoState] = useState<{
    status: 'idle' | 'fetching' | 'ready' | 'denied';
    coords?: GeolocationCoordinates;
  }>({
    status: 'idle',
  });

  // Live real-time clock ticking every second
  const [currentTime, setCurrentTime] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const punchInTime = todayStatus?.punchInTime || todayStatus?.checkInTime || todayStatus?.punchIn;
  const punchOutTime = todayStatus?.punchOutTime || todayStatus?.checkOutTime || todayStatus?.punchOut;
  const isPunchedIn = Boolean(todayStatus?.isPunchedIn || todayStatus?.isCheckedIn);

  // Elapsed minutes calculation
  const elapsedMinutes = useMemo(() => {
    if (!isPunchedIn || !punchInTime) {
      return todayStatus?.totalWorkedMinutes ?? (todayStatus?.totalHours ? Math.round(todayStatus.totalHours * 60) : 0);
    }
    const punchedAt = new Date(punchInTime).getTime();
    return Math.max(0, Math.floor((currentTime.getTime() - punchedAt) / 60000));
  }, [isPunchedIn, punchInTime, todayStatus, currentTime]);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setGeoState({ status: 'denied' });
      toast.warning('Geolocation is not supported by your browser');
      return;
    }
    setGeoState((prev) => ({ ...prev, status: 'fetching' }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoState({ status: 'ready', coords: position.coords });
        toast.success('GPS Location verified & attached');
      },
      () => {
        setGeoState({ status: 'denied' });
        toast.info('Location access denied or unavailable');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePunchIn = async (faceData?: FaceAttendanceResult) => {
    const payload = {
      timestamp: faceData?.verifiedAt || new Date().toISOString(),
      workMode,
      ...(geoState.coords
        ? { latitude: geoState.coords.latitude, longitude: geoState.coords.longitude }
        : {}),
      ...(faceData?.photoDataUrl
        ? {
            faceImage: faceData.photoDataUrl,
            photoDataUrl: faceData.photoDataUrl,
            image: faceData.photoDataUrl,
            face_image: faceData.photoDataUrl,
            cleanBase64: faceData.cleanBase64,
          }
        : {}),
      deviceInfo: navigator.userAgent,
    };

    const validation = punchInSchema.safeParse(payload);
    if (!validation.success) {
      const msg = validation.error.issues[0]?.message || 'Invalid punch-in details';
      toast.error(msg, 'Validation Error');
      throw new Error(msg);
    }

    try {
      await punchIn(payload).unwrap();
      if (!faceData) {
        toast.success(
          `Punched in at ${formatTime(payload.timestamp)} (${workMode === 'WFM' ? 'Work From Home' : workMode})`,
          'Shift Started'
        );
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.data?.detail || 'Failed to punch in. Please try again.';
      if (!faceData) {
        toast.error(msg, 'Punch-In Error');
      }
      throw err;
    }
  };

  const handlePunchOut = async (faceData?: FaceAttendanceResult) => {
    const payload = {
      timestamp: faceData?.verifiedAt || new Date().toISOString(),
      workNotes: workNotes.trim() || undefined,
      ...(geoState.coords
        ? { latitude: geoState.coords.latitude, longitude: geoState.coords.longitude }
        : {}),
      ...(faceData?.photoDataUrl
        ? {
            faceImage: faceData.photoDataUrl,
            photoDataUrl: faceData.photoDataUrl,
            image: faceData.photoDataUrl,
            face_image: faceData.photoDataUrl,
            cleanBase64: faceData.cleanBase64,
          }
        : {}),
    };

    const validation = punchOutSchema.safeParse(payload);
    if (!validation.success) {
      const msg = validation.error.issues[0]?.message || 'Invalid punch-out details';
      toast.error(msg, 'Validation Error');
      throw new Error(msg);
    }

    try {
      await punchOut(payload).unwrap();
      setWorkNotes('');
      if (!faceData) {
        toast.success(
          `Punched out at ${formatTime(payload.timestamp)}. Total logged: ${formatElapsed(elapsedMinutes)}`,
          'Shift Ended'
        );
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.data?.detail || 'Failed to punch out. Please try again.';
      if (!faceData) {
        toast.error(msg, 'Punch-Out Error');
      }
      throw err;
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

  const isShiftCompleted = Boolean(punchOutTime && !isPunchedIn);
  const isBusy = isPunchingIn || isPunchingOut;

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedLiveClock = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-900 border border-blue-500/30 text-white shadow-xl p-5 md:p-6 transition-all duration-200">
      {/* Decorative ambient backdrop */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-10 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-5">
        {/* Top Header Row: Live Clock, Punch Status & Shift Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/15">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-white backdrop-blur-md shrink-0">
              <Clock className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-extrabold tracking-tight font-mono text-white">
                  {formattedLiveClock}
                </span>
                <span className="text-xs text-blue-200 font-medium bg-white/10 px-2 py-0.5 rounded-md">
                  {formattedDate}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    isPunchedIn
                      ? 'bg-emerald-300 animate-pulse'
                      : isShiftCompleted
                        ? 'bg-blue-300'
                        : 'bg-amber-300'
                  )}
                />
                <span className="text-xs font-semibold text-blue-100">
                  {isPunchedIn
                    ? 'Currently Punched In (Active)'
                    : isShiftCompleted
                      ? 'Shift Completed For Today'
                      : 'Not Punched In Yet'}
                </span>
                {todayStatus?.isLate && isPunchedIn && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-[10px] font-semibold text-amber-200">
                    <AlertTriangle className="w-3 h-3" /> Late Arrival
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Pill Strip */}
          <div className="grid grid-cols-3 gap-2 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/15 text-center text-xs">
            <div className="px-2 py-1 border-r border-white/15">
              <span className="text-[10px] text-blue-200 block font-medium">Punch In</span>
              <span className="font-bold text-white text-xs md:text-sm">
                {formatTime(punchInTime)}
              </span>
            </div>
            <div className="px-2 py-1 border-r border-white/15">
              <span className="text-[10px] text-blue-200 block font-medium">Punch Out</span>
              <span className="font-bold text-white text-xs md:text-sm">
                {formatTime(punchOutTime)}
              </span>
            </div>
            <div className="px-2 py-1">
              <span className="text-[10px] text-blue-200 block font-medium">Worked Today</span>
              <span className="font-bold text-emerald-300 text-xs md:text-sm">
                {formatElapsed(elapsedMinutes)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Action Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Work Mode Selector (Office / WFH / Field) */}
          {!isPunchedIn && !isShiftCompleted ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs text-blue-200 font-medium">Work Mode:</span>
              <div className="inline-flex p-1 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md">
                {WORK_MODES.map((mode) => {
                  const ModeIcon = mode.icon;
                  const isSelected = workMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setWorkMode(mode.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                        isSelected
                          ? 'bg-white text-blue-800 shadow-sm'
                          : 'text-blue-100 hover:text-white hover:bg-white/10'
                      )}
                    >
                      <ModeIcon className="w-3.5 h-3.5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-xs text-blue-100 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 font-medium">
                {todayStatus?.assignedShift
                  ? `Shift: ${todayStatus.assignedShift.name} (${todayStatus.assignedShift.startTime} – ${todayStatus.assignedShift.endTime})`
                  : 'Standard Shift: 09:00 AM – 06:00 PM'}
              </span>
            </div>
          )}

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={captureLocation}
              disabled={geoState.status === 'fetching'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all backdrop-blur-md disabled:opacity-60"
            >
              <Navigation
                className={cn('w-3.5 h-3.5 text-blue-200', geoState.status === 'fetching' && 'animate-spin')}
              />
              <span className="whitespace-nowrap">
                {geoState.status === 'ready'
                  ? 'Location Attached'
                  : geoState.status === 'denied'
                    ? 'Location Denied'
                    : 'Attach Location'}
              </span>
              {geoState.status === 'ready' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              )}
            </button>

            {isPunchedIn ? (
              <Button
                variant="danger"
                size="md"
                onClick={() => setFaceModalAction('OUT')}
                isLoading={isBusy}
                leftIcon={<ScanFace className="w-4 h-4" />}
                className="whitespace-nowrap font-bold px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white border-0 shadow-lg text-sm"
              >
                Punch Out (Face ID)
              </Button>
            ) : !isShiftCompleted ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setFaceModalAction('IN')}
                isLoading={isBusy}
                leftIcon={<ScanFace className="w-4 h-4 text-blue-600" />}
                className="whitespace-nowrap font-bold px-6 py-2.5 bg-white text-blue-800 hover:bg-blue-50 border-0 shadow-lg text-sm"
              >
                Punch In (Face ID)
              </Button>
            ) : (
              <div className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-400/30">
                ✓ Attendance Recorded
              </div>
            )}
          </div>
        </div>

        {/* Optional work notes input when punched in */}
        {isPunchedIn && (
          <div className="relative pt-1">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-200 pointer-events-none" />
            <input
              type="text"
              value={workNotes}
              onChange={(e) => setWorkNotes(e.target.value)}
              placeholder="Optional: summarize work accomplished today before punching out..."
              maxLength={500}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-white/50 text-white placeholder:text-blue-200 text-xs focus:outline-none transition-colors"
            />
          </div>
        )}
      </div>

      {/* Biometric Face Attendance Modal */}
      <FaceAttendanceModal
        isOpen={faceModalAction !== null}
        action={faceModalAction || 'IN'}
        onClose={() => setFaceModalAction(null)}
        workMode={workMode}
        hasLocation={geoState.status === 'ready'}
        onVerified={async (faceResult) => {
          if (faceModalAction === 'IN') {
            await handlePunchIn(faceResult);
          } else {
            await handlePunchOut(faceResult);
          }
        }}
      />
    </div>
  );
};

export default PunchInOutCard;
