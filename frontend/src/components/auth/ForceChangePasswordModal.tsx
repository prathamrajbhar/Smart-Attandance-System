"use client";

import React, { useState, useMemo } from "react";
import { Lock, CheckCircle2, ShieldCheck, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";

interface ForceChangePasswordModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export default function ForceChangePasswordModal({
  isOpen,
  onSuccess,
}: ForceChangePasswordModalProps): React.ReactElement | null {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

  const rules = useMemo(() => [
    { label: "At least 8 characters", valid: newPassword.length >= 8 },
    { label: "Uppercase & lowercase letters", valid: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) },
    { label: "At least one number (0-9)", valid: /\d/.test(newPassword) },
    { label: "At least one special symbol", valid: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword) },
  ], [newPassword]);

  const allRulesPassed = useMemo(() => rules.every((r) => r.valid), [rules]);
  const passwordsMatch = useMemo(() => newPassword.length > 0 && newPassword === confirmPassword, [newPassword, confirmPassword]);

  if (!isOpen) return null;

  function validate(): boolean {
    const errs: { newPassword?: string; confirmPassword?: string } = {};
    if (!newPassword) {
      errs.newPassword = "New password is required";
    } else if (!allRulesPassed) {
      errs.newPassword = "Please satisfy all password security requirements";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Confirm password is required";
    } else if (!passwordsMatch) {
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
        new_password: newPassword,
      });
      toast.success("Password set successfully! Welcome to your account.");
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
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight font-[Outfit]">Set Permanent Password</h2>
            <p className="text-xs text-slate-400">Create a secure password to activate your account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <GlassInput
            label="New Permanent Password"
            type="password"
            placeholder="Create a strong password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            icon={<Lock size={16} className="text-slate-400" />}
            autoComplete="new-password"
          />

          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Security Requirements</p>
            <div className="grid grid-cols-1 gap-1.5">
              {rules.map((rule) => (
                <div key={rule.label} className="flex items-center gap-2 text-xs">
                  {rule.valid ? (
                    <Check size={13} className="text-emerald-400 shrink-0" />
                  ) : (
                    <X size={13} className="text-slate-500 shrink-0" />
                  )}
                  <span className={rule.valid ? "text-emerald-300 font-medium" : "text-slate-400"}>
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <GlassInput
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter permanent password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            icon={<Lock size={16} className="text-slate-400" />}
            autoComplete="new-password"
          />

          {confirmPassword.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs px-1">
              {passwordsMatch ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Passwords match</span>
                </>
              ) : (
                <>
                  <X size={14} className="text-rose-400" />
                  <span className="text-rose-400">Passwords do not match</span>
                </>
              )}
            </div>
          )}

          <div className="pt-2">
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full font-bold text-sm tracking-wider uppercase"
              icon={<CheckCircle2 size={16} />}
            >
              Activate Account & Continue
            </GlassButton>
          </div>
        </form>
      </div>
    </div>
  );
}
