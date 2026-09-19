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
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <GlassLoader />
        <p className="text-sm text-slate-400">Verifying your invitation link...</p>
      </div>
    );
  }

  if (!userData?.valid) {
    return (
      <div className="glass-panel-static p-8 text-center space-y-6">
        <div className="inline-flex p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle size={36} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Invalid or Expired Link</h2>
          <p className="text-sm text-slate-400 mt-2">
            {userData?.message || "This invitation link is no longer valid or has expired."}
          </p>
        </div>
        <Link href="/login" className="inline-block">
          <GlassButton variant="secondary">Return to Login</GlassButton>
        </Link>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="glass-panel-static p-8 text-center space-y-6">
        <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <CheckCircle2 size={36} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Account Activated!</h2>
          <p className="text-sm text-slate-400 mt-2">
            Your password has been set. Redirecting you to the login screen...
          </p>
        </div>
        <Link href="/login" className="inline-block">
          <GlassButton variant="primary">Proceed to Login</GlassButton>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel-static p-8 space-y-6 shadow-2xl">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-200 tracking-wide font-[Outfit]">Activate Your Account</h2>
        <p className="text-xs text-slate-400">
          Welcome <span className="text-emerald-400 font-semibold">{userData.name || userData.email}</span> ({userData.role || "User"}). Please set your password.
        </p>
      </div>

      <div className="space-y-4">
        <GlassInput
          label="New Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          icon={<Lock size={16} className="text-slate-400" />}
          autoComplete="new-password"
        />

        <GlassInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          icon={<Lock size={16} className="text-slate-400" />}
          autoComplete="new-password"
        />
      </div>

      <div className="pt-2">
        <GlassButton
          type="submit"
          variant="primary"
          size="lg"
          loading={submitting}
          className="w-full mt-2 font-bold text-sm tracking-wider uppercase"
        >
          Activate & Save Password
        </GlassButton>
      </div>
    </form>
  );
}

export default function OnboardingPage(): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[350px] h-[350px] rounded-full bg-emerald-500/5 filter blur-[80px] -z-10 pointer-events-none" />
      <div className="w-full max-w-md animate-fade-in-up relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-white/10 to-emerald-500/10 border border-white/10 mb-5">
            <ShieldCheck size={36} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight font-[Outfit]">
            Smart Attendance
          </h1>
          <p className="text-xs text-slate-500 mt-2">Account Onboarding & Password Setup</p>
        </div>

        <Suspense fallback={<div className="glass-panel-static p-8 text-center"><GlassLoader /></div>}>
          <OnboardingContent />
        </Suspense>
      </div>
    </div>
  );
}
