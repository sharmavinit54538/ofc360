import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/ui/Toast';
import { Badge } from '@/shared/ui/Badge';
import { useTheme } from '@/shared/context/ThemeContext';

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  sidebar?: React.ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  title,
  subtitle,
  sidebar,
  sidebarCollapsed: _sidebarCollapsed = false,
  onSidebarToggle: _onSidebarToggle,
}) => {
  const { user, activeRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (name?: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    toast.success('You have been securely signed out', 'Session Terminated');
    navigate('/auth/login');
    setProfileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#212121] text-gray-900 dark:text-[#ececec] flex transition-colors duration-200">
      {/* Sidebar: Rendered full-height on the left when provided */}
      {sidebar && (
        <div className="z-30 transition-all duration-300 ease-in-out shrink-0">
          {sidebar}
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar - Clean & Minimal */}
        <header className="h-16 border-b border-gray-200 dark:border-zinc-800 bg-white/95 dark:bg-[#171717]/95 backdrop-blur sticky top-0 z-40 flex items-center justify-between px-4 md:px-6">
          {/* Left: Brand logo only for pages without a sidebar */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {!sidebar && (
              <Link to="/" className="flex items-center gap-3 flex-shrink-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-md shadow-brand-500/20">
                  <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[10px] flex items-center justify-center border border-gray-200 dark:border-zinc-800">
                    <Building2 className="w-5 h-5 text-brand-400" />
                  </div>
                </div>
                <span className="font-bold text-gray-900 dark:text-[#ececec] text-base hidden sm:block">
                  OFC<span className="text-brand-400">360</span>
                </span>
              </Link>
            )}
          </div>

          {/* Right Controls: Search, Notifications, User Profile Menu */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end min-w-0">
            {/* Search */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#2f2f2f] border border-gray-200 dark:border-zinc-800 text-xs text-gray-600 dark:text-zinc-400 w-56 md:w-64 flex-shrink-0">
              <Search className="w-3.5 h-3.5 text-gray-600 dark:text-zinc-400" />
              <span className="truncate">Search...</span>
            </div>

            {/* Notifications */}
            <button
              type="button"
              className="p-2 rounded-xl text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-[#ececec] hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition-colors relative flex-shrink-0"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative flex-shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-100 dark:bg-[#2f2f2f] hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
                aria-expanded={profileMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-600/30 border border-brand-500/40 flex items-center justify-center font-bold text-sm text-brand-300">
                  {getInitials(user?.fullName)}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-[#ececec]">
                  {getInitials(user?.fullName)}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-600/30 border border-brand-500/40 flex items-center justify-center font-bold text-base text-brand-300">
                        {user?.firstName?.[0] || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-[#ececec] truncate">{user?.fullName || 'Authenticated User'}</p>
                        <p className="text-xs text-gray-600 dark:text-zinc-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="brand" size="sm" className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3" />
                        {activeRole}
                      </Badge>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] hover:text-gray-900 dark:hover:text-[#ececec] transition-colors"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <hr className="my-1 border-gray-200 dark:border-zinc-800" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-[#212121]">
          {/* Page Header - Only render when title is provided */}
          {title && (
            <div className="h-16 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-[#171717]/80 backdrop-blur sticky top-16 z-30 px-6 flex items-center">
              <div className="max-w-7xl mx-auto w-full">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">{title}</h1>
                {subtitle && <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-1">{subtitle}</p>}
              </div>
            </div>
          )}

          {/* Content Body */}
          <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export const getInitials = (name?: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};