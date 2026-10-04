"use client";

import React from "react";
import Link from "next/link";
import { CheckCheck, RotateCw, Plus } from "lucide-react";

interface ActionButtonProps {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NotificationHeaderProps {
  title: string;
  description: string;
  unreadCount: number;
  loading: boolean;
  onRefresh: () => void;
  onMarkAllRead: () => void;
  actionButton?: ActionButtonProps;
}

export function NotificationHeader({
  title,
  description,
  unreadCount,
  loading,
  onRefresh,
  onMarkAllRead,
  actionButton,
}: NotificationHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground font-[Outfit]">
            {title}
          </h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {unreadCount} unread
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center p-2 text-xs text-muted-foreground hover:text-foreground bg-card hover:bg-muted border border-border rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          title="Refresh notifications"
          aria-label="Refresh notifications"
        >
          <RotateCw size={14} className={loading ? "animate-spin text-primary" : ""} />
        </button>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-card hover:bg-muted border border-border rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            <CheckCheck size={14} className="text-emerald-500" />
            <span>Mark all read</span>
          </button>
        )}

        {actionButton && (
          <Link
            href={actionButton.href}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow-xs transition-colors"
          >
            {actionButton.icon || <Plus size={14} />}
            <span>{actionButton.label}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
