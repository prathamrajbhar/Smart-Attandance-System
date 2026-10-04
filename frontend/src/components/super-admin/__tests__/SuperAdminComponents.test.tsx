import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SuperAdminKpiStrip from "../SuperAdminKpiStrip";
import TenantFilterBar from "../TenantFilterBar";
import TenantTable from "../TenantTable";
import type { SuperAdminStats, Tenant } from "@/types";

const mockStats: SuperAdminStats = {
  total_tenants: 8,
  active_tenants: 7,
  total_students: 1250,
  total_teachers: 95,
  active_sessions: 14,
  total_attendance: 2450,
};

const mockTenants: Tenant[] = [
  {
    id: "tnt-01",
    slug: "apex-tech",
    name: "Apex Institute of Technology",
    type: "COLLEGE",
    status: "ACTIVE",
    max_allowed_students: 1500,
    created_at: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "tnt-02",
    slug: "oakridge-prep",
    name: "Oakridge High School",
    type: "SCHOOL",
    status: "SUSPENDED",
    max_allowed_students: 800,
    created_at: "2026-02-10T00:00:00.000Z",
  },
];

describe("SuperAdminKpiStrip", () => {
  it("renders platform metrics when loaded", () => {
    render(<SuperAdminKpiStrip stats={mockStats} loading={false} />);
    expect(screen.getByText("Total Institutions")).toBeDefined();
    expect(screen.getByText("8")).toBeDefined();
    expect(screen.getByText("Total Students")).toBeDefined();
    expect(screen.getByText("1,250")).toBeDefined();
    expect(screen.getByText("Live Sessions")).toBeDefined();
  });
});

describe("TenantFilterBar", () => {
  it("calls filter change handlers on select input", () => {
    const onSearchChange = vi.fn();
    const onStatusChange = vi.fn();
    const onTypeChange = vi.fn();
    const onReset = vi.fn();

    render(
      <TenantFilterBar
        searchQuery="apex"
        onSearchChange={onSearchChange}
        statusFilter="ACTIVE"
        onStatusChange={onStatusChange}
        typeFilter=""
        onTypeChange={onTypeChange}
        onReset={onReset}
      />
    );

    const typeSelect = screen.getByLabelText("Filter by institution type");
    fireEvent.change(typeSelect, { target: { value: "COLLEGE" } });
    expect(onTypeChange).toHaveBeenCalledWith("COLLEGE");

    const clearButton = screen.getByRole("button", { name: "Clear" });
    fireEvent.click(clearButton);
    expect(onReset).toHaveBeenCalled();
  });
});

describe("TenantTable", () => {
  it("renders tenant rows and triggers toggle callback", () => {
    const onToggleStatus = vi.fn();
    render(
      <TenantTable
        tenants={mockTenants}
        loading={false}
        onToggleStatus={onToggleStatus}
      />
    );

    expect(screen.getByText("Apex Institute of Technology")).toBeDefined();
    expect(screen.getByText("Oakridge High School")).toBeDefined();
    expect(screen.getByText("University / College")).toBeDefined();

    const suspendBtn = screen.getByRole("button", { name: /Suspend/i });
    fireEvent.click(suspendBtn);
    expect(onToggleStatus).toHaveBeenCalledWith(mockTenants[0]);
  });
});
