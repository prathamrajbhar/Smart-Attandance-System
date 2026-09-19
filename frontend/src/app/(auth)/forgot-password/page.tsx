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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-xl bg-primary text-primary-foreground shadow-sm mb-3">
            <KeyRound size={26} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-[Outfit]">
            Smart Attendance
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Password Recovery</p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-border bg-card p-7 text-center space-y-5 shadow-sm">
            <div className="inline-flex p-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Check Your Inbox</h2>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                If an account exists for <strong className="text-foreground">{email}</strong>, you will receive a secure reset link.
              </p>
            </div>
            <Link href="/login" className="inline-block">
              <GlassButton variant="secondary" size="sm">Back to Login</GlassButton>
            </Link>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-7 space-y-5 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">Forgot Password?</h2>
              <p className="text-xs text-muted-foreground">
                Enter your registered email and we will dispatch a reset link.
              </p>
            </div>

            <GlassInput
              label="Email Address"
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              icon={<Mail size={15} />}
              autoComplete="email"
            />

            <div className="pt-1 space-y-3">
              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full font-medium"
              >
                Send Reset Link
              </GlassButton>

              <Link href="/login" className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1">
                <ArrowLeft size={13} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
