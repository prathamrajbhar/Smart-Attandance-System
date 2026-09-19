"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import GlassLoader from "@/components/ui/GlassLoader";
import PasswordRequirementsChecklist, { usePasswordRules } from "@/components/auth/PasswordRequirementsChecklist";
import ResetPasswordStatusCard from "@/components/auth/ResetPasswordStatusCard";

interface VerifyData {
  valid: boolean;
  email?: string;
  role?: string;
  name?: string;
  message?: string;
}

function ResetPasswordContent(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [verifying, setVerifying] = useState(true);
  const [tokenData, setTokenData] = useState<VerifyData | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const { allPassed } = usePasswordRules(password);

  useEffect(() => {
    async function checkToken(): Promise<void> {
      if (!token) {
        setVerifying(false);
        setTokenData({ valid: false, message: "Missing password reset token." });
        return;
      }
      try {
        const { data } = await api.get<VerifyData>(`/auth/verify-token?token=${encodeURIComponent(token)}&token_type=reset`);
        setTokenData(data);
      } catch (err) {
        setTokenData({ valid: false, message: getApiErrorMessage(err, "Failed to verify reset token.") });
      } finally {
        setVerifying(false);
      }
    }
    void checkToken();
  }, [token]);

  function validate(): boolean {
    const errs: { password?: string; confirmPassword?: string } = {};
    if (!password) {
      errs.password = "New password is required";
    } else if (!allPassed) {
      errs.password = "Please satisfy all password security requirements";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!validate() || !token) return;

    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, new_password: password });
      setCompleted(true);
      toast.success("Password has been reset successfully!");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to reset password."));
    } finally {
      setSubmitting(false);
    }
  }

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-3">
        <GlassLoader text="Verifying password reset token..." />
      </div>
    );
  }

  if (!tokenData?.valid) {
    return <ResetPasswordStatusCard status="invalid" message={tokenData?.message} />;
  }

  if (completed) {
    return <ResetPasswordStatusCard status="completed" />;
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-7 space-y-4 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">Choose New Password</h2>
        <p className="text-xs text-muted-foreground">
          {tokenData.name ? `Resetting password for ${tokenData.name} (${tokenData.email})` : `Resetting password for ${tokenData.email}`}
        </p>
      </div>

      <div className="space-y-3">
        <GlassInput
          label="New Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          icon={<Lock size={15} />}
          autoComplete="new-password"
        />

        <PasswordRequirementsChecklist password={password} />

        <GlassInput
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          icon={<Lock size={15} />}
          autoComplete="new-password"
        />
      </div>

      <div className="pt-1">
        <GlassButton
          type="submit"
          variant="primary"
          size="lg"
          loading={submitting}
          className="w-full font-medium"
        >
          Update Password
        </GlassButton>
      </div>
    </form>
  );
}

export default function ResetPasswordPage(): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-xl bg-primary text-primary-foreground shadow-sm mb-3">
            <KeyRound size={26} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-[Outfit]">
            Smart Attendance
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Set Your New Password</p>
        </div>

        <Suspense fallback={<div className="rounded-2xl border border-border bg-card p-8 text-center"><GlassLoader /></div>}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
