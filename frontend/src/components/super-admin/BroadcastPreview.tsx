"use client";

import React from "react";
import { Radio, AlertTriangle, AlertCircle, Info, CheckCircle2, Bell } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GlassBadge, { type BadgeVariant } from "@/components/ui/GlassBadge";
import type { GlobalBroadcastRequest } from "@/types/tenant";

interface BroadcastPreviewProps {
  broadcast: GlobalBroadcastRequest;
}

export default function BroadcastPreview({ broadcast }: BroadcastPreviewProps): React.ReactElement {
  const getTypeIcon = (): React.ReactElement => {
    switch (broadcast.type) {
      case "critical":
        return <AlertCircle size={18} className="text-destructive" />;
      case "warning":
        return <AlertTriangle size={18} className="text-amber-500" />;
      case "success":
        return <CheckCircle2 size={18} className="text-emerald-500" />;
      case "info":
      default:
        return <Info size={18} className="text-blue-500" />;
    }
  };

  const getTypeVariant = (): BadgeVariant => {
    switch (broadcast.type) {
      case "critical":
        return "danger";
      case "warning":
        return "warning";
      case "success":
        return "success";
      case "info":
      default:
        return "info";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Bell size={14} className="text-primary" />
        <span>Live User Notification Preview</span>
      </div>

      <GlassCard className="p-5 border-border space-y-4">
        {/* Live Broadcast UI Preview Card */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-lg bg-card border border-border shrink-0 mt-0.5">
                {getTypeIcon()}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">
                  {broadcast.title || "Platform Announcement Title"}
                </h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <GlassBadge variant={getTypeVariant()}>
                    {broadcast.category.toUpperCase()}
                  </GlassBadge>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Audience: {broadcast.target_role || "ALL USERS"}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">Just now</span>
          </div>

          <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed pl-10">
            {broadcast.message || "Write an announcement message in the form on the left to see how it will appear across client web portals and teacher apps."}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 text-[11px] text-muted-foreground flex items-center gap-2">
          <Radio size={14} className="text-primary shrink-0 animate-pulse" />
          <span>Broadcast notifications are dispatched instantly to all active client sockets and stored in user inboxes.</span>
        </div>
      </GlassCard>
    </div>
  );
}
