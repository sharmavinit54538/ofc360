import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  RefreshCw,
  Sparkles,
  Layers,
  Briefcase,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import {
  DashboardTab,
  TabCategory,
  TAB_CATEGORIES,
  ALL_DASHBOARD_TABS,
} from './dashboardTabs.data';

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
  const [selectedCategory, setSelectedCategory] = useState<TabCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync category with active tab if active tab changes externally
  useEffect(() => {
    const currentTabObj = ALL_DASHBOARD_TABS.find((t) => t.id === activeTab);
    if (currentTabObj && selectedCategory !== 'all' && currentTabObj.category !== selectedCategory) {
      setSelectedCategory(currentTabObj.category);
    }
  }, [activeTab]);

  // Filter tabs based on category and search query
  const filteredTabs = ALL_DASHBOARD_TABS.filter((tab) => {
    const matchesCategory = selectedCategory === 'all' || tab.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tab.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tab.shortTagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tab.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Check scroll position to enable/disable scroll arrows
  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
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
  }, [checkScrollability, filteredTabs.length]);

  // Center active tab in scroll container when it changes
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeEl = scrollContainerRef.current.querySelector(
      `[data-tab-id="${activeTab}"]`
    ) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
    checkScrollability();
  }, [activeTab, selectedCategory, checkScrollability]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 320;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleCategorySelect = (cat: TabCategory | 'all') => {
    setSelectedCategory(cat);
    // If the currently active tab is not in this new category, switch to the first tab in that category
    if (cat !== 'all') {
      const currentTabObj = ALL_DASHBOARD_TABS.find((t) => t.id === activeTab);
      if (!currentTabObj || currentTabObj.category !== cat) {
        const firstInCategory = ALL_DASHBOARD_TABS.find((t) => t.category === cat);
        if (firstInCategory) {
          onTabChange?.(firstInCategory.id);
        }
      }
    }
  };

  const getCategoryIcon = (id: TabCategory | 'all') => {
    switch (id) {
      case 'core':
        return <LayoutDashboard className="w-3.5 h-3.5" />;
      case 'hr-ops':
        return <Settings className="w-3.5 h-3.5" />;
      case 'recruitment':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'ai-hub':
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Top Segment: Category Switcher Pills + Quick Search & Live Status */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Category Pills (ChatGPT-style clean segment) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 dark:bg-zinc-900/80 border border-border/70 backdrop-blur-md overflow-x-auto no-scrollbar max-w-full">
          {/* "All" Category Pill */}
          <button
            type="button"
            onClick={() => handleCategorySelect('all')}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200
              ${
                selectedCategory === 'all'
                  ? 'bg-foreground text-background dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            {getCategoryIcon('all')}
            <span>All Modules</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCategory === 'all'
                  ? 'bg-background/20 dark:bg-zinc-950/20 text-background dark:text-zinc-950'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {ALL_DASHBOARD_TABS.length}
            </span>
          </button>

          {/* Individual Category Pills */}
          {TAB_CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            const isAIHub = cat.id === 'ai-hub';

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200
                  ${
                    isCatActive
                      ? isAIHub
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                        : 'bg-foreground text-background dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                      : isAIHub
                      ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.shortLabel}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isCatActive
                      ? 'bg-black/20 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {cat.badgeCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Tools: Instant Tab Filter Search + Live Status + Refresh */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Quick Tab Search */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center gap-1.5 bg-card dark:bg-zinc-900 border border-border/80 rounded-xl px-2.5 py-1 shadow-sm transition-all animate-in fade-in zoom-in-95 w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter 68 tabs..."
                  className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground/70 outline-none w-full"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-0.5 rounded text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-[10px] px-1 rounded bg-muted text-muted-foreground hover:text-foreground shrink-0"
                >
                  Esc
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-card dark:bg-zinc-900/80 hover:bg-muted border border-border/60 text-muted-foreground hover:text-foreground text-xs font-medium transition-all shadow-sm"
                title="Filter tabs (Type to search)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Find Tab</span>
              </button>
            )}
          </div>

          {/* Live Sync Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Synced</span>
          </div>

          {/* Refresh Action */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card dark:bg-zinc-900/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 text-xs font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50"
              title="Refresh dashboard data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-400' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Segment: Horizontally Scrollable ChatGPT-Style Slider */}
      <div className="relative group w-full flex items-center">
        {/* Left Scroll Navigation Chevron */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          className={`
            absolute -left-2 z-30 w-8 h-8 rounded-full bg-card/95 dark:bg-zinc-900/95 border border-border shadow-md flex items-center justify-center text-foreground
            transition-all duration-200 active:scale-90
            ${canScrollLeft ? 'opacity-90 hover:opacity-100 hover:scale-105' : 'opacity-0 pointer-events-none'}
          `}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Left Edge Fade Gradient */}
        <div
          className={`
            pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-20 bg-gradient-to-r from-background to-transparent transition-opacity duration-200
            ${canScrollLeft ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Horizontal Scrollable Tabs Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/40 dark:bg-zinc-900/60 border border-border/60 backdrop-blur-md overflow-x-auto no-scrollbar scroll-smooth w-full select-none"
          role="tablist"
        >
          {filteredTabs.length === 0 ? (
            <div className="py-2 px-4 text-xs text-muted-foreground flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>No tabs match &quot;{searchQuery}&quot;</span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-brand-400 hover:underline font-medium ml-1"
              >
                Clear filter
              </button>
            </div>
          ) : (
            filteredTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComponent = tab.icon;
              const isAIHubTab = tab.category === 'ai-hub';

              return (
                <button
                  key={tab.id}
                  type="button"
                  data-tab-id={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`
                    relative group/btn flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap
                    transition-all duration-200 outline-none shrink-0
                    ${
                      isActive
                        ? isAIHubTab
                          ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-purple-300 border border-purple-500/40 shadow-sm font-semibold'
                          : 'bg-card text-foreground border border-border shadow-sm font-semibold dark:bg-zinc-800 dark:border-zinc-700'
                        : 'text-muted-foreground hover:text-foreground hover:bg-card/50 dark:hover:bg-zinc-800/50'
                    }
                  `}
                  aria-selected={isActive}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  title={`${tab.label} — ${tab.shortTagline}`}
                >
                  {/* Tab Icon */}
                  <span
                    className={`shrink-0 transition-transform duration-200 ${
                      isActive
                        ? isAIHubTab
                          ? 'text-purple-400 scale-105'
                          : 'text-brand-400 dark:text-brand-300 scale-105'
                        : 'text-muted-foreground/80 group-hover/btn:text-foreground group-hover/btn:scale-105'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </span>

                  {/* Tab Title */}
                  <span className="tracking-tight">{tab.label}</span>

                  {/* Status / Category Badge */}
                  {tab.badge && (
                    <span
                      className={`
                        text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0 border
                        ${
                          tab.badgeVariant === 'success'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : tab.badgeVariant === 'purple'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : tab.badgeVariant === 'warning'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : tab.badgeVariant === 'brand'
                            ? 'bg-brand-500/10 text-brand-400 border-brand-500/20'
                            : 'bg-muted/80 text-muted-foreground border-border/40'
                        }
                      `}
                    >
                      {isActive && tab.id === 'overview' && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                      )}
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Right Edge Fade Gradient */}
        <div
          className={`
            pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-20 bg-gradient-to-l from-background to-transparent transition-opacity duration-200
            ${canScrollRight ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Right Scroll Navigation Chevron */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          className={`
            absolute -right-2 z-30 w-8 h-8 rounded-full bg-card/95 dark:bg-zinc-900/95 border border-border shadow-md flex items-center justify-center text-foreground
            transition-all duration-200 active:scale-90
            ${canScrollRight ? 'opacity-90 hover:opacity-100 hover:scale-105' : 'opacity-0 pointer-events-none'}
          `}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DashboardTabBar;