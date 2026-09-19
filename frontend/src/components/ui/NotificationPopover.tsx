"use client";

import React, { useState } from "react";
import { Bell, CheckCheck, ShieldCheck, Radio, Sparkles, X } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "success" | "info" | "warning";
  read: boolean;
}

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPopover({ isOpen, onClose }: NotificationPopoverProps): React.ReactElement | null {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Biometric Node Online",
      message: "FaceNet 128-d & MobileNetV2 liveness pipeline initialized successfully.",
      time: "10m ago",
      type: "success",
      read: false,
    },
    {
      id: "notif-2",
      title: "Geofence Synchronized",
      message: "Haversine ellipsoid calibrated across all campus amphitheaters.",
      time: "1h ago",
      type: "info",
      read: false,
    },
    {
      id: "notif-3",
      title: "Zero-Trust Active",
      message: "All attendance transactions require multi-factor verification.",
      time: "2h ago",
      type: "success",
      read: true,
    },
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="p-3.5 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-foreground" />
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-[Outfit]">Notifications</h4>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <CheckCheck size={12} />
                <span>Mark all read</span>
              </button>
            )}
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-0.5 rounded">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-3 hover:bg-secondary/40 transition-colors flex gap-2.5 ${notif.read ? "opacity-75" : "bg-primary/5"}`}
            >
              <div className="mt-0.5 shrink-0">
                {notif.type === "success" ? (
                  <div className="p-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600">
                    <ShieldCheck size={13} />
                  </div>
                ) : notif.type === "info" ? (
                  <div className="p-1 rounded-md bg-sky-50 border border-sky-100 text-sky-600">
                    <Radio size={13} />
                  </div>
                ) : (
                  <div className="p-1 rounded-md bg-amber-50 border border-amber-100 text-amber-600">
                    <Sparkles size={13} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-foreground truncate">{notif.title}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0">{notif.time}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-2.5 border-t border-border bg-secondary/20 text-center">
          <span className="text-[11px] text-muted-foreground font-medium">Telemetry sync active</span>
        </div>
      </div>
    </>
  );
}
