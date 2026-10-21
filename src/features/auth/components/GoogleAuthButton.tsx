import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLoginMutation } from '@/features/auth/api/authApi';
import { useToast } from '@/shared/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { ROLE_DASHBOARD_ROUTES } from '@/features/auth/types/auth.types';

interface GoogleAuthButtonProps {
  label?: string;
  onSuccess?: () => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  label = 'Continue with Google Workspace',
  onSuccess,
}) => {
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [login] = useLoginMutation();
  const toast = useToast();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsAuthorizing(true);
    try {
      // Simulate Google OAuth popup handshake
      await new Promise((resolve) => setTimeout(resolve, 600));

      const result = await login({
        email: 'alexandra.vance@ofc360.com',
        provider: 'google',
        googleToken: `mock_google_oauth_token_${Date.now()}`,
      }).unwrap();

      toast.success(
        `Authenticated as ${result.user.fullName} (${result.user.activeRole})`,
        'Single Sign-On Success'
      );

      if (onSuccess) {
        onSuccess();
      } else {
        const dest = ROLE_DASHBOARD_ROUTES[result.user.activeRole] || '/dashboard/employee';
        navigate(dest);
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || 'Failed to authenticate via Google Workspace SSO',
        'SSO Error'
      );
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isAuthorizing}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.99]"
    >
      {isAuthorizing ? (
        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
      ) : (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.16z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.43 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.57 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      )}
      <span>{label}</span>
    </button>
  );
};
