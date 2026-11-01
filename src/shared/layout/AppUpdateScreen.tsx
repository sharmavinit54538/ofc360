import React from 'react';
import { Loader2, RotateCcw, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROLE_DASHBOARD_ROUTES, normalizeRole } from '@/features/auth/types/auth.types';

interface AppUpdateScreenProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

export const AppUpdateScreen: React.FC<AppUpdateScreenProps> = ({ onUpdate, onDismiss }) => {
  const navigate = useNavigate();
  const { activeRole, role, user } = useAuth();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdateClick = async () => {
    setIsUpdating(true);
    try {
      // Call the onUpdate callback which handles the actual reload
      onUpdate();
    } catch {
      // Fallback: simple reload
      window.location.reload();
    }
  };

  const handleBackToHome = () => {
    // Determine the correct dashboard route based on user's role
    const storedRole =
      typeof window !== 'undefined'
        ? localStorage.getItem('ofc360_active_role') || sessionStorage.getItem('ofc360_active_role')
        : null;
    const effectiveRole =
      activeRole ||
      role ||
      user?.activeRole ||
      (user as any)?.role ||
      (user?.roles && user.roles[0]) ||
      storedRole ||
      'EMPLOYEE';
    const canonicalRole = normalizeRole(effectiveRole);
    const destination = ROLE_DASHBOARD_ROUTES[canonicalRole] || '/dashboard/employee';
    navigate(destination, { replace: true });
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-sm p-4">
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Update Card */}
      <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in duration-300">
        {/* Card container */}
        <div className="bg-slate-900/90 dark:bg-slate-900/95 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="p-8 space-y-6 text-center">
            {/* Update Icon */}
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center shadow-lg">
                <div className="relative">
                  <RotateCcw className="w-10 h-10 text-blue-400" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                    <RefreshCw className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              {/* Pulsing ring */}
              <div className="absolute inset-0 w-20 h-20 rounded-2xl border-2 border-blue-500/30 animate-ping opacity-75" />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">App Update Available</h1>
              <p className="text-slate-300 leading-relaxed text-base">
                A new version of OFC360 has been deployed. Please refresh to load the latest features and updates.
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-2">
              {/* Primary: Update & Refresh Now */}
              <button
                type="button"
                onClick={handleUpdateClick}
                disabled={isUpdating}
                className={`
                  w-full py-3.5 px-6 rounded-xl font-semibold text-base
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  hover:from-blue-500 hover:to-indigo-500
                  text-white shadow-lg shadow-blue-500/25
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 active:scale-[0.98]
                  flex items-center justify-center gap-2
                `}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Update & Refresh Now</span>
                  </>
                )}
              </button>

              {/* Secondary: Back to Home */}
              <button
                type="button"
                onClick={handleBackToHome}
                disabled={isUpdating}
                className={`
                  w-full py-3.5 px-6 rounded-xl font-semibold text-base
                  bg-slate-800/50 hover:bg-slate-800
                  border border-slate-700 hover:border-slate-600
                  text-slate-200 hover:text-white
                  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 active:scale-[0.98]
                  flex items-center justify-center gap-2
                `}
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
            </div>

            {/* Subtle footer note */}
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">
              OFC360 Enterprise Platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppUpdateScreen;