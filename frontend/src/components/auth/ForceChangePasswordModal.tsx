"use client";

import React, { useState } from "react";
import { Lock, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";

interface ForceChangePasswordModalProps {
  isOpen: boolean;
  temporaryPassword: string;
  onSuccess: () => void;
}

export default function ForceChangePasswordModal({
  isOpen,
  temporaryPassword,
  onSuccess,
}: ForceChangePasswordModalProps): React.ReactElement | null {
  const [currentPassword, setCurrentPassword] = useState(temporaryPassword);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>({});

  if (!isOpen) return null;

  function validate(): boolean {
    const errs: { currentPassword?: string; newPassword?: string; confirmPassword?: string } = {};
    if (!currentPassword) {
      errs.currentPassword = "Temporary password is required";
    }
    if (!newPassword) {
      errs.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      errs.newPassword = "Must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(newPassword)) {
      errs.newPassword = "Must include uppercase, lowercase, number, and special character";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Confirm password is required";
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success("Password updated successfully! Welcome to your account.");
      onSuccess();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update password."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel-static p-6 sm:p-8 shadow-2xl relative z-10 border border-white/10 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight font-[Outfit]">Set New Password</h2>
            <p className="text-xs text-slate-400">Please choose a permanent password to continue</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 leading-relaxed mb-6 flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-indigo-400" />
          <span>You logged in using a temporary password. For security reasons, please configure a new permanent password.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <GlassInput
            label="Temporary Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={errors.currentPassword}
            icon={<Lock size={16} className="text-slate-400" />}
            autoComplete="current-password"
          />

          <GlassInput
            label="New Password"
            type="password"
            placeholder="Min. 8 chars (letters, digits, symbols)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            icon={<Lock size={16} className="text-slate-400" />}
            autoComplete="new-password"
          />

          <GlassInput
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            icon={<Lock size={16} className="text-slate-400" />}
            autoComplete="new-password"
          />

          <div className="pt-2">
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full font-bold text-sm tracking-wider uppercase"
              icon={<CheckCircle2 size={16} />}
            >
              Update Password & Continue
            </GlassButton>
          </div>
        </form>
      </div>
    </div>
  );
}
