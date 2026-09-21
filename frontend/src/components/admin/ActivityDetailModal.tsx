"use client";

import React, { useState } from "react";
import { X, Copy, Check, User, Clock, Network, Database, ShieldAlert, FileCode2 } from "lucide-react";
import toast from "react-hot-toast";
import type { AuditLogResponse } from "@/types";

interface ActivityDetailModalProps {
  event: (AuditLogResponse & Record<string, unknown>) | null;
  isOpen: boolean;
  onClose: () => void;
  formatEventName: (name: string) => string;
}

export default function ActivityDetailModal({
  event,
  isOpen,
  onClose,
  formatEventName,
}: ActivityDetailModalProps): React.ReactElement | null {
  const [copied, setCopied] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isOpen || !event) return null;

  const rawEvent = String(event.eventType || event.action || "SYSTEM_EVENT");
  const formattedTitle = formatEventName(rawEvent);
  const targetId = String(event.target || "");
  const actor = String(event.actor || event.performedBy || "System");
  const ip = String(event.ip || "127.0.0.1");
  const timestamp = event.timestamp
    ? new Date(String(event.timestamp)).toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "medium",
      })
    : "Recent";

  const handleCopy = async (text: string, isJson = false) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isJson) {
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const isCritical = event.severity === "CRITICAL" || event.severity === "HIGH";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isCritical
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-600"
                  : "bg-primary/10 border-primary/20 text-primary"
              }`}
            >
              {isCritical ? <ShieldAlert size={18} /> : <FileCode2 size={18} />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground tracking-tight">{formattedTitle}</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Audit Transaction Inspector</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Summary Box */}
          <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/80 space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Activity Summary
            </span>
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {String(event.description || "System operation executed")}
            </p>
          </div>

          {/* Key-Value Telemetry Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-border bg-card space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <User size={12} /> Performed By
              </span>
              <p className="text-xs font-mono font-medium text-foreground truncate">{actor}</p>
            </div>

            <div className="p-3 rounded-xl border border-border bg-card space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Network size={12} /> Network Node IP
              </span>
              <p className="text-xs font-mono font-medium text-foreground">{ip}</p>
            </div>

            <div className="col-span-2 p-3 rounded-xl border border-border bg-card space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Clock size={12} /> Transaction Time
              </span>
              <p className="text-xs text-foreground font-medium">{timestamp}</p>
            </div>

            {targetId && targetId !== "null" && targetId !== "-" && (
              <div className="col-span-2 p-3 rounded-xl border border-border bg-card flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Database size={12} /> Target Resource ID
                  </span>
                  <p className="text-xs font-mono text-foreground truncate mt-0.5">{targetId}</p>
                </div>
                <button
                  onClick={() => void handleCopy(targetId)}
                  className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                  title="Copy ID"
                >
                  {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                </button>
              </div>
            )}
          </div>

          {/* Raw JSON Details */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Raw Event Payload
              </span>
              <button
                onClick={() => void handleCopy(JSON.stringify(event, null, 2), true)}
                className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                {copiedJson ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                <span>{copiedJson ? "Copied" : "Copy JSON"}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-secondary/50 border border-border text-[11px] font-mono text-foreground max-h-36 overflow-auto">
              {JSON.stringify(event, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-secondary/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
