"use client";

import React, { useState } from "react";
import { Bell, CheckCheck, X, Megaphone, Loader2, Inbox } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationTabs from "./notifications/NotificationTabs";
import NotificationItemRow from "./notifications/NotificationItemRow";
import BroadcastNotificationModal from "@/components/admin/BroadcastNotificationModal";

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPopover({
  isOpen,
  onClose,
}: NotificationPopoverProps): React.ReactElement | null {
  const { user } = useAuthStore();
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    filterTab,
    setFilterTab,
    markAsRead,
    markAllRead,
    deleteNotification,
    refetch,
  } = useNotifications(25000);

  if (!isOpen) return null;

  const isAdmin = user?.role === "ADMIN";

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 flex flex-col">
        {/* Header */}
        <div className="p-3.5 border-b border-border flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-foreground" />
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-[Outfit]">
              Notifications
            </h4>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="text-[11px] text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck size={12} />
                <span>Mark all read</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
              aria-label="Close notifications"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <NotificationTabs
          activeTab={filterTab}
          onTabChange={setFilterTab}
          unreadCount={unreadCount}
        />

        {/* List Content */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border/60 min-h-36">
          {loading && notifications.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 size={18} className="animate-spin text-primary" />
              <p className="text-xs">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-10 px-4 flex flex-col items-center justify-center text-center">
              <div className="p-2.5 rounded-full bg-secondary/80 text-muted-foreground mb-2">
                <Inbox size={18} />
              </div>
              <p className="text-xs font-semibold text-foreground">All caught up!</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                No {filterTab !== "all" ? filterTab : ""} notifications at this time.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <NotificationItemRow
                key={notif.id}
                notification={notif}
                onMarkRead={(id) => void markAsRead(id)}
                onDelete={(id) => void deleteNotification(id)}
                onClosePopover={onClose}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-border bg-secondary/20 flex items-center justify-between text-[11px] text-muted-foreground shrink-0">
          <span className="text-[10px] font-medium">Real-time alerts active</span>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsBroadcastOpen(true)}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer"
            >
              <Megaphone size={11} />
              <span>Broadcast</span>
            </button>
          )}
        </div>
      </div>

      {isAdmin && (
        <BroadcastNotificationModal
          isOpen={isBroadcastOpen}
          onClose={() => setIsBroadcastOpen(false)}
          onSuccess={() => void refetch()}
        />
      )}
    </>
  );
}
