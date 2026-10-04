"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, ShieldCheck } from "lucide-react";

export default function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card/60 backdrop-blur-xs py-4 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-muted-foreground transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        {/* Left: Branding & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldCheck size={16} className="text-primary" />
            <span>Smart Attendance</span>
          </div>
          <span className="hidden sm:inline text-muted-foreground/60">•</span>
          <p>© {currentYear} Smart Attendance System. All rights reserved.</p>
        </div>

        {/* Center: Contact Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <a
            href="mailto:support@smartattendance.edu"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            title="Send Email Support"
          >
            <Mail size={13} className="text-muted-foreground" />
            <span>support@smartattendance.edu</span>
          </a>
          <a
            href="tel:+18005550199"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            title="Call Support Hotline"
          >
            <Phone size={13} className="text-muted-foreground" />
            <span>+1 (800) 555-0199</span>
          </a>
        </div>

        {/* Right: Policy & Links */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="hover:text-foreground transition-colors font-medium">
            System Access
          </Link>
          <span className="text-muted-foreground/60">•</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Systems Operational
          </span>
        </div>
      </div>
    </footer>
  );
}
