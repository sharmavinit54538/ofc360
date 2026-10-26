/**
 * @file ConnectPage.tsx
 * @description OFC360 Connect Hub featuring 6 KPI Module Cards:
 * 1. Chat (2-Pane Employee Messaging & Directory)
 * 2. Call (Voice & Audio Calling Hub)
 * 3. Meet (Video Meeting Room & Meeting Intelligence)
 * 4. Slack (Slack Channel & Webhook Sync)
 * 5. Announcement (Company-wide Broadcasts & Notices)
 * 6. Help Desk (Employee IT & HR Support Service Desk)
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  MessageSquare,
  Users,
  Send,
  Wifi,
  WifiOff,
  RefreshCw,
  PhoneCall,
  Video,
  Hash,
  Megaphone,
  Headphones,
  Plus,
  Clock,
  Mic,
  MicOff,
  PhoneOff,
  Pin,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { SkeletonCard } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { cn } from '@/shared/lib/utils';
import {
  useGetColleaguesQuery,
  useCreateOrGetConversationMutation,
  useGetConnectConversationsQuery,
  useGetConnectMessagesQuery,
  useSendConnectMessageMutation,
} from '../api/connectApi';
import {
  useGetAnnouncementsQuery,
  useDeleteAnnouncementMutation,
  usePublishAnnouncementMutation,
  useArchiveAnnouncementMutation,
  type AnnouncementResponse,
  type AnnouncementPriority,
  type AnnouncementStatus,
  AnnouncementModal,
  AnnouncementFeedCard,
} from '@/features/announcements';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import { useConnectWebSocket } from '../hooks/useConnectWebSocket';
import type {
  Colleague,
  ConnectMessage,
  PresenceStatus,
} from '../types';

type ConnectToolId = 'chat' | 'call' | 'meet' | 'slack' | 'announcement' | 'helpdesk';

interface ConnectModuleCard {
  id: ConnectToolId;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const CONNECT_MODULES: ConnectModuleCard[] = [
  {
    id: 'chat',
    title: 'Chat',
    icon: MessageSquare,
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    id: 'call',
    title: 'Call',
    icon: PhoneCall,
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'meet',
    title: 'Meet',
    icon: Video,
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'slack',
    title: 'Slack',
    icon: Hash,
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'announcement',
    title: 'Announcement',
    icon: Megaphone,
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    id: 'helpdesk',
    title: 'Help Desk',
    icon: Headphones,
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
];

export const ConnectPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const validTools: ConnectToolId[] = ['chat', 'call', 'meet', 'slack', 'announcement', 'helpdesk'];
  const initialToolParam = (searchParams.get('tool') || searchParams.get('tab')) as ConnectToolId | null;

  // Active KPI Module Tool
  const [activeTool, setActiveTool] = useState<ConnectToolId>(
    initialToolParam && validTools.includes(initialToolParam) ? initialToolParam : 'chat'
  );

  useEffect(() => {
    const toolParam = (searchParams.get('tool') || searchParams.get('tab')) as ConnectToolId | null;
    if (toolParam && validTools.includes(toolParam)) {
      setActiveTool(toolParam);
    }
  }, [searchParams]);

  // =========================================================================
  // CHAT TOOL STATES
  // =========================================================================
  const [chatActiveTab, setChatActiveTab] = useState<'chats' | 'colleagues'>('chats');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [replyToMessage, setReplyToMessage] = useState<ConnectMessage | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [cursorBefore, setCursorBefore] = useState<string | undefined>(undefined);
  const [olderMessages, setOlderMessages] = useState<ConnectMessage[]>([]);

  // WebSocket integration
  const { isSocketLive, sendTyping, typingMap } = useConnectWebSocket({
    activeConversationId: activeConversationId || undefined,
  });

  // Queries
  const { data: colleaguesData } = useGetColleaguesQuery({
    search: searchQuery || undefined,
  });

  const {
    data: conversations = [],
    isLoading: isConversationsLoading,
    refetch: refetchConversations,
  } = useGetConnectConversationsQuery(undefined, {
    pollingInterval: isSocketLive ? 0 : 5000,
  });

  // Auto-select first conversation
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // Messages Query for active conversation
  const {
    data: currentMessages = [],
    refetch: refetchMessages,
  } = useGetConnectMessagesQuery(
    {
      conversationId: activeConversationId || '',
      limit: 50,
      before: cursorBefore,
    },
    {
      skip: !activeConversationId,
      pollingInterval: isSocketLive ? 0 : 4000,
    }
  );

  // Mutations
  const [createOrGetConversation] = useCreateOrGetConversationMutation();
  const [sendConnectMessage] = useSendConnectMessageMutation();

  // Reset pagination when conversation changes
  useEffect(() => {
    setCursorBefore(undefined);
    setOlderMessages([]);
    setReplyToMessage(null);
  }, [activeConversationId]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId]
  );

  const otherParticipant = activeConversation?.participants[0];

  const allMessages = useMemo(() => {
    const map = new Map<string, ConnectMessage>();
    olderMessages.forEach((m) => map.set(m.id, m));
    currentMessages.forEach((m) => map.set(m.id, m));
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [olderMessages, currentMessages]);

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!cursorBefore) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages, cursorBefore]);

  const handleStartChatWithColleague = async (colleague: Colleague) => {
    try {
      const conv = await createOrGetConversation({
        targetUserId: colleague.id,
      }).unwrap();

      setActiveConversationId(conv.id);
      setChatActiveTab('chats');
      toast.success(`Connected with ${colleague.name}`, 'Chat Started');
    } catch {
      toast.error('Unable to initialize conversation. Please retry.', 'Chat Error');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputText.trim();
    if (!clean || !activeConversationId || isSending) return;

    setIsSending(true);
    setInputText('');

    try {
      await sendConnectMessage({
        conversationId: activeConversationId,
        text: clean,
        replyToMessageId: replyToMessage?.id,
      }).unwrap();

      setReplyToMessage(null);
      refetchMessages();
    } catch {
      toast.error('Failed to send message. Please retry.', 'Send Error');
      setInputText(clean);
    } finally {
      setIsSending(false);
    }
  };

  const renderPresenceDot = (status?: PresenceStatus) => {
    switch (status) {
      case 'online':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" title="Online" />;
      case 'busy':
        return <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900" title="Busy" />;
      case 'away':
        return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-zinc-900" title="Away" />;
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-zinc-600" title="Offline" />;
    }
  };

  const isOtherTyping = Boolean(otherParticipant?.userId && typingMap[otherParticipant.userId]);

  // =========================================================================
  // CALL TOOL STATES & LOGIC
  // =========================================================================
  const [activeCallContact, setActiveCallContact] = useState<string | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer: any;
    if (activeCallContact) {
      timer = setInterval(() => setCallDuration((p) => p + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [activeCallContact]);

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // =========================================================================
  // ANNOUNCEMENTS DATA & MUTATIONS (Real RTK Query Integration)
  // =========================================================================
  const { hasAnyRole } = useRBAC();
  const canManageAnnouncements = hasAnyRole(['SUPER_ADMIN', 'HR_ADMIN', 'IT_ADMIN']);

  const [announcementSearch, setAnnouncementSearch] = useState('');
  const [announcementPriority, setAnnouncementPriority] = useState<AnnouncementPriority | ''>('');
  const [announcementStatus, setAnnouncementStatus] = useState<AnnouncementStatus | ''>('');
  const [announcementDept, setAnnouncementDept] = useState('');
  const [announcementBranch, setAnnouncementBranch] = useState('');
  const [announcementPage, setAnnouncementPage] = useState(1);
  const announcementLimit = 20;

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState<AnnouncementResponse | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const queryParams = useMemo(() => ({
    search: announcementSearch.trim() || undefined,
    priority: (announcementPriority || undefined) as AnnouncementPriority | undefined,
    status: (announcementStatus || undefined) as AnnouncementStatus | undefined,
    department: announcementDept.trim() || undefined,
    branch: announcementBranch.trim() || undefined,
    page: announcementPage,
    limit: announcementLimit,
  }), [announcementSearch, announcementPriority, announcementStatus, announcementDept, announcementBranch, announcementPage, announcementLimit]);

  const {
    data: announcementsData,
    isLoading: isAnnouncementsLoading,
    isFetching: isAnnouncementsFetching,
    isError: isAnnouncementsError,
    error: announcementsError,
    refetch: refetchAnnouncements,
  } = useGetAnnouncementsQuery(queryParams);

  const announcements = announcementsData?.data ?? [];
  const announcementsTotal = announcementsData?.total ?? announcements.length;
  const announcementsTotalPages = announcementsData?.total_pages ?? Math.max(1, Math.ceil(announcementsTotal / announcementLimit));

  const [deleteAnnouncement] = useDeleteAnnouncementMutation();
  const [publishAnnouncement] = usePublishAnnouncementMutation();
  const [archiveAnnouncement] = useArchiveAnnouncementMutation();

  const handleEditAnnouncement = (ann: AnnouncementResponse) => {
    setAnnouncementToEdit(ann);
    setIsAnnouncementModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setAnnouncementToEdit(null);
    setIsAnnouncementModalOpen(true);
  };

  const handleDeleteAnnouncement = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setActionLoadingId(id);
    try {
      await deleteAnnouncement(id).unwrap();
      toast.success('Announcement removed from broadcast feed.', 'Deleted');
    } catch (err: any) {
      const msg = err?.data?.detail || err?.data?.message || 'Failed to delete announcement';
      if (err?.status === 403 || String(msg).toLowerCase().includes('department')) {
        toast.error('Only Super Admin, HR Admin, and IT Admin can manage announcements.', 'Permission Denied');
      } else {
        toast.error(msg, 'Error');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePublishAnnouncement = async (id: string) => {
    setActionLoadingId(id);
    try {
      await publishAnnouncement(id).unwrap();
      toast.success('Announcement published successfully to company feed.', 'Published');
    } catch (err: any) {
      const msg = err?.data?.detail || err?.data?.message || 'Failed to publish announcement';
      if (err?.status === 403 || String(msg).toLowerCase().includes('department')) {
        toast.error('Only Super Admin, HR Admin, and IT Admin can manage announcements.', 'Permission Denied');
      } else {
        toast.error(msg, 'Error');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleArchiveAnnouncement = async (id: string) => {
    setActionLoadingId(id);
    try {
      await archiveAnnouncement(id).unwrap();
      toast.success('Announcement archived.', 'Archived');
    } catch (err: any) {
      const msg = err?.data?.detail || err?.data?.message || 'Failed to archive announcement';
      if (err?.status === 403 || String(msg).toLowerCase().includes('department')) {
        toast.error('Only Super Admin, HR Admin, and IT Admin can manage announcements.', 'Permission Denied');
      } else {
        toast.error(msg, 'Error');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResetFilters = () => {
    setAnnouncementSearch('');
    setAnnouncementPriority('');
    setAnnouncementStatus('');
    setAnnouncementDept('');
    setAnnouncementBranch('');
    setAnnouncementPage(1);
  };

  const helpdeskTickets = [
    {
      id: 'TICK-402',
      title: 'VPN Access & MFA Token Reset',
      department: 'IT Infrastructure',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      updated: '10 mins ago',
    },
    {
      id: 'TICK-398',
      title: 'PF Passbook UAN Linking Verification',
      department: 'Payroll & Statutory',
      status: 'OPEN',
      priority: 'MEDIUM',
      updated: '2 hours ago',
    },
    {
      id: 'TICK-385',
      title: 'Ergonomic Chair & Dual Monitor Request',
      department: 'Admin & Facilities',
      status: 'RESOLVED',
      priority: 'LOW',
      updated: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 6 Connect KPI Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONNECT_MODULES.map((module) => {
          const Icon = module.icon;
          const isActive = activeTool === module.id;

          return (
            <div
              key={module.id}
              onClick={() => setActiveTool(module.id)}
              className={cn(
                'p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#171717] border shadow-sm',
                'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex items-center justify-between gap-3',
                isActive
                  ? 'border-indigo-500 ring-2 ring-indigo-500/25 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-md'
                  : 'border-gray-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500/60'
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTool(module.id);
                }
              }}
            >
              <span
                className={cn(
                  'text-xs font-semibold uppercase tracking-wider transition-colors',
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-gray-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                )}
              >
                {module.title}
              </span>
              <div
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105',
                  module.iconBg,
                  module.iconColor
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          MODULE 1: CHAT VIEW (Live 2-Pane Employee Messaging)
         ========================================================================= */}
      {activeTool === 'chat' && (
        <div className="h-[calc(100vh-14rem)] min-h-[550px] flex rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm">
          {/* Left Pane */}
          <aside className="w-80 sm:w-96 border-r border-gray-200 dark:border-zinc-800 flex flex-col h-full bg-white dark:bg-[#171717] shrink-0">
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/50">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    Direct Messages
                  </span>
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                    isSocketLive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
                  }`}
                >
                  {isSocketLive ? (
                    <>
                      <Wifi className="w-3 h-3 text-emerald-500" />
                      <span>Live WS</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-amber-500" />
                      <span>Polling</span>
                    </>
                  )}
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-zinc-800/60 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setChatActiveTab('chats')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                    chatActiveTab === 'chats'
                      ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-xs font-bold'
                      : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chats ({conversations.length})</span>
                </button>
                <button
                  onClick={() => setChatActiveTab('colleagues')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                    chatActiveTab === 'colleagues'
                      ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-xs font-bold'
                      : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Colleagues</span>
                </button>
              </div>
            </div>

            {/* Conversation List */}
            {chatActiveTab === 'chats' && (
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800/60">
                {isConversationsLoading ? (
                  <div className="p-8 text-center text-xs text-gray-400">Loading active chats...</div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center space-y-3">
                    <MessageSquare className="w-8 h-8 text-gray-300 dark:text-zinc-600 mx-auto" />
                    <p className="text-xs text-gray-500 dark:text-zinc-400">No active conversations yet.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setChatActiveTab('colleagues')}
                      className="rounded-xl text-xs"
                    >
                      Find a Colleague
                    </Button>
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const participant = conv.participants[0];
                    const isActive = conv.id === activeConversationId;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setActiveConversationId(conv.id)}
                        className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                          isActive
                            ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-l-4 border-indigo-600'
                            : 'hover:bg-gray-50 dark:hover:bg-zinc-800/40'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                            {participant?.name?.substring(0, 2).toUpperCase() || 'DM'}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5">
                            {renderPresenceDot(participant?.presenceStatus)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900 dark:text-[#ececec] truncate">
                              {participant?.name || 'Conversation'}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate mt-0.5">
                            {conv.lastMessagePreview || 'Started conversation'}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* Colleague Directory */}
            {chatActiveTab === 'colleagues' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-gray-100 dark:border-zinc-800/60">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search colleagues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800/60 p-1">
                  {(colleaguesData?.colleagues || []).map((c: Colleague) => (
                    <div
                      key={c.id}
                      onClick={() => handleStartChatWithColleague(c)}
                      className="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/40 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-zinc-200">
                            {c.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5">
                            {renderPresenceDot(c.presenceStatus)}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">{c.name}</h4>
                          <span className="text-[10px] text-gray-500 dark:text-zinc-400">{c.department || 'General'}</span>
                        </div>
                      </div>

                      <Button size="sm" variant="ghost" className="h-7 text-xs text-indigo-600">
                        Chat
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right Pane: Message Stream */}
          <main className="flex-1 flex flex-col h-full bg-[#fcfcfd] dark:bg-[#121212] overflow-hidden">
            {activeConversation ? (
              <>
                {/* Header */}
                <header className="h-14 px-5 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-[#171717] shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                      {otherParticipant?.name?.substring(0, 2).toUpperCase() || 'DM'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {otherParticipant?.name || 'Direct Conversation'}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-zinc-400">
                        <span className="capitalize">{otherParticipant?.presenceStatus || 'offline'}</span>
                        <span>•</span>
                        <span>{otherParticipant?.email || 'Tenant Isolated'}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      refetchMessages();
                      refetchConversations();
                    }}
                    className="rounded-xl text-xs flex items-center gap-1.5 h-8"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync</span>
                  </Button>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {allMessages.map((m) => {
                    const isSelf = otherParticipant ? m.senderId !== otherParticipant.userId : false;
                    return (
                      <div
                        key={m.id}
                        className={cn(
                          'flex flex-col max-w-[80%]',
                          isSelf ? 'ml-auto items-end' : 'mr-auto items-start'
                        )}
                      >
                        <div
                          className={cn(
                            'p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs',
                            isSelf
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700/60 rounded-tl-none'
                          )}
                        >
                          {m.content}
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 px-1">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                  {isOtherTyping && (
                    <div className="text-xs text-gray-400 italic">Colleague is typing...</div>
                  )}
                  <div ref={messageEndRef} />
                </div>

                {/* Composer */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-[#171717] border-t border-gray-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        if (otherParticipant?.userId) {
                          sendTyping(otherParticipant.userId, true);
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <Button type="submit" disabled={!inputText.trim() || isSending} size="sm" className="bg-indigo-600 text-white rounded-xl h-10 px-4">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <MessageSquare className="w-10 h-10 text-gray-300 dark:text-zinc-600" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">OFC360 Connect Chat</h3>
                <p className="text-xs text-gray-500 max-w-sm">Select an active conversation or pick a colleague from the directory to start messaging.</p>
              </div>
            )}
          </main>
        </div>
      )}

      {/* =========================================================================
          MODULE 2: CALL VIEW (Voice & Audio Hub)
         ========================================================================= */}
      {activeTool === 'call' && (
        <div className="space-y-6">
          {/* Active Call Banner if active */}
          {activeCallContact && (
            <div className="p-4 rounded-2xl bg-emerald-600 text-white flex items-center justify-between shadow-lg animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
                  <PhoneCall className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Call with {activeCallContact}</h4>
                  <p className="text-xs text-emerald-100 flex items-center gap-2">
                    <span>Connected ({formatCallTime(callDuration)})</span>
                    <span>•</span>
                    <span>High Definition Audio</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={cn(
                    'rounded-xl text-xs',
                    isMicMuted ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                  )}
                >
                  {isMicMuted ? <MicOff className="w-4 h-4 mr-1" /> : <Mic className="w-4 h-4 mr-1" />}
                  <span>{isMicMuted ? 'Unmute' : 'Mute'}</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    toast.info(`Call ended with ${activeCallContact}`, 'Call Disconnected');
                    setActiveCallContact(null);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs flex items-center gap-1.5"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call</span>
                </Button>
              </div>
            </div>
          )}

          {/* Call Colleagues & History Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Audio Dial Directory */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Instant Voice Calling</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Zero-latency peer audio calls across your organization</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Audio Bridge Active
                </span>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                {(colleaguesData?.colleagues || []).slice(0, 6).map((c: Colleague) => (
                  <div key={c.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-zinc-200">
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5">
                          {renderPresenceDot(c.presenceStatus)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">{c.name}</h4>
                        <p className="text-[10px] text-gray-500 dark:text-zinc-400">{c.department || 'General'} • {c.designation || 'Colleague'}</p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => {
                        setActiveCallContact(c.name);
                        toast.success(`Calling ${c.name}...`, 'Voice Call');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs flex items-center gap-1.5 h-8 px-3"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Call Logs */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Call Logs</h3>
              <div className="space-y-3">
                {[
                  { name: 'Vinit Sharma', duration: '14m 20s', time: '10:45 AM', type: 'incoming' },
                  { name: 'Priya Verma', duration: '4m 12s', time: 'Yesterday', type: 'outgoing' },
                  { name: 'Amit Patel', duration: 'Missed', time: '2 days ago', type: 'missed' },
                ].map((log, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-gray-900 dark:text-white">{log.name}</h5>
                      <span className="text-[10px] text-gray-500 dark:text-zinc-400">{log.time}</span>
                    </div>
                    <span className={cn('text-[11px] font-semibold', log.type === 'missed' ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400')}>
                      {log.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 3: MEET VIEW (Video Meeting Launcher & Intelligence)
         ========================================================================= */}
      {activeTool === 'meet' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">OFC360 Video Meet & Rooms</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">High definition encrypted team video conferences with AI automated minutes</p>
            </div>
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/ai/meeting-intelligence')}
                className="rounded-xl text-xs flex items-center gap-1.5"
              >
                <Video className="w-4 h-4 text-blue-600" />
                <span>Meeting Intelligence AI</span>
              </Button>
              <Button
                size="sm"
                onClick={() => toast.success('Instant Meeting Room created: meet.ofc360.internal/room-492', 'Meeting Live')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Start Instant Meet</span>
              </Button>
            </div>
          </div>

          {/* Scheduled Meetings List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[
              { title: 'Weekly Product & Sprint Sync', time: '11:00 AM - 11:45 AM', attendees: 8 },
              { title: 'HR Policy Townhall & Q&A', time: '3:00 PM - 4:00 PM', attendees: 45 },
              { title: 'Engineering Architecture Review', time: 'Tomorrow 10:00 AM', attendees: 6 },
            ].map((meet, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200">
                    Scheduled
                  </span>
                  <span className="text-[11px] text-gray-500">{meet.attendees} Members</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{meet.title}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{meet.time}</span>
                  </p>
                </div>
                <Button size="sm" onClick={() => toast.info(`Joining ${meet.title}...`, 'Connecting')} className="w-full bg-blue-600 text-white rounded-xl text-xs h-8">
                  Join Meeting
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 4: SLACK VIEW (Slack Workspace & Channel Sync)
         ========================================================================= */}
      {activeTool === 'slack' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Hash className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Slack Workspace Integration</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Connected to ofc360-enterprise.slack.com • Real-time Webhook Synced</p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => toast.success('Synchronized 14 new channel notifications from Slack.', 'Sync Complete')}
              variant="outline"
              className="rounded-xl text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Channels</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: '#general', unread: 3, desc: 'Company-wide announcements & watercooler' },
              { name: '#tech-engineering', unread: 12, desc: 'Sprint commits, bugs, and release builds' },
              { name: '#payroll-alerts', unread: 0, desc: 'Automated salary statements & tax alerts' },
              { name: '#hr-helpdesk', unread: 2, desc: 'Employee tickets & onboarding queries' },
            ].map((ch, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-amber-500" />
                    <span>{ch.name}</span>
                  </span>
                  {ch.unread > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                      {ch.unread}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400 line-clamp-2">{ch.desc}</p>
                <Button size="sm" variant="ghost" className="text-xs text-amber-600 dark:text-amber-400 p-0 h-6">
                  Open Channel →
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 5: ANNOUNCEMENT VIEW (Broadcast & Bulletin Board)
         ========================================================================= */}
      {activeTool === 'announcement' && (
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Organization Broadcasts & Announcements</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold border border-rose-200 dark:border-rose-900">
                  {announcementsTotal}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Official company news, policy updates, and circulars</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchAnnouncements()}
                className="text-xs rounded-xl"
                disabled={isAnnouncementsFetching}
                aria-label="Refresh announcements"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isAnnouncementsFetching && "animate-spin")} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              {canManageAnnouncements && (
                <Button
                  size="sm"
                  onClick={handleOpenCreateModal}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Post Announcement</span>
                </Button>
              )}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200/80 dark:border-zinc-800">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={announcementSearch}
                onChange={(e) => {
                  setAnnouncementSearch(e.target.value);
                  setAnnouncementPage(1);
                }}
                placeholder="Search announcements..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={announcementPriority}
              onChange={(e) => {
                setAnnouncementPriority(e.target.value as AnnouncementPriority | '');
                setAnnouncementPage(1);
              }}
              aria-label="Filter by priority"
              className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            {/* Status Filter */}
            <select
              value={announcementStatus}
              onChange={(e) => {
                setAnnouncementStatus(e.target.value as AnnouncementStatus | '');
                setAnnouncementPage(1);
              }}
              aria-label="Filter by status"
              className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              <option value="">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            {/* Department Filter */}
            <input
              type="text"
              value={announcementDept}
              onChange={(e) => {
                setAnnouncementDept(e.target.value);
                setAnnouncementPage(1);
              }}
              placeholder="Filter Dept..."
              className="w-28 sm:w-32 px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />

            {/* Branch Filter */}
            <input
              type="text"
              value={announcementBranch}
              onChange={(e) => {
                setAnnouncementBranch(e.target.value);
                setAnnouncementPage(1);
              }}
              placeholder="Filter Branch..."
              className="w-28 sm:w-32 px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />

            {/* Reset Filters */}
            {(announcementSearch || announcementPriority || announcementStatus || announcementDept || announcementBranch) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-1.5 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors flex items-center gap-1 shrink-0"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>

          {/* Loading Skeleton State */}
          {isAnnouncementsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {!isAnnouncementsLoading && isAnnouncementsError && (
            <ErrorDisplay
              error={announcementsError}
              onRetry={refetchAnnouncements}
              className="py-8"
            />
          )}

          {/* Empty State */}
          {!isAnnouncementsLoading && !isAnnouncementsError && announcements.length === 0 && (
            <EmptyState
              icon={<Megaphone className="w-6 h-6 text-rose-500" />}
              title="No Announcements Found"
              description={
                announcementSearch || announcementPriority || announcementStatus || announcementDept || announcementBranch
                  ? 'No announcements match the selected filter criteria.'
                  : 'Official company broadcasts, policy updates, and circulars will appear here once published.'
              }
              action={
                canManageAnnouncements
                  ? {
                      label: 'Post First Announcement',
                      onClick: handleOpenCreateModal,
                    }
                  : undefined
              }
            />
          )}

          {/* Live Data List */}
          {!isAnnouncementsLoading && !isAnnouncementsError && announcements.length > 0 && (
            <div className="space-y-4">
              {announcements.map((item) => (
                <AnnouncementFeedCard
                  key={item.id}
                  announcement={item}
                  onEdit={handleEditAnnouncement}
                  onDelete={handleDeleteAnnouncement}
                  onPublish={handlePublishAnnouncement}
                  onArchive={handleArchiveAnnouncement}
                  isActionLoading={actionLoadingId === item.id}
                />
              ))}

              {/* Pagination Controls */}
              {announcementsTotalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-zinc-800 text-xs">
                  <span className="text-gray-500 dark:text-zinc-400">
                    Page {announcementPage} of {announcementsTotalPages} ({announcementsTotal} total)
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAnnouncementPage((p) => Math.max(1, p - 1))}
                      disabled={announcementPage <= 1}
                      className="rounded-xl text-xs h-8 px-3 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAnnouncementPage((p) => Math.min(announcementsTotalPages, p + 1))}
                      disabled={announcementPage >= announcementsTotalPages}
                      className="rounded-xl text-xs h-8 px-3 flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODULE 6: HELP DESK VIEW (Service Desk & Support Tickets)
         ========================================================================= */}
      {activeTool === 'helpdesk' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Internal Employee Help Desk</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Submit and monitor IT, HR, and Administrative support tickets</p>
            </div>
            <Button
              size="sm"
              onClick={() => toast.success('Ticket form opened. Select department to proceed.', 'New Ticket')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Raise Ticket</span>
            </Button>
          </div>

          <div className="space-y-3">
            {helpdeskTickets.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">{t.id}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{t.title}</h4>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">{t.department} • Updated {t.updated}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : t.status === 'IN_PROGRESS'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400'
                        : 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400'
                    )}
                  >
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Corporate Announcement Creation and Edit Modal */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => {
          setIsAnnouncementModalOpen(false);
          setAnnouncementToEdit(null);
        }}
        announcementToEdit={announcementToEdit}
        onSuccess={() => {
          refetchAnnouncements();
        }}
      />
    </div>
  );
};

export default ConnectPage;
