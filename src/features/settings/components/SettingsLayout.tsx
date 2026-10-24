/**
 * @file SettingsLayout.tsx
 * @description Main layout component for Settings Module with sidebar navigation,
 * unsaved changes detection, and API unavailable alert integration.
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation, useNavigate, Outlet, NavLink } from 'react-router-dom';
import {
  Building2,
  Users,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  Package,
  Bell,
  Shield,
  ChevronRight,
  AlertTriangle,
  Save,
  RotateCcw,
  HelpCircle,
  Settings as SettingsIcon,
  ArrowLeft,
} from 'lucide-react';
import { useAppSelector } from '@/app/hooks';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/Badge';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { useGetCompanySettingsQuery } from '@/features/settings/api/settingsApi';
import type { SettingCategory, SettingsSection } from '@/features/settings/types/settings.types';

// ==========================================
// Section Configuration
// ==========================================

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'company',
    label: 'Company',
    icon: Building2,
    description: 'Organization details, branding, timezone & currency',
    requiredPermissions: ['org:manage'],
    order: 1,
  },
  {
    id: 'employees',
    label: 'Employees',
    icon: Users,
    description: 'ID formats, role defaults, visibility rules',
    requiredPermissions: ['org:manage', 'users:write'],
    order: 2,
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: Clock,
    description: 'Shift timings, grace periods, geofencing, IP restrictions',
    requiredPermissions: ['hrms:attendance'],
    order: 3,
  },
  {
    id: 'leave',
    label: 'Leave',
    icon: Calendar,
    description: 'Leave types, accruals, carry-forward, approval workflows',
    requiredPermissions: ['hrms:leaves'],
    order: 4,
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: DollarSign,
    description: 'Salary components, statutory configs, pay cycles',
    requiredPermissions: ['hrms:payroll'],
    order: 5,
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: FileText,
    description: 'Letter templates, digital signatures, document storage',
    requiredPermissions: ['org:manage'],
    order: 6,
  },
  {
    id: 'assets',
    label: 'Assets',
    icon: Package,
    description: 'Asset categories, tag prefixes, allocation rules',
    requiredPermissions: ['it:assets'],
    order: 7,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Email, SMS, in-app event toggles & preferences',
    requiredPermissions: ['org:manage'],
    order: 8,
  },
  {
    id: 'profile',
    label: 'My Profile',
    icon: Shield,
    description: 'Password, 2FA, passkeys, active sessions',
    requiredPermissions: [],
    order: 9,
  },
];

export const SECTION_ICONS: Record<SettingCategory, React.ComponentType<{ className?: string }>> = {
  company: Building2,
  employees: Users,
  attendance: Clock,
  leave: Calendar,
  payroll: DollarSign,
  documents: FileText,
  assets: Package,
  notifications: Bell,
  profile: Shield,
};

// ==========================================
// Types
// ==========================================

interface SettingsLayoutProps {
  children?: React.ReactNode;
}

interface UnsavedChangesBannerProps {
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
  dirtySections: SettingCategory[];
}

interface ApiUnavailableAlertProps {
  onRetry: () => void;
  message?: string;
}

// ==========================================
// Unsaved Changes Banner
// ==========================================

const UnsavedChangesBanner: React.FC<UnsavedChangesBannerProps> = ({
  onSave,
  onDiscard,
  onCancel,
  dirtySections,
}) => {
  const { warning } = useToast();

  const handleSave = useCallback(() => {
    onSave();
    warning('Changes saved successfully', 'Settings Updated');
  }, [onSave, warning]);

  const handleDiscard = useCallback(() => {
    onDiscard();
    warning('Unsaved changes discarded', 'Changes Discarded');
  }, [onDiscard, warning]);

  if (dirtySections.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              Unsaved Changes
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              You have unsaved changes in {dirtySections.length} section{dirtySections.length > 1 ? 's' : ''}:
              {' '}
              <span className="font-medium">{dirtySections.join(', ')}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handleDiscard}>
            Discard
          </Button>
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save All
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// API Unavailable Alert
// ==========================================

const ApiUnavailableAlert: React.FC<ApiUnavailableAlertProps> = ({ onRetry, message }) => {

  const handleRetry = useCallback(() => {
    onRetry();
  }, [onRetry]);

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-top-4">
      <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-100">
              Settings Unavailable
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
              {message || 'Unable to connect to settings service. Some features may be limited.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button variant="primary" size="sm" onClick={handleRetry}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Retry Connection
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Settings Sidebar
// ==========================================

interface SettingsSidebarProps {
  activeSection: SettingCategory;
  onSectionChange: (section: SettingCategory) => void;
  dirtySections: SettingCategory[];
  isLoading: boolean;
  apiError: string | null;
  onRetry: () => void;
  userPermissions: string[];
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSectionChange,
  dirtySections,
  isLoading: _isLoading,
  apiError,
  onRetry,
  userPermissions,
}) => {
  const navigate = useNavigate();

  const filteredSections = useMemo(() => {
    return SETTINGS_SECTIONS.filter((section) => {
      if (section.requiredPermissions.length === 0) return true;
      return section.requiredPermissions.some((perm) => userPermissions.includes(perm));
    });
  }, [userPermissions]);

  const handleSectionClick = useCallback((sectionId: SettingCategory) => {
    onSectionChange(sectionId);
    navigate(`/settings/${sectionId}`);
  }, [onSectionChange, navigate]);

  if (apiError) {
    return (
      <aside className="w-72 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col h-full">
        <div className="p-6">
          <ApiUnavailableAlert onRetry={onRetry} message={apiError} />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Settings</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Configure your organization
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1" role="navigation" aria-label="Settings sections">
        {filteredSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const isDirty = dirtySections.includes(section.id);

          return (
            <NavLink
              key={section.id}
              to={`/settings/${section.id}`}
              onClick={() => handleSectionClick(section.id)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                'group relative overflow-hidden',
                isActive
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
              )}
              title={section.description}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200',
                isActive
                  ? 'bg-white/20'
                  : 'bg-neutral-100 dark:bg-neutral-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30'
              )}>
                <Icon
                  className={cn(
                    'w-4.5 h-4.5 transition-colors duration-200',
                    isActive
                      ? 'text-white'
                      : 'text-neutral-500 dark:text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                  )}
                />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <span className="block truncate">{section.label}</span>
                <span className="block truncate text-[11px] opacity-70">
                  {section.description}
                </span>
              </div>
              {isDirty && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" aria-label="Unsaved changes" />
              )}
              {isActive && (
                <ChevronRight className="w-4 h-4 text-white/70 flex-shrink-0" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900">
          <HelpCircle className="w-5 h-5 text-neutral-400 dark:text-neutral-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Need help?{' '}
              <a href="/docs/settings" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                View documentation
              </a>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ==========================================
// Main Settings Layout
// ==========================================

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const { success, error: toastError } = useToast();

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleSidebarTabChange = useCallback(
    (tabId: string) => {
      if (tabId === 'settings') {
        navigate('/settings');
      } else {
        navigate(`/dashboard/hr-admin#${tabId}`);
      }
    },
    [navigate]
  );

  const [activeSection, setActiveSection] = useState<SettingCategory>('company');
  const [dirtySections, setDirtySections] = useState<SettingCategory[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Get user permissions
  const userPermissions = useMemo(() => user?.permissions || [], [user?.permissions]);

  const filteredSections = useMemo(() => {
    return SETTINGS_SECTIONS.filter((section) => {
      if (section.requiredPermissions.length === 0) return true;
      return section.requiredPermissions.some((perm) => userPermissions.includes(perm));
    });
  }, [userPermissions]);

  const isOverview = location.pathname === '/settings' || location.pathname === '/settings/';

  // Determine current section from URL
  const currentSectionFromUrl = useMemo(() => {
    const path = location.pathname.replace('/settings/', '').replace('/settings', '');
    const section = SETTINGS_SECTIONS.find((s) => s.id === path);
    return section?.id || 'company';
  }, [location.pathname]);

  // Sync active section with URL
  useEffect(() => {
    if (currentSectionFromUrl !== activeSection) {
      setActiveSection(currentSectionFromUrl);
    }
  }, [currentSectionFromUrl, activeSection]);

  // Check for API loading
  const { isLoading: companyLoading } = useGetCompanySettingsQuery();
  const isLoading = companyLoading;

  const markDirty = useCallback((section: SettingCategory) => {
    setDirtySections((prev) => (prev.includes(section) ? prev : [...prev, section]));
  }, []);

  const markClean = useCallback((section: SettingCategory) => {
    setDirtySections((prev) => prev.filter((s) => s !== section));
  }, []);

  const handleSaveAll = useCallback(async () => {
    setIsSaving(true);
    try {
      window.dispatchEvent(new CustomEvent('settings:save-all'));
      setDirtySections([]);
      success('All changes saved successfully', 'Settings Saved');
    } catch {
      toastError('Failed to save some changes', 'Save Failed');
    } finally {
      setIsSaving(false);
    }
  }, [success, toastError]);

  const handleDiscardAll = useCallback(() => {
    window.dispatchEvent(new CustomEvent('settings:discard-all'));
    setDirtySections([]);
  }, []);

  const handleCancel = useCallback(() => {
    // Keep dirty state, just close banner
  }, []);

  // Provide context to child sections
  const settingsContext = useMemo(() => ({
    activeSection,
    setActiveSection,
    dirtySections,
    markDirty,
    markClean,
    isSaving,
    userPermissions,
  }), [activeSection, dirtySections, isSaving, userPermissions, markDirty, markClean]);

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          activeTab="settings"
          onTabChange={handleSidebarTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={toggleSidebar}
    >
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#121212]">
        {/* If inside a specific section, show sub-header with Back to Settings button, breadcrumb, pills, and export/import */}
        {!isOverview && (
          <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#171717]/95 backdrop-blur border-b border-slate-200 dark:border-zinc-800 px-4 md:px-8 py-3">
            <div className="flex flex-col gap-3 max-w-7xl mx-auto">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => navigate('/settings')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>All Settings</span>
                  </button>
                  <span className="text-slate-300 dark:text-zinc-700">/</span>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base font-semibold text-slate-900 dark:text-white capitalize">
                      {SETTINGS_SECTIONS.find((s) => s.id === activeSection)?.label || 'Settings'}
                    </h1>
                    {dirtySections.length > 0 && (
                      <Badge variant="warning" size="sm" className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {dirtySections.length} unsaved
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.dispatchEvent(new CustomEvent('settings:export'))}
                    disabled={isLoading}
                  >
                    Export
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById('settings-import')?.click()}
                    disabled={isLoading}
                  >
                    Import
                  </Button>
                  <input
                    id="settings-import"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append('file', file);
                        window.dispatchEvent(new CustomEvent('settings:import', { detail: formData }));
                      }
                    }}
                  />
                </div>
              </div>

              {/* Horizontal Pill Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {filteredSections.map((sec) => {
                  const SecIcon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => navigate(`/settings/${sec.id}`)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all duration-150',
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                          : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                      )}
                    >
                      <SecIcon className="w-3.5 h-3.5" />
                      <span>{sec.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <SettingsContext.Provider value={settingsContext}>
              {children || <Outlet />}
            </SettingsContext.Provider>
          </div>
        </div>
      </div>

      {/* Global Alerts */}
      <UnsavedChangesBanner
        dirtySections={dirtySections}
        onSave={handleSaveAll}
        onDiscard={handleDiscardAll}
        onCancel={handleCancel}
      />
    </DashboardShell>
  );
};

// Context for child sections to access shared state
const SettingsContext = React.createContext<{
  activeSection: SettingCategory;
  setActiveSection: (section: SettingCategory) => void;
  dirtySections: SettingCategory[];
  markDirty: (section: SettingCategory) => void;
  markClean: (section: SettingCategory) => void;
  isSaving: boolean;
  userPermissions: string[];
} | null>(null);

export const useSettingsContext = () => {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsLayout');
  }
  return context;
};

export default SettingsLayout;