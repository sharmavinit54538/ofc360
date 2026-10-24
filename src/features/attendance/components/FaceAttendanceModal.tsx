import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Camera, CheckCircle2, AlertCircle, RotateCcw, ScanFace, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { cn } from '@/shared/lib/utils';
import { parseFaceImage } from '../api/attendanceApi';

export interface FaceAttendanceResult {
  photoDataUrl: string;
  cleanBase64?: string;
  blob?: Blob;
  verifiedAt: string;
}

interface FaceAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'IN' | 'OUT';
  onVerified: (result: FaceAttendanceResult) => Promise<void> | void;
  workMode?: string;
  hasLocation?: boolean;
}

export const FaceAttendanceModal: React.FC<FaceAttendanceModalProps> = ({
  isOpen,
  onClose,
  action,
  onVerified,
  workMode = 'OFFICE',
  hasLocation = false,
}) => {
  const toast = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreamActive, setIsStreamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Stop camera stream safely
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreamActive(false);
  }, []);

  // Start front camera stream
  const startStream = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreamActive(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Camera access denied or unavailable.';
      setError(msg);
      toast.error(msg, 'Camera Access Issue');
      stopStream();
    }
  }, [toast, stopStream]);

  // Lifecycle when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setCapturedImage(null);
      setError(null);
      startStream();
    } else {
      stopStream();
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }
    return () => {
      stopStream();
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [isOpen, startStream, stopStream]);

  // Capture video frame to canvas
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current || !isStreamActive) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    return dataUrl;
  }, [isStreamActive]);

  // Confirm attendance with the captured face
  const handleConfirmFace = useCallback(async (imageOverride?: string) => {
    const finalImage = imageOverride || capturedImage || captureFrame();
    if (!finalImage) {
      toast.warning('Please align your face and capture photo first.', 'Capture Required');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const parsed = parseFaceImage(finalImage);

      // Perform biometrics verification and punch action via onVerified
      await onVerified({
        photoDataUrl: finalImage,
        cleanBase64: parsed.cleanBase64,
        blob: parsed.blob,
        verifiedAt: new Date().toISOString(),
      });

      setIsSuccess(true);
      toast.success(
        action === 'IN' ? 'Face Verified! Shift Started.' : 'Face Verified! Shift Ended.',
        'Attendance Recorded'
      );

      // Brief delay to display success animation before closing
      setTimeout(() => {
        stopStream();
        onClose();
      }, 900);
    } catch (err: any) {
      const errorMsg =
        err?.data?.message ||
        err?.data?.detail ||
        err?.message ||
        'Biometric verification failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg, 'Verification Error');
      setIsSuccess(false);
    } finally {
      setIsVerifying(false);
    }
  }, [capturedImage, captureFrame, action, onVerified, toast, stopStream, onClose]);

  // Auto 3-second countdown capture
  const handleAutoCapture = useCallback(() => {
    setCountdown(3);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          const captured = captureFrame();
          if (captured) {
            handleConfirmFace(captured);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [captureFrame, handleConfirmFace]);

  const handleRetake = () => {
    setCapturedImage(null);
    setIsSuccess(false);
    setError(null);
    if (!isStreamActive) {
      startStream();
    }
  };

  const handleClose = () => {
    stopStream();
    setCapturedImage(null);
    setIsVerifying(false);
    setIsSuccess(false);
    setError(null);
    setCountdown(null);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    onClose();
  };

  // Fallback direct punch without camera if user's device lacks a webcam
  const handleManualFallback = async () => {
    setIsVerifying(true);
    try {
      await onVerified({
        photoDataUrl: '',
        verifiedAt: new Date().toISOString(),
      });
      toast.info('Attendance recorded without camera verification.', 'Manual Override');
      handleClose();
    } catch (err: any) {
      toast.error('Failed to record attendance.', 'Error');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ScanFace className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                  Face Attendance
                </h3>
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                    action === 'IN'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  )}
                >
                  {action === 'IN' ? 'Punch In' : 'Punch Out'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                Biometric facial scan for shift attendance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isVerifying}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Scanner Viewport */}
        <div className="p-5 flex flex-col items-center">
          <div className="relative w-full aspect-[4/3] bg-gray-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            {/* Live Video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                'w-full h-full object-cover',
                capturedImage ? 'hidden' : 'block'
              )}
            />

            {/* Frozen Captured Image */}
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured Face"
                className="w-full h-full object-cover"
              />
            )}

            {/* Hidden Canvas for Frame Capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Initializing / Error State */}
            {!isStreamActive && !capturedImage && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-950/80">
                <Camera className="w-10 h-10 mb-2 opacity-60 animate-pulse" />
                <p className="text-xs font-medium">Activating camera sensor...</p>
              </div>
            )}

            {error && !isStreamActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gray-950/90 text-rose-400">
                <AlertCircle className="w-10 h-10 mb-2 text-rose-500" />
                <p className="text-xs font-semibold">{error}</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Ensure camera permissions are allowed in browser settings.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualFallback}
                  className="mt-4 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  Record Attendance Without Camera
                </Button>
              </div>
            )}

            {/* Biometric Oval Face Guide & Scanning Laser */}
            {isStreamActive && !capturedImage && !isSuccess && (
              <>
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 640 480"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <clipPath id="face-attend-oval">
                      <ellipse cx="320" cy="240" rx="130" ry="165" />
                    </clipPath>
                  </defs>
                  {/* Shaded backdrop outside oval */}
                  <rect
                    width="640"
                    height="480"
                    fill="black"
                    fillOpacity="0.5"
                    clipPath="url(#face-attend-oval)"
                    clipRule="evenodd"
                  />
                  {/* Glowing oval guide */}
                  <ellipse
                    cx="320"
                    cy="240"
                    rx="130"
                    ry="165"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8 6"
                    className="animate-pulse"
                  />
                </svg>

                {/* Animated Horizontal Laser Scan Line */}
                <div className="absolute inset-x-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-bounce pointer-events-none" />

                {/* Status Badge Over Camera */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Liveness Ready
                  </span>
                  {hasLocation && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/70 text-white backdrop-blur-md font-medium">
                      <MapPin className="w-3 h-3 text-blue-200" />
                      GPS Locked
                    </span>
                  )}
                </div>

                {/* Instruction Pill */}
                <div className="absolute bottom-3 inset-x-4 text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-black/60 text-blue-200 text-xs backdrop-blur-md border border-white/10">
                    Align your face inside the frame
                  </span>
                </div>
              </>
            )}

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs">
                <span className="text-7xl font-black text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] animate-ping">
                  {countdown}
                </span>
              </div>
            )}

            {/* Success Overlay */}
            {isSuccess && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/80 backdrop-blur-sm text-white animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-2 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <p className="text-base font-bold text-emerald-300">Face Verified ✓</p>
                <p className="text-xs text-emerald-200/80 mt-0.5">Punch record confirmed</p>
              </div>
            )}
          </div>

          {/* Environmental context info */}
          <div className="w-full mt-3 flex items-center justify-between px-1 text-xs text-gray-500 dark:text-zinc-400">
            <span>Mode: <strong className="text-gray-800 dark:text-gray-200">{workMode}</strong></span>
            <span>Security: <strong className="text-blue-600 dark:text-blue-400">Biometric Encrypted</strong></span>
          </div>

          {/* Action Buttons */}
          <div className="w-full mt-5 flex items-center gap-2">
            {!capturedImage ? (
              <>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleAutoCapture}
                  disabled={!isStreamActive || countdown !== null || isVerifying}
                  leftIcon={<Sparkles className="w-4 h-4 text-blue-500" />}
                  className="flex-1 text-xs font-semibold"
                >
                  Auto Scan (3s)
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    const pic = captureFrame();
                    if (pic) handleConfirmFace(pic);
                  }}
                  disabled={!isStreamActive || isVerifying}
                  leftIcon={<Camera className="w-4 h-4" />}
                  className="flex-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
                >
                  Scan & Punch
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleRetake}
                  disabled={isVerifying || isSuccess}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                  className="flex-1 text-xs"
                >
                  Retake Photo
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleConfirmFace()}
                  isLoading={isVerifying}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  className="flex-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25"
                >
                  Confirm & Submit
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceAttendanceModal;
