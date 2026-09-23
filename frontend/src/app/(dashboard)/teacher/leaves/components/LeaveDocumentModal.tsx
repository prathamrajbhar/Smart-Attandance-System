"use client";

import React, { useState } from "react";
import { X, ExternalLink, Download, FileText, Image as ImageIcon, AlertCircle, Loader2 } from "lucide-react";
import type { PendingLeaveItem } from "@/types";

interface LeaveDocumentModalProps {
  leave: PendingLeaveItem | null;
  onClose: () => void;
}

export default function LeaveDocumentModal({ leave, onClose }: LeaveDocumentModalProps): React.ReactElement | null {
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!leave || !leave.document_url) return null;

  const url = leave.document_url;
  const isPdf = url.toLowerCase().endsWith(".pdf") || url.includes(".pdf?");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              {isPdf ? <FileText size={18} /> : <ImageIcon size={18} />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Supporting Document
              </h3>
              <p className="text-xs text-slate-400">
                {leave.student_name} ({leave.enrollment_number})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink size={16} />
            </a>
            <a
              href={url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Download"
            >
              <Download size={16} />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/60 min-h-[300px] relative">
          {isPdf ? (
            <iframe
              src={url}
              title="Leave Document Preview"
              className="w-full h-[500px] rounded border border-slate-800"
            />
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <AlertCircle size={36} className="text-rose-400 mb-3" />
              <p className="text-sm font-medium text-slate-200 mb-1">Unable to preview document directly</p>
              <p className="text-xs text-slate-400 mb-4 max-w-xs">
                The image couldn't be rendered in-browser. You can still open it in a new tab or download it directly.
              </p>
              <div className="flex gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-colors"
                >
                  <ExternalLink size={14} /> Open in New Tab
                </a>
              </div>
            </div>
          ) : (
            <>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs">
                  <Loader2 size={24} className="animate-spin text-emerald-400" />
                </div>
              )}
              <img
                src={url}
                alt="Leave Supporting Document"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setLoadError(true);
                }}
                className="max-h-[500px] max-w-full rounded object-contain border border-slate-800/80 shadow-lg"
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate max-w-md">Reason: {leave.reason}</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
