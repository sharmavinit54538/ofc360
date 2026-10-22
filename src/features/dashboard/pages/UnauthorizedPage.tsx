import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, LogIn } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { ROLE_DASHBOARD_ROUTES, UserRole, normalizeRole } from '@/features/auth/types/auth.types';

export const UnauthorizedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole, switchRole } = useAuth();

  const state = location.state as {
    from?: { pathname: string };
    currentRole?: UserRole;
    allowedRoles?: UserRole[];
    homeRoute?: string;
  } | null;

  const allowedRoles = state?.allowedRoles || [];
  const homeRoute = activeRole ? ROLE_DASHBOARD_ROUTES[normalizeRole(activeRole)] : '/auth/login';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient red glow */}
      <div className="absolute top-1/3 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg p-8 rounded-3xl bg-slate-900/80 border border-rose-500/30 backdrop-blur-xl shadow-2xl space-y-6 text-center relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-xl shadow-rose-950/40">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
            HTTP 403 Forbidden &bull; RBAC Clearance Required
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Access Denied</h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            You do not possess the required clearance or administrative privileges to view this section of the OFC360 workspace.
          </p>
        </div>

        {/* Role Comparison Matrix Card */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Your Current Active Role:</span>
            {activeRole ? (
              <Badge role={activeRole}>{activeRole}</Badge>
            ) : (
              <span className="font-mono text-slate-400 text-xs">Unassigned</span>
            )}
          </div>

          {allowedRoles.length > 0 && (
            <div className="flex items-start justify-between text-xs pt-2 border-t border-slate-800/80">
              <span className="text-slate-400">Allowed Roles for this Module:</span>
              <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                {allowedRoles.map((r) => (
                  <Badge key={r} role={r} size="sm">
                    {r}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {state?.from?.pathname && (
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
              <span className="text-slate-400">Attempted Route:</span>
              <code className="text-rose-300 bg-rose-950/40 px-2 py-0.5 rounded text-[11px] font-mono">
                {state.from.pathname}
              </code>
            </div>
          )}
        </div>

        {/* Demo Fast-Switch Option (Allows the user to promote their test role) */}
        {allowedRoles.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-brand-500/30 text-left space-y-2">
            <div className="text-[11px] font-semibold text-brand-300">
              Interactive Test: Switch to an Authorized Role:
            </div>
            <div className="flex flex-wrap gap-2">
              {allowedRoles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    switchRole(r);
                    if (state?.from?.pathname) {
                      navigate(state.from.pathname);
                    } else {
                      navigate(ROLE_DASHBOARD_ROUTES[r]);
                    }
                  }}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-brand-600/30 hover:bg-brand-600/60 border border-brand-500/50 text-brand-200 font-medium transition-colors"
                >
                  Switch to {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => navigate(homeRoute)}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Go to My Home Dashboard
          </Button>

          <Button
            variant="outline"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => navigate('/auth/login')}
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            Sign In with Another Account
          </Button>
        </div>
      </div>
    </div>
  );
};
