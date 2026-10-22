import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Camera, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useFaceLoginMutation } from '@/features/auth/api/authApi';
import { useToast } from '@/shared/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { ROLE_DASHBOARD_ROUTES, normalizeAuthResponse, normalizeRole } from '@/features/auth/types/auth.types';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/features/auth/slices/authSlice';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface FaceLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export const FaceLoginModal: React.FC<FaceLoginModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const [faceLogin, { isLoading: isApiLoading }] = useFaceLoginMutation();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized, user } = useAuth();

  // Navigate when Redux auth state is fully initialized after successful face login
  useEffect(() => {
    if (pendingRedirect && isAuthenticated && isInitialized && user) {
      navigate(pendingRedirect, { replace: true });
      setPendingRedirect(null);
      onClose();
    }
  }, [pendingRedirect, isAuthenticated, isInitialized, user, navigate, onClose]);

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

  const startStream = useCallback(async () => {
    try {
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
        setError(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Camera access denied. Please allow camera permissions.';
      setError(errorMessage);
      toast.error(errorMessage, 'Camera Error');
      stopStream();
    }
  }, [toast, stopStream]);

  useEffect(() => {
    if (isOpen) {
      startStream();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isOpen, startStream, stopStream]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isStreamActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
  }, [isStreamActive]);

  const handleAutoCapture = useCallback(() => {
    setCountdown(3);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          captureFrame();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [captureFrame]);

  const handleCaptureAndLogin = useCallback(async () => {
    if (!capturedImage) {
      captureFrame();
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const base64Data = capturedImage.split(',')[1];
      const response = await faceLogin({ email: email || '', image: base64Data }).unwrap();
      const normalized = normalizeAuthResponse(response);

      toast.success(
        `Welcome back, ${normalized.user.fullName}!`,
        'Face Login Successful'
      );

      dispatch(
        setCredentials({
          user: normalized.user,
          tokens: normalized.tokens,
          rememberMe: true,
        })
      );

      const destination = ROLE_DASHBOARD_ROUTES[normalizeRole(normalized.user.activeRole)] || '/dashboard/employee';
      setPendingRedirect(destination);
    } catch (err: unknown) {
      const errorMsg =
        typeof err === 'object' && err !== null && 'data' in err && typeof (err as { data?: { message?: string } }).data?.message === 'string'
          ? (err as { data: { message: string } }).data.message
          : 'Face verification failed. Please try again or use password login.';
      setError(errorMsg);
      toast.error(errorMsg, 'Face Login Failed');
    } finally {
      setIsVerifying(false);
      setCapturedImage(null);
    }
  }, [capturedImage, captureFrame, email, faceLogin, toast, dispatch, navigate, onClose]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    stopStream();
    setCapturedImage(null);
    setIsVerifying(false);
    setError(null);
    setCountdown(null);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    onClose();
  }, [stopStream, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#171717] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in border border-gray-200 dark:border-zinc-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-[#ececec]">Quick Face Unlock</h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={isVerifying || isApiLoading}
            className="p-1.5 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative p-4">
          <div className="relative aspect-video bg-gray-900 dark:bg-gray-950 rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              aria-label="Camera preview for face login"
            />
            {!isStreamActive && !capturedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-zinc-400 bg-gray-900/50 dark:bg-gray-950/50">
                <Camera className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm">Initializing camera...</p>
              </div>
            )}

            {!capturedImage && isStreamActive && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 640 480">
                <defs>
                  <clipPath id="face-oval">
                    <ellipse cx="320" cy="210" rx="120" ry="150" />
                  </clipPath>
                </defs>
                <rect
                  width="640"
                  height="480"
                  fill="black"
                  fill-opacity="0.5"
                  clipPath="url(#face-oval)"
                  clip-rule="evenodd"
                />
                <ellipse
                  cx="320"
                  cy="210"
                  rx="120"
                  ry="150"
                  stroke="#22d3ee"
                  stroke-width="3"
                  fill="none"
                  className="animate-pulse"
                />
                <path
                  d="M200 210 L185 210 M440 210 L455 210 M320 60 L320 45 M320 375 L320 360"
                  stroke="#22d3ee"
                  stroke-width="3"
                  fill="none"
                />
              </svg>
            )}

            {countdown !== null && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-black/80 text-white flex items-center justify-center text-4xl font-bold animate-pulse">
                  {countdown}
                </div>
              </div>
            )}

            {capturedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 dark:bg-gray-950/90">
                <img
                  src={capturedImage}
                  alt="Captured face"
                  className="w-48 h-48 rounded-full object-cover border-4 border-emerald-400 shadow-xl"
                />
                <p className="mt-3 text-sm text-gray-300 dark:text-zinc-300">Face captured</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="px-4 pb-4 space-y-3">
          {!capturedImage ? (
            <div className="space-y-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleAutoCapture}
                disabled={!isStreamActive || isVerifying || isApiLoading}
                leftIcon={<Camera className="w-4 h-4" />}
              >
                {countdown !== null ? `Capturing in ${countdown}...` : 'Capture & Login'}
              </Button>
              <p className="text-center text-xs text-gray-600 dark:text-zinc-400">
                Position your face within the cyan frame. Auto-captures in 3 seconds.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleCaptureAndLogin}
                disabled={isVerifying || isApiLoading}
                isLoading={isVerifying || isApiLoading}
                leftIcon={!isVerifying ? <CheckCircle2 className="w-4 h-4" /> : undefined}
              >
                Verify & Login
              </Button>
              <Button
                variant="ghost"
                size="md"
                className="w-full"
                onClick={handleRetake}
                disabled={isVerifying || isApiLoading}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Retake Photo
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
            onClick={handleClose}
            disabled={isVerifying || isApiLoading}
          >
            Use Password Instead
          </Button>
        </div>
      </div>
    </div>
  );
};