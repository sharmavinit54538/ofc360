import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  Bell,
  Shield,
  Sun,
  Moon,
  ArrowLeft,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/ui/Toast';
import { Badge } from '@/shared/ui/Badge';
import { useTheme } from '@/shared/context/ThemeContext';
import { GlobalSearch } from './GlobalSearch';

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  sidebar?: React.ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  fullWidth?: boolean;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  title,
  subtitle,
  sidebar,
  sidebarCollapsed: _sidebarCollapsed = false,
  onSidebarToggle: _onSidebarToggle,
  fullWidth = false,
}) => {
  const { user, activeRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile drawer and search on any route/hash/search change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname, location.search, location.hash]);

  // Lock background scrolling and handle Escape key for mobile menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (mobileSearchOpen) setMobileSearchOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen, mobileSearchOpen]);

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatarUrl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && profileMenuOpen) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileMenuOpen]);

  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('You have been securely signed out', 'Session Terminated');
    navigate('/auth/login');
    setProfileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#212121] text-gray-900 dark:text-[#ececec] flex transition-colors duration-200">
      {/* Desktop In-Flow Sidebar: visible on desktop screens (lg and up) */}
      {sidebar && (
        <div className="hidden lg:flex shrink-0 z-30 transition-all duration-300 ease-in-out">
          {sidebar}
        </div>
      )}

      {/* Mobile Drawer Overlay: visible on screens < lg when mobileMenuOpen is true */}
      {sidebar && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="relative z-50 flex flex-col w-72 max-w-[85vw] h-full bg-white dark:bg-[#171717] shadow-2xl animate-in slide-in-from-left duration-200">
            {React.isValidElement(sidebar)
              ? React.cloneElement(sidebar as React.ReactElement<any>, {
                  onMobileClose: () => setMobileMenuOpen(false),
                  collapsed: false,
                })
              : sidebar}
          </div>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar - Responsive */}
        <header className="h-16 border-b border-gray-200 dark:border-zinc-800 bg-white/95 dark:bg-[#171717]/95 backdrop-blur sticky top-0 z-40 flex items-center justify-between px-3 sm:px-4 md:px-6 gap-2 sm:gap-4">
          {/* Left: Mobile Menu Toggle, Brand logo & Global Back Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {sidebar && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Logo: Shown on mobile when sidebar exists, or always if sidebar is absent */}
            <Link
              to="/"
              className={`flex items-center flex-shrink-0 mr-1 ${sidebar ? 'lg:hidden' : ''}`}
              title="OFC360 Home"
            >
              <img
                src="/logo.png"
                alt="OFC360"
                className="h-7 sm:h-8 w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </Link>

            {/* Global Back Button */}
            <button
              type="button"
              onClick={handleGoBack}
              className="group inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200/90 dark:border-zinc-700/80 transition-all duration-150 active:scale-95 shadow-sm"
              title="Go back to previous page"
              aria-label="Go back"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>

          {/* CENTER-RIGHT: Search, Notifications, User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-1 justify-end min-w-0">
            {/* Global Search - Desktop / Tablet */}
            <div className="hidden sm:flex">
              <GlobalSearch />
            </div>

            {/* Global Search Toggle Button - Mobile only */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="sm:hidden p-2 rounded-xl text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-[#ececec] hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition-colors flex-shrink-0"
              aria-label="Toggle search"
              aria-expanded={mobileSearchOpen}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="p-2 rounded-xl text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-[#ececec] hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition-colors relative flex-shrink-0"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative flex-shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="p-1.5 rounded-full bg-gray-100/90 dark:bg-[#262626] border border-gray-200/80 dark:border-zinc-700/80 hover:bg-gray-200/80 dark:hover:bg-[#303030] hover:border-gray-300 dark:hover:border-zinc-600 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                aria-expanded={profileMenuOpen}
                aria-haspopup="true"
                aria-label="Open profile menu"
              >
                {/* Circular User Avatar with subtle gray background and white initials */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-zinc-600 dark:bg-zinc-700 text-white flex items-center justify-center font-semibold text-xs sm:text-sm shrink-0 overflow-hidden select-none ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
                  {user?.avatarUrl && !avatarError ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName || 'User avatar'}
                      className="w-full h-full object-cover rounded-full"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span>{getInitials(user?.fullName)}</span>
                  )}
                </div>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 shadow-xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95">
                  {/* User Info Header */}
                  <div className="px-4 py-4 border-b border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-600 dark:bg-zinc-700 text-white flex items-center justify-center font-semibold text-sm shrink-0 overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-sm select-none">
                        {user?.avatarUrl && !avatarError ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName || 'User avatar'}
                            className="w-full h-full object-cover rounded-full"
                            onError={() => setAvatarError(true)}
                          />
                        ) : (
                          <span>{getInitials(user?.fullName)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user?.fullName || 'Authenticated User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                          {user?.email || ''}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="brand" size="sm" className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3" />
                        {activeRole}
                      </Badge>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900/50 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg mx-2"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-neutral-800" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300 transition-colors rounded-lg mx-2"
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

        {/* Mobile Search Input Drawer/Bar - Opens when user taps search icon on mobile */}
        {mobileSearchOpen && (
          <div className="sm:hidden px-3 py-2 bg-white dark:bg-[#171717] border-b border-gray-200 dark:border-zinc-800 flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
            <div className="flex-1 min-w-0">
              <GlobalSearch />
            </div>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden bg-slate-50/50 dark:bg-[#212121]">
          {/* Page Header - Only render when title is provided */}
          {title && (
            <div className="border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-[#171717]/80 backdrop-blur sticky top-16 z-30 px-3 sm:px-6 py-3 sm:py-4 flex items-center">
              <div className="max-w-7xl mx-auto w-full min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec] truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-0.5 sm:mt-1 line-clamp-2">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Content Body with Responsive Padding */}
          <div
            className={`flex-1 w-full space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 lg:p-8 min-w-0 ${
              fullWidth ? 'max-w-none' : 'max-w-7xl mx-auto'
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export const getInitials = (name?: string | null): string => {
  if (!name) return 'U';
  const trimmed = name.trim();
  if (!trimmed) return 'U';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};