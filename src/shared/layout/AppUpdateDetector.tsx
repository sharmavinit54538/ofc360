import React, { useEffect, useRef, useState, useCallback } from 'react';
import { APP_VERSION } from '@/app/version';
import { AppUpdateScreen } from './AppUpdateScreen';

interface AppUpdateDetectorProps {
  children: React.ReactNode;
  checkInterval?: number;
  versionEndpoint?: string;
}

export const AppUpdateDetector: React.FC<AppUpdateDetectorProps> = ({
  children,
  checkInterval = 5 * 60 * 1000,
  versionEndpoint = '/version.json',
}) => {
  const [showUpdateScreen, setShowUpdateScreen] = useState(false);
  const currentVersionRef = useRef(APP_VERSION);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCheckingRef = useRef(false);
  const hasShownUpdateRef = useRef(false);
  const mountedRef = useRef(true);

  const checkForUpdates = useCallback(async () => {
    if (isCheckingRef.current || !mountedRef.current || hasShownUpdateRef.current) {
      return;
    }

    isCheckingRef.current = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(versionEndpoint, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!mountedRef.current) return;

      if (response.ok) {
        const data = await response.json();
        const serverVersion = data.version || data.appVersion || data.buildVersion;

        if (serverVersion && serverVersion !== currentVersionRef.current) {
          console.log('[AppUpdateDetector] New version detected:', {
            current: currentVersionRef.current,
            server: serverVersion,
          });
          hasShownUpdateRef.current = true;
          setShowUpdateScreen(true);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('[AppUpdateDetector] Version check timed out');
      } else if (error instanceof Error && error.name !== 'TypeError') {
        console.warn('[AppUpdateDetector] Version check failed:', error.message);
      }
    } finally {
      isCheckingRef.current = false;
    }
  }, [versionEndpoint]);

  const handleUpdate = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Clear any service worker caches if present
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((reg) => reg.unregister()));
      }
      
      // Clear application caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
    } catch {
      // Ignore cache clearing errors
    }
    
    // Force reload the page to get the latest version
    window.location.reload();
  }, []);

  const handleDismiss = useCallback(() => {
    setShowUpdateScreen(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    hasShownUpdateRef.current = false;

    checkForUpdates();

    intervalRef.current = setInterval(checkForUpdates, checkInterval);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !hasShownUpdateRef.current) {
        checkForUpdates();
      }
    };

    const handleFocus = () => {
      if (!hasShownUpdateRef.current) {
        checkForUpdates();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkForUpdates, checkInterval]);

  if (showUpdateScreen) {
    return (
      <AppUpdateScreen
        onUpdate={handleUpdate}
        onDismiss={handleDismiss}
      />
    );
  }

  return <>{children}</>;
};

export default AppUpdateDetector;