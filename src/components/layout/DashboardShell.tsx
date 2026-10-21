import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  LogOut,
  Shield,
  Users,
  Briefcase,
  UserCheck,
  Server,
  Layers,
  ChevronDown,
  Bell,
  Search,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';
import { UserRole, ROLE_DASHBOARD_ROUTES } from '@/features/auth/types/auth.types';
import { useToast } from '@/components/ui/Toast';

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  roleBadgeText?: string;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  title,
  subtitle,
}) => {
  const { user, activeRole, switchRole, logout } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setRoleMenuOpen(false);
    toast.info(`Active role switched to ${newRole}`, 'RBAC Context Updated');
    navigate(ROLE_DASHBOARD_ROUTES[newRole]);
  };

  const handleLogout = async () => {
    await logout();
    toast.success('You have been securely signed out', 'Session Terminated');
    navigate('/auth/login');
  };

  const roleNavItems = [
    { role: 'SUPER_ADMIN' as UserRole, label: 'Super Admin Portal', path: '/dashboard/super-admin', icon: Shield },
    { role: 'HR_ADMIN' as UserRole, label: 'HR Admin Portal', path: '/dashboard/hr-admin', icon: Users },
    { role: 'MANAGER' as UserRole, label: 'Manager Workspace', path: '/dashboard/manager', icon: Briefcase },
    { role: 'EMPLOYEE' as UserRole, label: 'Employee Self-Service', path: '/dashboard/employee', icon: UserCheck },
    { role: 'IT_ADMIN' as UserRole, label: 'IT & Security Portal', path: '/dashboard/it-admin', icon: Server },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        {/* Brand & Platform Tag */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-md shadow-brand-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">
                  OFC<span className="text-brand-400">360</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase">
                  RBAC Console
                </span>
              </div>
            </div>
          </Link>

          {/* Quick Role Portal Nav */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-800">
            {roleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.role}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.role.replace('_', ' ')}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Controls: Search, Notifications, User profile & Role switcher */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400 w-64">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search policies, staff, logs...</span>
          </div>

          <button
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
          </button>

          {/* Active Role Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-700/80 bg-slate-850 hover:bg-slate-800 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-brand-600/30 border border-brand-500/40 flex items-center justify-center font-bold text-xs text-brand-300">
                {user?.firstName?.[0] || 'U'}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white leading-none">
                  {user?.fullName || 'Authenticated User'}
                </div>
                <div className="text-[10px] text-slate-400 pt-0.5">
                  Role: <span className="text-brand-300 font-semibold">{activeRole}</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Active RBAC Role
                  </p>
                  <p className="text-xs text-slate-300 truncate">{user?.email}</p>
                </div>

                <div className="space-y-1">
                  {(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleSwitch(r)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        activeRole === r
                          ? 'bg-brand-500/20 text-brand-200 border border-brand-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" />
                        {r.replace('_', ' ')}
                      </span>
                      {activeRole === r && (
                        <span className="text-[10px] font-bold text-brand-400">ACTIVE</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-800/80 mt-2 pt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
              {activeRole && <Badge role={activeRole}>{activeRole}</Badge>}
            </div>
            {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/auth/login"
              className="text-xs font-medium px-3 py-2 rounded-xl border border-slate-800 hover:bg-slate-850 text-slate-300"
            >
              Auth Landing
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {children}
      </main>
    </div>
  );
};
