"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Sliders, ChevronDown, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import SidebarUserFooter from "./SidebarUserFooter";
import { adminLinks, setupLinks, teacherLinks, teacherReportLinks } from "./sidebar-nav";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps): React.ReactElement {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const isSetupActive = pathname.startsWith("/admin/setup");
  const [userToggledSetup, setUserToggledSetup] = useState<boolean | null>(null);
  const setupOpen = userToggledSetup ?? isSetupActive;
  const [flaggedCount, setFlaggedCount] = useState(0);

  useEffect(() => {
    if (role !== "TEACHER") return;
    let isMounted = true;
    const fetchFlagged = async () => {
      try {
        const { data } = await api.get<unknown[]>("/teacher/attendance/flagged");
        if (isMounted) setFlaggedCount(Array.isArray(data) ? data.length : 0);
      } catch { /* Polling error ignored */ }
    };
    void fetchFlagged();
    const interval = setInterval(() => void fetchFlagged(), 60_000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [role]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs z-30 md:hidden" onClick={onClose} />
      )}

      <aside className={cn("fixed top-0 bottom-0 left-0 z-40 flex flex-col w-[260px] bg-card border-r border-border transition-transform duration-200", isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")}>
        <div className="h-16 px-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground font-[Outfit] tracking-tight">Smart Attendance</h2>
              <p className="text-[11px] text-muted-foreground font-medium">Enterprise System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
          {role === "ADMIN" ? (
            <div>
              <p className="px-3 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Administration
              </p>
              <div className="space-y-0.5">
                {adminLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                        isActive
                          ? "bg-secondary text-foreground font-semibold shadow-2xs"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span className={cn(isActive ? "text-foreground" : "text-muted-foreground")}>{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <button
                  onClick={() => setUserToggledSetup(!setupOpen)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors",
                    isSetupActive ? "text-foreground font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Sliders size={16} />
                    <span>System Setup</span>
                  </div>
                  {setupOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {setupOpen && (
                  <div className="pl-4 mt-1 space-y-0.5 border-l border-border ml-4">
                    {setupLinks.map((link) => {
                      const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors",
                            isActive ? "text-foreground font-semibold bg-secondary" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {link.icon}
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div>
                <p className="px-3 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Teaching Operations
                </p>
                <div className="space-y-0.5">
                  {teacherLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    const isReviewLink = link.href === "/teacher/review";
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors",
                          isActive ? "bg-secondary text-foreground font-semibold shadow-2xs" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span>{link.icon}</span>
                          <span>{link.label}</span>
                        </div>
                        {isReviewLink && flaggedCount > 0 && (
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {flaggedCount > 99 ? "99+" : flaggedCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="px-3 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Analytics & Reports
                </p>
                <div className="space-y-0.5">
                  {teacherReportLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                          isActive ? "bg-secondary text-foreground font-semibold shadow-2xs" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <span>{link.icon}</span>
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </nav>

        <SidebarUserFooter user={user} />
      </aside>
    </>
  );
}
