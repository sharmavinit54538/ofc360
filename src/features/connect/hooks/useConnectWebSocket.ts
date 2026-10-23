/**
 * @file useConnectWebSocket.ts
 * @description Real-time WebSocket hook for OFC360 Connect.
 * Handles dynamic URL derivation, JWT auth, bidirectional typing events,
 * room join/leave, ping/pong heartbeats, exponential backoff reconnection,
 * and optimistic cache patching via connectApi.util.updateQueryData.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectApi, normalizeMessage } from '../api/connectApi';
import type { AppDispatch, RootState } from '@/app/store';

/**
 * Derives the WebSocket URL dynamically from API base URL.
 * Converts http:// -> ws:// and https:// -> wss://
 * Appends /connect/ws and attaches token query param.
 */
export const deriveConnectWebSocketUrl = (
  baseUrl: string = import.meta.env.VITE_API_BASE_URL || 'https://api.ofc360.com/api/v1',
  token?: string | null
): string => {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const wsProto = cleanBase.startsWith('https://') ? 'wss://' : 'ws://';
  const hostAndPath = cleanBase.replace(/^https?:\/\//, '');
  const wsEndpoint = `${wsProto}${hostAndPath}/connect/ws`;

  return token ? `${wsEndpoint}?token=${encodeURIComponent(token)}` : wsEndpoint;
};

export interface UseConnectWebSocketOptions {
  activeConversationId?: string;
  onNewMessage?: (conversationId: string, message: any) => void;
}

export const useConnectWebSocket = (options?: UseConnectWebSocketOptions) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSocketLive, setIsSocketLive] = useState<boolean>(false);
  const [typingMap, setTypingMap] = useState<Record<string, boolean>>({});

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Resolve JWT token from Redux auth state with fallback to localStorage/sessionStorage
  const reduxToken = useSelector((state: RootState) => state.auth?.accessToken);
  const getAccessToken = useCallback((): string | null => {
    if (reduxToken) return reduxToken;
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('ofc360_access_token') ||
        sessionStorage.getItem('ofc360_access_token') ||
        null
      );
    }
    return null;
  }, [reduxToken]);

  // Connect & setup socket
  const connectSocket = useCallback(() => {
    const token = getAccessToken();
    if (!token) {
      setIsSocketLive(false);
      return;
    }

    // Cleanup previous socket if any
    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch {}
      socketRef.current = null;
    }

    const wsUrl = deriveConnectWebSocketUrl(import.meta.env.VITE_API_BASE_URL, token);

    try {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        setIsSocketLive(true);
        reconnectAttempts.current = 0;

        // Start 30s ping heartbeat
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ event: 'ping', timestamp: Date.now() }));
          }
        }, 30000);
      };

      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const eventType = (parsed.event || parsed.type || '').toLowerCase();
          const payload = parsed.data || parsed;

          // 1. Handle incoming new message
          if (eventType === 'new_message' || eventType === 'message') {
            const conversationId = payload.conversation_id || payload.conversationId || parsed.conversation_id;
            const messageObj = payload.message || payload;

            if (conversationId && messageObj && messageObj.id) {
              const normalized = normalizeMessage(messageObj);

              // Optimistically update RTK Query cache for this conversation
              dispatch(
                connectApi.util.updateQueryData(
                  'getConnectMessages',
                  { conversationId: String(conversationId) },
                  (draft) => {
                    const exists = draft.some((m) => m.id === normalized.id);
                    if (!exists) {
                      draft.push(normalized);
                    }
                  }
                )
              );

              // Invalidate conversations list so last message preview and unread counts update
              dispatch(connectApi.util.invalidateTags(['ConnectConversations']));

              if (options?.onNewMessage) {
                options.onNewMessage(String(conversationId), normalized);
              }
            }
          }

          // 2. Handle typing indicator
          if (eventType === 'typing') {
            const senderUserId = payload.user_id || payload.userId || parsed.user_id;
            const isTyping = Boolean(payload.is_typing ?? payload.isTyping ?? true);

            if (senderUserId) {
              setTypingMap((prev) => ({
                ...prev,
                [senderUserId]: isTyping,
              }));

              // Clear previous auto-timeout for this user
              if (typingTimeoutsRef.current[senderUserId]) {
                clearTimeout(typingTimeoutsRef.current[senderUserId]);
              }

              // Auto-dismiss typing status after 3.5 seconds
              if (isTyping) {
                typingTimeoutsRef.current[senderUserId] = setTimeout(() => {
                  setTypingMap((prev) => ({
                    ...prev,
                    [senderUserId]: false,
                  }));
                }, 3500);
              }
            }
          }
        } catch {
          // Ignore invalid frames
        }
      };

      socket.onclose = () => {
        setIsSocketLive(false);
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

        // Exponential backoff reconnect: 1s, 2s, 4s, 8s ... max 30s
        const backoff = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current += 1;

        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSocket();
        }, backoff);
      };

      socket.onerror = () => {
        setIsSocketLive(false);
      };
    } catch {
      setIsSocketLive(false);
    }
  }, [dispatch, getAccessToken, options]);

  useEffect(() => {
    connectSocket();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      Object.values(typingTimeoutsRef.current).forEach(clearTimeout);
      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch {}
      }
    };
  }, [connectSocket]);

  // Support sending typing indicator
  const sendTyping = useCallback((targetUserId: string, isTyping: boolean = true) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          event: 'typing',
          target_user_id: targetUserId,
          targetUserId,
          is_typing: isTyping,
        })
      );
    }
  }, []);

  // Support join room
  const joinRoom = useCallback((roomId: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          event: 'join_room',
          data: { room_id: roomId },
        })
      );
    }
  }, []);

  // Support leave room
  const leaveRoom = useCallback((roomId: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          event: 'leave_room',
          data: { room_id: roomId },
        })
      );
    }
  }, []);

  return {
    isSocketLive,
    sendTyping,
    joinRoom,
    leaveRoom,
    typingMap,
    reconnect: connectSocket,
  };
};

export default useConnectWebSocket;
