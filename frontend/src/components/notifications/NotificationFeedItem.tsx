"use client";

import React from "react";
import Link from "next/link";
import {
  CalendarCheck,
  FileText,
  Smartphone,
  ShieldAlert,
  Radio,
  Wrench,
  Sparkles,
  ExternalLink,
  Check,
} from "lucide-react";
import type { NotificationItem, NotificationCategory } from "@/types/notification";

interface NotificationFeedItemProps {
  notification: NotificationItem;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

function getCategoryIcon(category: NotificationCategory) {
  switch (category) {
    case "attendance":
      return <CalendarCheck size={15} className="text-emerald-500" />;
    case "leave":
      return <FileText size={15} className="text-amber-500" />;
    case "device":
      return <Smartphone size={15} className="text-sky-500" />;
    case "security":
      return <ShieldAlert size={15} className="text-rose-500" />;
    case "maintenance":
      return <Wrench size={15} className="text-orange-500" />;
    case "update":
      return <Sparkles size={15} className="text-purple-500" />;
    case "system":
    default:
      return <Radio size={15} className="text-blue-500" />;
  }
}

function formatRelativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return d.toLocaleDateString();
  } catch {
    return dateStr;
  }
}

export function NotificationFeedItem({
  notification,
  isSelected = false,
  onToggleSelect,
  onMarkAsRead,
}: NotificationFeedItemProps): React.JSX.Element {
  const isUnread = !notification.is_read;

  const content = (
    <div
      className={`group relative p-3.5 sm:p-4 rounded-xl border transition-all duration-150 ${
        isSelected
          ? "bg-primary/10 border-primary/50 shadow-xs"
          : isUnread
          ? "bg-card border-border border-l-[3.5px] border-l-primary shadow-xs hover:border-border/80"
          : "bg-card/30 border-border/50 opacity-70 hover:opacity-100 hover:bg-card hover:border-border"
      }`}
    >
      <div className="flex items-start gap-3">
        {onToggleSelect && (
          <div className="pt-1 shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(notification.id)}
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
              aria-label={`Select ${notification.title}`}
            />
          </div>
        )}

        <div
          className={`p-2 rounded-lg border shrink-0 mt-0.5 transition-colors ${
            isUnread
              ? "bg-primary/10 border-primary/20"
              : "bg-muted/40 border-border/40 text-muted-foreground"
          }`}
        >
          {getCategoryIcon(notification.category)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <h3
                className={`text-sm tracking-tight truncate ${
                  isUnread
                    ? "font-semibold text-foreground"
                    : "font-normal text-muted-foreground"
                }`}
              >
                {notification.title}
              </h3>
              {isUnread && (
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/20 shrink-0">
                  NEW
                </span>
              )}
            </div>
            <span
              className={`text-[11px] shrink-0 ${
                isUnread ? "text-foreground/70 font-medium" : "text-muted-foreground/70"
              }`}
            >
              {formatRelativeTime(notification.created_at)}
            </span>
          </div>

          <p
            className={`text-xs sm:text-sm mt-1 leading-relaxed break-words whitespace-pre-line ${
              isUnread ? "text-foreground/80 font-normal" : "text-muted-foreground/70"
            }`}
          >
            {notification.message}
          </p>
        </div>

        {isUnread && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void onMarkAsRead(notification.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-all cursor-pointer shrink-0"
            title="Mark as read"
            aria-label="Mark as read"
          >
            <Check size={14} />
          </button>
        )}

        {notification.link && !isUnread && (
          <div className="text-muted-foreground/40 group-hover:text-muted-foreground p-1 shrink-0 transition-colors">
            <ExternalLink size={13} />
          </div>
        )}
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link
        href={notification.link}
        onClick={() => {
          if (isUnread) void onMarkAsRead(notification.id);
        }}
        className="block"
      >
        {content}
      </Link>
    );
  }

  return content;
}
