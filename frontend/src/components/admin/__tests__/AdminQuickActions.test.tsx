import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminQuickActions from "../AdminQuickActions";

describe("AdminQuickActions Component", () => {
  it("renders all four quick action shortcuts", () => {
    render(<AdminQuickActions />);

    expect(screen.getByText("Configure Verifications")).toBeInTheDocument();
    expect(screen.getByText("Audit Activity Log")).toBeInTheDocument();
    expect(screen.getByText("Configure Classes")).toBeInTheDocument();
    expect(screen.getByText("Execute AI Scanner")).toBeInTheDocument();
  });

  it("links to correct administrative paths", () => {
    render(<AdminQuickActions />);

    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));

    expect(hrefs).toContain("/admin/setup/verification-settings");
    expect(hrefs).toContain("/admin/audit");
    expect(hrefs).toContain("/admin/classes");
    expect(hrefs).toContain("/admin/scanner");
  });
});
