"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, X, LayoutDashboard, Users, GraduationCap, BookOpen, 
  Cpu, Activity, ShieldCheck, Radio, ClipboardCheck, ArrowRight, CornerDownLeft 
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  category: "Navigation" | "Administration" | "Faculty";
  href: string;
  icon: React.ReactNode;
}

export default function CommandPaletteModal({ isOpen, onClose }: CommandPaletteModalProps): React.ReactElement | null {
  const router = useRouter();
  const { user } = useAuthStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.role === "ADMIN";

  const allItems: CommandItem[] = [
    ...(isAdmin ? [
      { id: "admin-dash", label: "Admin Dashboard", category: "Administration" as const, href: "/admin/dashboard", icon: <LayoutDashboard size={16} /> },
      { id: "admin-students", label: "Student & Access Management", category: "Administration" as const, href: "/admin/users/students", icon: <GraduationCap size={16} /> },
      { id: "admin-teachers", label: "Faculty & Staff Directory", category: "Administration" as const, href: "/admin/users/teachers", icon: <Users size={16} /> },
      { id: "admin-classes", label: "Class & Course Directory", category: "Administration" as const, href: "/admin/classes", icon: <BookOpen size={16} /> },
      { id: "admin-scanner", label: "AI Absentee Scanner", category: "Administration" as const, href: "/admin/scanner", icon: <Cpu size={16} /> },
      { id: "admin-audit", label: "System Audit Trail", category: "Administration" as const, href: "/admin/audit", icon: <Activity size={16} /> },
      { id: "admin-settings", label: "Verification Settings", category: "Administration" as const, href: "/admin/setup/verification-settings", icon: <ShieldCheck size={16} /> },
    ] : [
      { id: "teacher-dash", label: "Faculty Console", category: "Faculty" as const, href: "/teacher/dashboard", icon: <LayoutDashboard size={16} /> },
      { id: "teacher-classes", label: "My Classes & Geofences", category: "Faculty" as const, href: "/teacher/classes", icon: <BookOpen size={16} /> },
      { id: "teacher-sessions", label: "Broadcast Sessions", category: "Faculty" as const, href: "/teacher/sessions", icon: <Radio size={16} /> },
      { id: "teacher-review", label: "Review Queue", category: "Faculty" as const, href: "/teacher/review", icon: <ClipboardCheck size={16} /> },
      { id: "teacher-analytics", label: "Attendance Analytics", category: "Faculty" as const, href: "/teacher/analytics", icon: <Activity size={16} /> },
      { id: "teacher-profile", label: "Profile & Security", category: "Faculty" as const, href: "/teacher/profile", icon: <ShieldCheck size={16} /> },
    ]),
  ];

  const filtered = allItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: CommandItem) => {
    onClose();
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3.5 border-b border-border gap-3 bg-card">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search destination..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button onClick={onClose} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No matching destinations found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-colors ${
                  selectedIndex === idx ? "bg-secondary text-foreground font-semibold" : "text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-card border border-border text-primary shadow-2xs">
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="font-mono bg-card px-1.5 py-0.5 rounded border border-border">{item.category}</span>
                  <CornerDownLeft size={11} className={selectedIndex === idx ? "text-primary opacity-100" : "opacity-0"} />
                </div>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-border bg-secondary/30 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono px-1 py-0.5 rounded border border-border bg-card">↑↓</kbd> Navigate</span>
            <span><kbd className="font-mono px-1 py-0.5 rounded border border-border bg-card">↵</kbd> Open</span>
            <span><kbd className="font-mono px-1 py-0.5 rounded border border-border bg-card">esc</kbd> Dismiss</span>
          </div>
          <span className="font-medium">Command Palette</span>
        </div>
      </div>
    </div>
  );
}
