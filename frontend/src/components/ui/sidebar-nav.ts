import React from "react";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Building2, ScanSearch,
  ScrollText, Radio, ClipboardCheck, BarChart3, Sliders,
  FileText, Smartphone, User
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const adminLinks: NavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: React.createElement(LayoutDashboard, { size: 17 }) },
  { label: "Students", href: "/admin/users/students", icon: React.createElement(GraduationCap, { size: 17 }) },
  { label: "Teachers", href: "/admin/users/teachers", icon: React.createElement(Users, { size: 17 }) },
  { label: "Classes", href: "/admin/classes", icon: React.createElement(BookOpen, { size: 17 }) },
  { label: "AI Scanner", href: "/admin/scanner", icon: React.createElement(ScanSearch, { size: 17 }) },
  { label: "Audit Log", href: "/admin/audit", icon: React.createElement(ScrollText, { size: 17 }) },
];

export const setupLinks: NavItem[] = [
  { label: "Departments", href: "/admin/setup/departments", icon: React.createElement(Building2, { size: 15 }) },
  { label: "Subjects", href: "/admin/setup/subjects", icon: React.createElement(BookOpen, { size: 15 }) },
  { label: "Classrooms", href: "/admin/setup/classrooms", icon: React.createElement(Sliders, { size: 15 }) },
  { label: "Designations", href: "/admin/setup/designations", icon: React.createElement(Users, { size: 15 }) },
  { label: "Verification Settings", href: "/admin/setup/verification-settings", icon: React.createElement(Sliders, { size: 15 }) },
];

export const teacherLinks: NavItem[] = [
  { label: "Overview", href: "/teacher/dashboard", icon: React.createElement(LayoutDashboard, { size: 17 }) },
  { label: "My Classes", href: "/teacher/classes", icon: React.createElement(BookOpen, { size: 17 }) },
  { label: "Sessions", href: "/teacher/sessions", icon: React.createElement(Radio, { size: 17 }) },
  { label: "Review Queue", href: "/teacher/review", icon: React.createElement(ClipboardCheck, { size: 17 }) },
  { label: "Leave Requests", href: "/teacher/leaves", icon: React.createElement(FileText, { size: 17 }) },
  { label: "Device Changes", href: "/teacher/device-changes", icon: React.createElement(Smartphone, { size: 17 }) },
];

export const teacherReportLinks: NavItem[] = [
  { label: "Class Analytics", href: "/teacher/analytics", icon: React.createElement(BarChart3, { size: 17 }) },
  { label: "Attendance History", href: "/teacher/history", icon: React.createElement(ScrollText, { size: 17 }) },
  { label: "Profile & Security", href: "/teacher/profile", icon: React.createElement(User, { size: 17 }) },
];
