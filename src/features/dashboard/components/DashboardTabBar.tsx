import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DASHBOARD_TABS, type DashboardTabItem } from './dashboardTabs.data';

export interface DashboardTabBarProps {
  tabs?: DashboardTabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const DashboardTabBar: React.FC<DashboardTabBarProps> = ({
  tabs = DASHBOARD_TABS,
  activeTab = 'overview',
  onTabChange,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll boundary to show/hide chevron buttons
  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    checkScrollability();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);

    return () => {
      el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability, tabs.length]);

  // The active tab auto-scrolls into view
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeEl = scrollContainerRef.current.querySelector(
      `[data-tab-id="${activeTab}"]`
    ) as HTMLElement | null;

    if (activeEl) {
      activeEl.scrollIntoView({ inline: 'center', behavior: 'smooth' });
      const timer = setTimeout(checkScrollability, 300);
      return () => clearTimeout(timer);
    }
    checkScrollability();
  }, [activeTab, checkScrollability]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Keyboard accessibility: Left/Right arrow keys navigate tabs, Home/End jump to ends
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;

    e.preventDefault();
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (currentIndex === -1) return;

    let targetIndex = currentIndex;
    if (e.key === 'ArrowRight') {
      targetIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      targetIndex = 0;
    } else if (e.key === 'End') {
      targetIndex = tabs.length - 1;
    }

    const nextTab = tabs[targetIndex];
    if (nextTab && onTabChange) {
      onTabChange(nextTab.id);
      const targetEl = scrollContainerRef.current?.querySelector(
        `[data-tab-id="${nextTab.id}"]`
      ) as HTMLElement | null;
      targetEl?.focus();
    }
  };

  return (
    <nav
      className="relative w-full sticky top-16 z-30 bg-white dark:bg-[#212121] border-b border-slate-200 dark:border-zinc-800 px-4 py-2"
      role="tablist"
      aria-label="Dashboard Modules"
    >
      {/* Left Chevron button with soft fade gradient */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pr-4 pl-0 bg-gradient-to-r from-white dark:from-[#212121] to-transparent pointer-events-none">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Scroll tabs left"
            className="pointer-events-auto p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-white/90 dark:bg-[#171717]/90 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Horizontal Scrollable Tabs Row */}
      <div
        ref={scrollContainerRef}
        role="tablist"
        aria-label="Dashboard Modules"
        onKeyDown={handleKeyDown}
        className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap no-scrollbar scroll-smooth w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab, index) => {
          const isNewGroup = index > 0 && tab.group !== tabs[index - 1].group;
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <React.Fragment key={tab.id}>
              {/* Thin vertical divider between groups (NO group label) */}
              {isNewGroup && (
                <div
                  className="h-5 w-px bg-slate-200 dark:bg-zinc-800 mx-1.5 flex-shrink-0 self-center"
                  aria-hidden="true"
                  role="separator"
                />
              )}

              {/* Individual Tab */}
              <button
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                data-tab-id={tab.id}
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabChange?.(tab.id)}
                className={`
                  inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 flex-shrink-0 outline-none
                  ${
                    isActive
                      ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/10 shadow-none'
                      : 'text-slate-500 dark:text-zinc-400 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-200 border border-transparent'
                  }
                `}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Right Chevron button with soft fade gradient */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center pl-4 pr-0 bg-gradient-to-l from-white dark:from-[#212121] to-transparent pointer-events-none">
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Scroll tabs right"
            className="pointer-events-auto p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-white/90 dark:bg-[#171717]/90 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default DashboardTabBar;