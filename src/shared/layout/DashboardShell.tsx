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
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  title,
  subtitle,
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation Bar - Clean & Minimal */}
      <header className="h-14 border-b border-border/60 bg-background/95 backdrop-blur-md sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between relative">
        {/* Brand - Clean, no badges */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-md shadow-brand-500/20">
            <div className="w-full h-full bg-card rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-brand-400" />
            </div>
          </div>
          <span className="font-bold text-foreground text-base hidden sm:block">
            OFC<span className="text-brand-400">360</span>
          </span>
        </Link>

        {/* Right Controls: Search, Notifications, User Profile Menu */}
        <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end min-w-0">
          {/* Search */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground w-56 md:w-64 flex-shrink-0">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="truncate">Search...</span>
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors relative flex-shrink-0"
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/50 bg-muted/50 hover:bg-muted transition-colors"
              aria-expanded={profileMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-600/30 border border-brand-500/40 flex items-center justify-center font-bold text-sm text-brand-300">
                {getInitials(user?.fullName)}
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground">
                {getInitials(user?.fullName)}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-600/30 border border-brand-500/40 flex items-center justify-center font-bold text-base text-brand-300">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{user?.fullName || 'Authenticated User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
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
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                  <hr className="my-1 border-border/50" />
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

      {/* Main Content Area - Proper top padding for fixed header */}
      <main className="flex-1 pt-16 md:pt-20 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Page Header - Only render when title is provided */}
        {title && (
          <div className="pb-4 border-b border-border/50">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        )}

        {/* Content Body */}
        {children}
      </main>
    </div>
  );
};