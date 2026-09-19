"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import GlassLoader from "@/components/ui/GlassLoader";

interface VerifyData {
  valid: boolean;
  email?: string;
  role?: string;
  name?: string;
  message?: string;
}

function OnboardingContent(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [verifying, setVerifying] = useState(true);
  const [userData, setUserData] = useState<VerifyData | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  useEffect(() => {
    async function checkToken(): Promise<void> {
      if (!token) {
        setVerifying(false);
        setUserData({ valid: false, message: "Missing invitation token." });
        return;
      }
      try {
        const { data } = await api.get<VerifyData>(`/auth/verify-token?token=${encodeURIComponent(token)}&token_type=invite`);
        setUserData(data);
      } catch (err) {
        setUserData({ valid: false, message: getApiErrorMessage(err, "Failed to verify invitation token.") });
      } finally {
        setVerifying(false);
      }
    }
    checkToken();
  }, [token]);

  function validate(): boolean {
    const errs: { password?: string; confirmPassword?: string } = {};
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";

    if (password !== confirmPassword) {
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
      await api.post("/auth/complete-onboarding", { token, password });
      setCompleted(true);
      toast.success("Account activated successfully!");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to activate account."));
    } finally {
      setSubmitting(false);
    }
  }

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-3">
        <GlassLoader text="Verifying your invitation link..." />
      </div>
    );
  }

  if (!userData?.valid) {
    return (
      <div className="rounded-2xl border border-border bg-card p-7 text-center space-y-5 shadow-sm">
        <div className="inline-flex p-3 rounded-full bg-red-50 border border-red-200 text-red-600">
          <AlertCircle size={32} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Invalid or Expired Link</h2>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            {userData?.message || "This invitation link is no longer valid or has expired."}
          </p>
        </div>
        <Link href="/login" className="inline-block">
          <GlassButton variant="secondary" size="sm">Return to Login</GlassButton>
        </Link>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="rounded-2xl border border-border bg-card p-7 text-center space-y-5 shadow-sm">
        <div className="inline-flex p-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Account Activated!</h2>
          <p className="text-xs text-muted-foreground mt-1.5">
            Your password has been set. Redirecting you to the sign in screen...
          </p>
        </div>
        <Link href="/login" className="inline-block">
          <GlassButton variant="primary" size="sm">Proceed to Login</GlassButton>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-7 space-y-5 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">Activate Your Account</h2>
        <p className="text-xs text-muted-foreground">
          Welcome <strong className="text-foreground">{userData.name || userData.email}</strong> ({userData.role || "User"}). Please set your password.
        </p>
      </div>

      <div className="space-y-3.5">
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

        <GlassInput
          label="Confirm Password"
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
          Activate & Save Password
        </GlassButton>
      </div>
    </form>
  );
}

export default function OnboardingPage(): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-xl bg-primary text-primary-foreground shadow-sm mb-3">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-[Outfit]">
            Smart Attendance
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Account Activation</p>
        </div>

        <Suspense fallback={<div className="rounded-2xl border border-border bg-card p-8 text-center"><GlassLoader /></div>}>
          <OnboardingContent />
        </Suspense>
      </div>
    </div>
  );
}
