import React, { useState, useMemo, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, PanelLeft } from 'lucide-react';
import {
  DASHBOARD_TABS,
  SIDEBAR_SECTIONS,
  type DashboardTabItem,
  type SidebarSection,
} from './dashboardTabs.data';

export interface DashboardSidebarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const SIDEBAR_WIDTH = 'w-64';
const SIDEBAR_COLLAPSED_WIDTH = 'w-16';

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab = 'overview',
  onTabChange,
  collapsed = false,
  onToggleCollapse,
}) => {
  const location = useLocation();

  const [expandedSections, setExpandedSections] = useState<Record<SidebarSection, boolean>>({
    overview: true,
    workforce: true,
    talent: true,
    attendance: true,
    payroll: true,
    reports: true,
    aihub: true,
    documents: true,
    hrops: true,
    settings: true,
    recruitment: true,
    leave: true,
    performance: true,
  });

  const [expandedTabs, setExpandedTabs] = useState<Record<string, boolean>>({
    attendance: true,
  });

  useEffect(() => {
    if (location.pathname.startsWith('/dashboard/attendance')) {
      setExpandedTabs((prev) => ({ ...prev, attendance: true }));
    }
  }, [location.pathname]);

  const toggleSection = (section: SidebarSection) => {
    const sectionConfig = SIDEBAR_SECTIONS.find((s) => s.id === section);
    if (!sectionConfig?.collapsible) return;
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleTabSubmenu = (tabId: string) => {
    setExpandedTabs((prev) => ({ ...prev, [tabId]: !prev[tabId] }));
  };

  const sectionTabs = useMemo(() => {
    const tabsBySection: Record<SidebarSection, DashboardTabItem[]> = {
      overview: [],
      workforce: [],
      talent: [],
      attendance: [],
      payroll: [],
      reports: [],
      aihub: [],
      documents: [],
      hrops: [],
      settings: [],
      recruitment: [],
      leave: [],
      performance: [],
    };
    DASHBOARD_TABS.forEach((tab) => {
      tabsBySection[tab.section].push(tab);
    });
    return tabsBySection;
  }, []);

  const renderTabItem = (tab: DashboardTabItem, isCollapsed: boolean) => {
    const hasChildren = Boolean(tab.children && tab.children.length > 0);
    const isSubmenuOpen = Boolean(expandedTabs[tab.id]);

    const isDirectActive =
      (tab.path && location.pathname === tab.path) || activeTab === tab.id;
    const isChildActive = Boolean(
      hasChildren &&
        tab.children?.some(
          (c) =>
            (c.path && location.pathname === c.path) ||
            activeTab === c.id ||
            activeTab === `attendance-${c.id}`
        )
    );
    const isActive = isDirectActive || isChildActive;
    const Icon = tab.icon;

    if (isCollapsed) {
      if (tab.path && !hasChildren) {
        return (
          <NavLink
            key={tab.id}
            to={tab.path}
            onClick={() => onTabChange?.(tab.id)}
            title={tab.label}
            className={({ isActive: navActive }) => `
              relative flex items-center justify-center px-3 py-2.5 rounded-lg transition-colors duration-150
              ${navActive || isDirectActive
                ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100'
              }
            `}
          >
            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
          </NavLink>
        );
      }

      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-label={tab.label}
          onClick={() => onTabChange?.(tab.id)}
          className={`
            relative flex items-center justify-center px-3 py-2.5 rounded-lg transition-colors duration-150
            ${isActive
              ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'
              : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100'
            }
          `}
          title={tab.label}
        >
          <Icon className="w-[18px] h-[18px] flex-shrink-0" />
        </button>
      );
    }

    return (
      <div key={tab.id} className="flex flex-col gap-0.5">
        {hasChildren ? (
          <div
            className={`
              w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer
              ${isActive
                ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-zinc-400 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100'
              }
            `}
            onClick={() => {
              toggleTabSubmenu(tab.id);
              onTabChange?.(tab.id);
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="truncate">{tab.label}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 dark:text-zinc-500 transition-transform duration-200 ${
                isSubmenuOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        ) : tab.path ? (
          <NavLink
            to={tab.path}
            onClick={() => onTabChange?.(tab.id)}
            className={({ isActive: navActive }) => `
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 text-left
              ${navActive || isDirectActive
                ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-zinc-400 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100'
              }
            `}
          >
            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
            <span className="truncate">{tab.label}</span>
          </NavLink>
        ) : (
          <button
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange?.(tab.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 text-left
              ${isActive
                ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-zinc-400 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100'
              }
            `}
          >
            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
            <span className="truncate">{tab.label}</span>
          </button>
        )}

        {hasChildren && isSubmenuOpen && (
          <div className="flex flex-col gap-0.5 mt-0.5 pl-4 border-l border-slate-200 dark:border-zinc-800 ml-4">
            {tab.children?.map((child) => {
              const ChildIcon = child.icon;
              return (
                <NavLink
                  key={child.id}
                  to={child.path || '#'}
                  onClick={() => onTabChange?.(child.id)}
                  className={({ isActive: navActive }) => {
                    const isSubActive =
                      navActive ||
                      location.pathname === child.path ||
                      activeTab === child.id ||
                      activeTab === child.id.replace('attendance-', '');
                    return `
                      w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 text-left
                      ${isSubActive
                        ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold'
                        : 'text-slate-500 dark:text-zinc-400 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100'
                      }
                    `;
                  }}
                >
                  <ChildIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{child.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (sectionConfig: typeof SIDEBAR_SECTIONS[0], isCollapsed: boolean) => {
    const tabs = sectionTabs[sectionConfig.id] || [];
    const isExpanded = expandedSections[sectionConfig.id];
    const isCollapsible = sectionConfig.collapsible;

    if (tabs.length === 0) return null;

    return (
      <div key={sectionConfig.id} className="flex flex-col gap-1">
        {isCollapsible && !isCollapsed && (
          <button
            type="button"
            onClick={() => toggleSection(sectionConfig.id)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
            aria-expanded={isExpanded}
          >
            <sectionConfig.icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 truncate">{sectionConfig.label}</span>
            <ChevronDown
              className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}

        {!isCollapsible || isExpanded || isCollapsed ? (
          <div className={`flex flex-col gap-1 ${isCollapsible && !isExpanded && !isCollapsed ? 'hidden' : ''}`}>
            {tabs.map((tab) => renderTabItem(tab, isCollapsed))}
          </div>
        ) : (
          <div className="h-0 overflow-hidden transition-all duration-200" />
        )}
      </div>
    );
  };

  return (
    <aside
      className={`${collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH} shrink-0 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#171717] flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out overflow-hidden`}
      aria-label="Dashboard navigation"
    >
      {!collapsed ? (
        <div className="h-16 flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex-shrink-0">
          <Link to="/" className="flex items-center min-w-0 flex-shrink-0" title="OFC360 Home">
            <img
              src="/logo.png"
              alt="OFC360"
              className="h-8 w-auto object-contain flex-shrink-0 hover:opacity-90 transition-opacity"
            />
          </Link>

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeft className="w-5 h-5" strokeWidth={2} />
            </button>
          )}
        </div>
      ) : (
        <div className="h-16 flex items-center justify-center px-2 py-3 border-b border-slate-200 dark:border-zinc-800 flex-shrink-0">
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-2 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <PanelLeft className="w-5 h-5" strokeWidth={2} />
            </button>
          )}
        </div>
      )}

      <nav
        className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        role="navigation"
        aria-label="Dashboard modules"
      >
        {SIDEBAR_SECTIONS.map((sectionConfig) =>
          renderSection(sectionConfig, collapsed)
        )}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;