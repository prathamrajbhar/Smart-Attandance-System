"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Radio, Sparkles } from "lucide-react";

import { superAdminService } from "@/lib/services/superAdminService";
import { getApiErrorMessage } from "@/lib/api";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import BroadcastForm from "@/components/super-admin/BroadcastForm";
import BroadcastPreview from "@/components/super-admin/BroadcastPreview";
import BroadcastHistoryTable from "@/components/super-admin/BroadcastHistoryTable";
import type { GlobalBroadcastRequest } from "@/types/tenant";

const INITIAL_FORM: GlobalBroadcastRequest = {
  title: "",
  message: "",
  type: "info",
  category: "system",
};

export default function SuperAdminBroadcastsPage(): React.ReactElement {
  const [form, setForm] = useState<GlobalBroadcastRequest>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleChange = (updated: Partial<GlobalBroadcastRequest>): void => {
    setForm((prev) => ({ ...prev, ...updated }));
  };

  const handleApplyTemplate = (
    title: string,
    message: string,
    type: GlobalBroadcastRequest["type"],
    category: GlobalBroadcastRequest["category"]
  ): void => {
    setForm((prev) => ({ ...prev, title, message, type, category }));
    toast.success("Applied announcement template");
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      toast.error("Please provide both a title and announcement message.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await superAdminService.createBroadcast({
        title: form.title.trim(),
        message: form.message.trim(),
        target_role: form.target_role || undefined,
        type: form.type,
        category: form.category,
      });

      toast.success(
        `Broadcast sent! Delivered to ${res.delivered_count} user accounts across the platform.`
      );
      setForm(INITIAL_FORM);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to dispatch broadcast"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl animate-fade-in-up">
      <GlassBreadcrumb
        items={[
          { label: "Platform Control", href: "/super-admin/dashboard" },
          { label: "Global Announcements" },
        ]}
      />

      <GlassPageHeader
        title="Global Platform Broadcasts"
        description="Dispatch system-wide notifications, maintenance alerts, and security advisories to all users or target roles."
      />

      {/* Quick Templates */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Sparkles size={14} className="text-primary" />
          <span>Quick Announcement Templates</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              handleApplyTemplate(
                "Scheduled System Maintenance Window",
                "The attendance platform will undergo routine database optimization and security patches this Sunday from 02:00 AM to 04:00 AM UTC. Intermittent service unavailability may occur.",
                "warning",
                "maintenance"
              )
            }
            className="px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted border border-border text-xs text-foreground font-medium transition-colors cursor-pointer"
          >
            Maintenance Window
          </button>

          <button
            type="button"
            onClick={() =>
              handleApplyTemplate(
                "Security Advisory: Update Password & Enable Biometrics",
                "Please ensure all institutional administrators and faculty members verify their registered email addresses and rotate access credentials according to updated security protocols.",
                "critical",
                "security"
              )
            }
            className="px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted border border-border text-xs text-foreground font-medium transition-colors cursor-pointer"
          >
            Security Advisory
          </button>

          <button
            type="button"
            onClick={() =>
              handleApplyTemplate(
                "New Feature: Multimodal AI Timetable Scanner Live",
                "Educational institutions can now upload scanned semester timetables in PDF format for automated timetable ingestion and conflict-free schedule generation.",
                "success",
                "update"
              )
            }
            className="px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted border border-border text-xs text-foreground font-medium transition-colors cursor-pointer"
          >
            Feature Release
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <BroadcastForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>

        <div className="lg:col-span-5">
          <BroadcastPreview broadcast={form} />
        </div>
      </div>

      {/* Broadcast History Table */}
      <BroadcastHistoryTable refreshTrigger={refreshTrigger} />
    </div>
  );
}

