"use client";

import React from "react";
import { Send, Radio } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import type { GlobalBroadcastRequest } from "@/types/tenant";

interface BroadcastFormProps {
  form: GlobalBroadcastRequest;
  onChange: (updated: Partial<GlobalBroadcastRequest>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

const AUDIENCE_OPTIONS = [
  { value: "ALL", label: "All Platform Users (Global)" },
  { value: "SUPER_ADMIN", label: "Super Admins Only" },
  { value: "TENANT_ADMIN", label: "Institution Administrators Only" },
  { value: "TEACHER", label: "Faculty & Teachers Only" },
  { value: "STUDENT", label: "Enrolled Students Only" },
];

const TYPE_OPTIONS = [
  { value: "info", label: "Information (Standard Notice)" },
  { value: "warning", label: "Warning (Action Required)" },
  { value: "critical", label: "Critical (System Alert / Downtime)" },
  { value: "success", label: "Success (Feature Release)" },
];

const CATEGORY_OPTIONS = [
  { value: "system", label: "System Operation" },
  { value: "maintenance", label: "Scheduled Maintenance" },
  { value: "security", label: "Security & Policy Advisory" },
  { value: "update", label: "Platform Update & Improvements" },
];

export default function BroadcastForm({
  form,
  onChange,
  onSubmit,
  submitting,
}: BroadcastFormProps): React.ReactElement {
  return (
    <GlassCard className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Radio size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Compose Broadcast Announcement</h3>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Announcement Title</label>
          <input
            type="text"
            placeholder="e.g. Scheduled Platform Maintenance on Sunday"
            value={form.title}
            onChange={(e) => onChange({ title: e.target.value })}
            required
            className="w-full px-3.5 py-2 bg-muted/30 border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Audience & Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Target Audience</label>
            <select
              value={form.target_role || "ALL"}
              onChange={(e) => onChange({ target_role: e.target.value === "ALL" ? undefined : e.target.value })}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {AUDIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Alert Category</label>
            <select
              value={form.category}
              onChange={(e) => onChange({ category: e.target.value as GlobalBroadcastRequest["category"] })}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alert Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Severity / Display Style</label>
          <select
            value={form.type}
            onChange={(e) => onChange({ type: e.target.value as GlobalBroadcastRequest["type"] })}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Announcement Body</label>
          <textarea
            rows={5}
            placeholder="Write clear, actionable details for users regarding the update or maintenance window..."
            value={form.message}
            onChange={(e) => onChange({ message: e.target.value })}
            required
            className="w-full px-3.5 py-2.5 bg-muted/30 border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <GlassButton
            type="submit"
            variant="primary"
            loading={submitting}
            disabled={!form.title.trim() || !form.message.trim() || submitting}
            className="gap-1.5"
          >
            <Send size={14} />
            <span>Dispatch Broadcast Announcement</span>
          </GlassButton>
        </div>
      </form>
    </GlassCard>
  );
}
