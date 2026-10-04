"use client";

import React, { useState } from "react";
import { Inbox, AlertCircle, RotateCw, Trash2, X } from "lucide-react";
import { NotificationFeedItem } from "./NotificationFeedItem";
import GlassConfirmDialog from "@/components/ui/GlassConfirmDialog";
import type { NotificationItem } from "@/types/notification";

interface NotificationFeedListProps {
  notifications: NotificationItem[];
  loading: boolean;
  error: string | null;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onDeleteSelected?: () => Promise<void>;
  onDeleteAll?: () => Promise<void>;
  onRetry: () => void;
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  searchQuery?: string;
}

export function NotificationFeedList({
  notifications,
  loading,
  error,
  selectedIds = new Set(),
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  onDeleteAll,
  onRetry,
  onMarkAsRead,
  searchQuery,
}: NotificationFeedListProps): React.JSX.Element {
  const [confirmDeleteAllOpen, setConfirmDeleteAllOpen] = useState(false);
  const [confirmDeleteSelectedOpen, setConfirmDeleteSelectedOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (loading && notifications.length === 0) {
    return (
      <div className="space-y-2.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-card border border-border animate-pulse flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted shrink-0" />
            <div className="flex-1 space-y-2"><div className="w-24 h-3 bg-muted rounded" /><div className="w-2/3 h-4 bg-muted rounded" /></div>
          </div>
        ))}
      </div>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-rose-500/5 border border-rose-500/20 text-center space-y-2.5">
        <div className="inline-flex p-2.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400"><AlertCircle size={22} /></div>
        <h3 className="text-sm font-semibold text-foreground">Failed to load notifications</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">{error}</p>
        <button type="button" onClick={onRetry} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer">
          <RotateCw size={12} /><span>Try Again</span>
        </button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-10 rounded-xl bg-card border border-border text-center space-y-2.5">
        <div className="inline-flex p-3 rounded-xl bg-muted text-muted-foreground"><Inbox size={26} /></div>
        <h3 className="text-sm font-semibold text-foreground">{searchQuery ? "No matching notifications" : "No notifications in feed"}</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          {searchQuery ? `No alerts match "${searchQuery}". Try adjusting your search query or filters.` : "You are all caught up! New alerts and updates will appear here automatically."}
        </p>
      </div>
    );
  }

  const allSelected = notifications.length > 0 && notifications.every((n) => selectedIds.has(n.id));
  const selectedCount = selectedIds.size;

  const handleDeleteSelected = async () => {
    if (!onDeleteSelected) return;
    setDeleting(true);
    try { await onDeleteSelected(); setConfirmDeleteSelectedOpen(false); } finally { setDeleting(false); }
  };

  const handleDeleteAll = async () => {
    if (!onDeleteAll) return;
    setDeleting(true);
    try { await onDeleteAll(); setConfirmDeleteAllOpen(false); } finally { setDeleting(false); }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 px-3 py-2 bg-card/60 border border-border/80 rounded-lg text-xs">
        <div className="flex items-center gap-2.5">
          {onSelectAll && (
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
              />
              <span className="text-muted-foreground font-medium">
                {selectedCount > 0 ? `${selectedCount} selected` : "Select all"}
              </span>
            </label>
          )}

          {selectedCount > 0 && onClearSelection && (
            <button
              type="button"
              onClick={onClearSelection}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={12} />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedCount > 0 && onDeleteSelected && (
            <button
              type="button"
              onClick={() => setConfirmDeleteSelectedOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Delete ({selectedCount})</span>
            </button>
          )}

          {onDeleteAll && (
            <button
              type="button"
              onClick={() => setConfirmDeleteAllOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Delete all</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        {notifications.map((notification) => (
          <NotificationFeedItem
            key={notification.id}
            notification={notification}
            isSelected={selectedIds.has(notification.id)}
            onToggleSelect={onToggleSelect}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>

      <GlassConfirmDialog
        isOpen={confirmDeleteSelectedOpen}
        title="Delete Selected Notifications"
        message={`Delete ${selectedCount} selected notification(s)? This cannot be undone.`}
        confirmLabel="Delete Selected"
        onConfirm={() => void handleDeleteSelected()}
        onCancel={() => setConfirmDeleteSelectedOpen(false)}
        loading={deleting}
      />
      <GlassConfirmDialog
        isOpen={confirmDeleteAllOpen}
        title="Delete All Notifications"
        message="Delete all notifications from your inbox? This cannot be undone."
        confirmLabel="Delete All"
        onConfirm={() => void handleDeleteAll()}
        onCancel={() => setConfirmDeleteAllOpen(false)}
        loading={deleting}
      />
    </div>
  );
}
