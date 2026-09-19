"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type {
  NotificationItem,
  NotificationListResponse,
  NotificationFilterTab,
} from "@/types/notification";

interface UseNotificationsReturn {
  notifications: NotificationItem[];
  unreadCount: number;
  totalCount: number;
  loading: boolean;
  filterTab: NotificationFilterTab;
  setFilterTab: (tab: NotificationFilterTab) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useNotifications(pollIntervalMs = 30000): UseNotificationsReturn {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterTab, setFilterTab] = useState<NotificationFilterTab>("all");
  const abortRef = useRef<AbortController | null>(null);

  const fetchNotifications = useCallback(async (tab: NotificationFilterTab = filterTab) => {
    if (!user) return;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const params: Record<string, string | boolean | number> = {
        page: 1,
        page_size: 30,
      };

      if (tab === "unread") {
        params.unread_only = true;
      } else if (tab === "attendance") {
        params.category = "attendance";
      } else if (tab === "system") {
        params.category = "system";
      }

      const res = await api.get<NotificationListResponse>("/notifications", {
        params,
        signal: controller.signal,
      });

      setNotifications(res.data.items || []);
      setUnreadCount(res.data.unread_count || 0);
      setTotalCount(res.data.total_count || 0);
    } catch (err: unknown) {
      if ((err as { name?: string })?.name !== "CanceledError") {
        // Fallback gracefully on network issues
      }
    } finally {
      setLoading(false);
    }
  }, [user, filterTab]);

  useEffect(() => {
    void fetchNotifications(filterTab);
  }, [fetchNotifications, filterTab]);

  // Periodic polling for fresh real-time alerts
  useEffect(() => {
    if (!user || pollIntervalMs <= 0) return;
    const interval = setInterval(() => {
      void fetchNotifications(filterTab);
    }, pollIntervalMs);
    return () => clearInterval(interval);
  }, [user, pollIntervalMs, fetchNotifications, filterTab]);

  const markAsRead = async (id: string): Promise<void> => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      // Revert if request fails
      void fetchNotifications(filterTab);
    }
  };

  const markAllRead = async (): Promise<void> => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      await api.patch("/notifications/mark-all-read");
    } catch {
      void fetchNotifications(filterTab);
    }
  };

  const deleteNotification = async (id: string): Promise<void> => {
    const target = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (target && !target.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setTotalCount((prev) => Math.max(0, prev - 1));

    try {
      await api.delete(`/notifications/${id}`);
    } catch {
      void fetchNotifications(filterTab);
    }
  };

  return {
    notifications,
    unreadCount,
    totalCount,
    loading,
    filterTab,
    setFilterTab,
    markAsRead,
    markAllRead,
    deleteNotification,
    refetch: () => fetchNotifications(filterTab),
  };
}
