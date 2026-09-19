"use client";

import React, { useState } from "react";
import { Megaphone, X, Send, Loader2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { NotificationBroadcastCreate } from "@/types/notification";

interface BroadcastNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BroadcastNotificationModal({
  isOpen,
  onClose,
  onSuccess,
}: BroadcastNotificationModalProps): React.ReactElement | null {
  const [formData, setFormData] = useState<NotificationBroadcastCreate>({
    title: "",
    message: "",
    target_role: "ALL",
    type: "info",
    category: "system",
    link: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Please provide both a title and message.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notifications/broadcast", {
        title: formData.title.trim(),
        message: formData.message.trim(),
        target_role: formData.target_role,
        type: formData.type,
        category: formData.category,
        link: formData.link?.trim() || null,
      });

      toast.success("Broadcast announcement sent successfully!");
      setFormData({
        title: "",
        message: "",
        target_role: "ALL",
        type: "info",
        category: "system",
        link: "",
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      toast.error("Failed to broadcast announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Megaphone size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground font-[Outfit]">Broadcast Announcement</h3>
              <p className="text-[11px] text-muted-foreground">Send an urgent alert to selected users</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Target Audience</label>
            <select
              value={formData.target_role}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  target_role: e.target.value as "ALL" | "TEACHER" | "STUDENT" | "ADMIN",
                }))
              }
              className="w-full h-9 px-3 rounded-lg border border-border bg-secondary/30 text-xs text-foreground focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="ALL">All Campus (Everyone)</option>
              <option value="TEACHER">Faculty / Teachers Only</option>
              <option value="STUDENT">Students Only</option>
              <option value="ADMIN">Administrators Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Schedule Revision / Campus Notice"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full h-9 px-3 rounded-lg border border-border bg-secondary/30 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Message Content</label>
            <textarea
              required
              rows={3}
              placeholder="Write announcement details..."
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              className="w-full p-2.5 rounded-lg border border-border bg-secondary/30 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Severity / Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as "info" | "success" | "warning" | "danger",
                  }))
                }
                className="w-full h-9 px-2.5 rounded-lg border border-border bg-secondary/30 text-xs text-foreground focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="info">Info (Blue)</option>
                <option value="warning">Warning (Amber)</option>
                <option value="danger">Critical (Red)</option>
                <option value="success">Success (Green)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as "attendance" | "leave" | "device" | "security" | "system",
                  }))
                }
                className="w-full h-9 px-2.5 rounded-lg border border-border bg-secondary/30 text-xs text-foreground focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="system">System</option>
                <option value="attendance">Attendance</option>
                <option value="leave">Leave</option>
                <option value="security">Security</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Action Link (Optional)</label>
            <input
              type="text"
              placeholder="/teacher/history or https://..."
              value={formData.link || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
              className="w-full h-9 px-3 rounded-lg border border-border bg-secondary/30 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              <span>Send Broadcast</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
