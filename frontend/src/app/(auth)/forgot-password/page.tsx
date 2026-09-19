"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";

export default function ForgotPasswordPage(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function validate(): boolean {
    if (!email.trim()) {
      setError("Email address is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError(undefined);
    return true;
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to send reset link."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[350px] h-[350px] rounded-full bg-white/5 filter blur-[80px] -z-10 pointer-events-none" />
      <div className="w-full max-w-md animate-fade-in-up relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-white/10 to-purple-500/10 border border-white/10 mb-5">
            <KeyRound size={36} className="text-slate-300" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight font-[Outfit]">
            Smart Attendance
          </h1>
          <p className="text-xs text-slate-500 mt-2">Password Recovery</p>
        </div>

        {submitted ? (
          <div className="glass-panel-static p-8 text-center space-y-6">
            <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Check Your Inbox</h2>
              <p className="text-sm text-slate-400 mt-2">
                If an account exists for <span className="text-slate-200 font-semibold">{email}</span>, you will receive a secure password reset link.
              </p>
            </div>
            <Link href="/login" className="inline-block">
              <GlassButton variant="secondary">Back to Login</GlassButton>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-panel-static p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-200 tracking-wide font-[Outfit]">Forgot Password?</h2>
              <p className="text-xs text-slate-400">
                Enter your registered email and we will dispatch a password reset link.
              </p>
            </div>

            <GlassInput
              label="Email Address"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              icon={<Mail size={16} className="text-slate-400" />}
              autoComplete="email"
            />

            <div className="pt-2 space-y-3">
              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full font-bold text-sm tracking-wider uppercase"
              >
                Send Reset Link
              </GlassButton>

              <Link href="/login" className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors pt-2">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
