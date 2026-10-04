"use client";

import React from "react";
import { Bell, Inbox, AlertTriangle, Radio } from "lucide-react";
import GlassStatCard from "@/components/ui/GlassStatCard";
import type { NotificationItem } from "@/types/notification";

interface NotificationStatsGridProps {
  notifications: NotificationItem[];
  unreadCount: number;
  totalCount: number;
}

export function NotificationStatsGrid({
  notifications,
  unreadCount,
  totalCount,
}: NotificationStatsGridProps): React.JSX.Element {
  const criticalCount = notifications.filter(
    (n) => n.type === "danger" || n.type === "critical" || n.type === "warning"
  ).length;

  const broadcastCount = notifications.filter(
    (n) => n.category === "system" || n.category === "maintenance" || n.category === "update"
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <GlassStatCard
        icon={<Inbox size={16} />}
        label="Total Alerts"
        value={totalCount}
        accentColor="blue"
        subtext="Stored in inbox"
      />
      <GlassStatCard
        icon={<Bell size={16} />}
        label="Unread"
        value={unreadCount}
        accentColor="amber"
        subtext={unreadCount > 0 ? "Awaiting review" : "All caught up"}
      />
      <GlassStatCard
        icon={<AlertTriangle size={16} />}
        label="Critical & Warnings"
        value={criticalCount}
        accentColor="rose"
        subtext="Priority events"
      />
      <GlassStatCard
        icon={<Radio size={16} />}
        label="System / Broadcasts"
        value={broadcastCount}
        accentColor="purple"
        subtext="Platform notices"
      />
    </div>
  );
}
