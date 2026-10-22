import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/shared/ui/Toast';

export interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  disabled?: boolean;
}

interface DashboardTabBarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const DashboardTabBar: React.FC<DashboardTabBarProps> = ({
  activeTab = 'overview',
  onTabChange,
  onRefresh,
  isRefreshing = false,
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: 'Active',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
      disabled: false,
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: <Users className="w-4 h-4" />,
      badge: 'Soon',
      badgeColor: 'bg-muted text-muted-foreground border-border/60',
      disabled: true,
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <Calendar className="w-4 h-4" />,
      badge: 'Soon',
      badgeColor: 'bg-muted text-muted-foreground border-border/60',
      disabled: true,
    },
    {
      id: 'payroll',
      label: 'Payroll',
      icon: <CreditCard className="w-4 h-4" />,
      badge: 'Soon',
      badgeColor: 'bg-muted text-muted-foreground border-border/60',
      disabled: true,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: 'Soon',
      badgeColor: 'bg-muted text-muted-foreground border-border/60',
      disabled: true,
    },
  ];

  const updateIndicator = () => {
    if (!containerRef.current) return;
    
    const activeButton = containerRef.current.querySelector(`[data-tab-id="${currentTab}"]`) as HTMLElement;
    if (activeButton) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      setIndicatorStyle({
        width: `${buttonRect.width}px`,
        transform: `translateX(${buttonRect.left - containerRect.left}px)`,
        opacity: 1,
      });
    }
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [currentTab]);

  const handleTabClick = (tab: TabItem) => {
    if (tab.disabled) {
      toast.info(
        `The ${tab.label} module is scheduled for the upcoming phase. You are currently viewing the comprehensive live Overview.`,
        'Module In Development'
      );
      return;
    }

    setCurrentTab(tab.id);
    onTabChange?.(tab.id);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
      {/* Slider / Horizontal Tabs Track - ChatGPT Style */}
      <div 
        ref={containerRef}
        className="relative flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/60 backdrop-blur-md overflow-hidden max-w-full"
        role="tablist"
        aria-label="Dashboard navigation"
      >
        {/* Sliding Active Indicator Pill */}
        <div
          className="absolute inset-y-1 rounded-lg bg-white/10 dark:bg-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out z-0 pointer-events-none"
          style={indicatorStyle}
          aria-hidden="true"
        />

        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              data-tab-id={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`
                relative z-10 group flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap
                transition-all duration-200 select-none outline-none
                ${isActive 
                  ? 'text-foreground font-semibold' 
                  : tab.disabled 
                    ? 'text-muted-foreground/60 hover:text-muted-foreground hover:bg-transparent cursor-pointer' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
                }
              `}
              aria-selected={isActive}
              aria-disabled={tab.disabled}
              role="tab"
              tabIndex={isActive ? 0 : -1}
            >
              {/* Tab Icon */}
              <span className={`shrink-0 transition-transform duration-200 ${isActive ? 'scale-105 text-foreground' : 'group-hover:scale-105 text-muted-foreground'}`}>
                {tab.icon}
              </span>

              {/* Tab Label */}
              <span className="tracking-tight">{tab.label}</span>

              {/* Status Badge */}
              {tab.badge && (
                <span
                  className={`
                    text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border shrink-0
                    ${tab.badgeColor}
                    ${isActive ? 'flex items-center gap-1' : ''}
                  `}
                >
                  {isActive && tab.id === 'overview' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                  )}
                  <span>{tab.badge}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Controls: Real-time Status & Quick Refresh */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {/* Real-time Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span>Live Synced</span>
        </div>

        {/* Quick Refresh Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 text-xs font-medium transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh dashboard metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-400' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardTabBar;