"use client";

import React, { useState } from "react";
import { Mail, KeyRound, ShieldAlert } from "lucide-react";
import GlassButton from "./GlassButton";

interface GlassResetPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
  userEmail?: string;
}

export default function GlassResetPasswordDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Send Password Reset Link",
  description,
  userEmail,
}: GlassResetPasswordDialogProps): React.ReactElement | null {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleTrigger = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-static w-full max-w-md p-6 shadow-2xl relative border border-white/10">
        <div className="flex items-center gap-3 mb-3 text-amber-400">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <KeyRound size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold font-[Outfit] text-slate-100">{title}</h2>
            <p className="text-xs text-slate-400">Admin-Initiated Security Action</p>
          </div>
        </div>

        <div className="space-y-3 my-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            {description || (
              <>
                A secure, time-limited password reset link will be dispatched to{" "}
                <span className="text-emerald-400 font-semibold">{userEmail}</span>.
              </>
            )}
          </p>

          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-start gap-2.5 text-xs text-slate-400">
            <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <span>
              In accordance with security standards, administrators cannot manually set passwords. The user must define their own password via the email link.
            </span>
          </div>
        </div>

        <form onSubmit={handleTrigger} className="flex gap-3 justify-end mt-6 pt-3 border-t border-white/5">
          <GlassButton
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </GlassButton>
          <GlassButton
            type="submit"
            variant="primary"
            loading={loading}
            icon={<Mail size={16} className="text-slate-200" />}
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Send Reset Email
          </GlassButton>
        </form>
      </div>
    </div>
  );
}
