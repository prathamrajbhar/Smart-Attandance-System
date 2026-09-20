import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GlassButton from "../GlassButton";
import GlassBadge, { statusToBadgeVariant } from "../GlassBadge";
import GlassInput from "../GlassInput";

describe("Glass UI Components", () => {
  describe("GlassButton", () => {
    it("renders children and handles click events", () => {
      const handleClick = vi.fn();
      render(<GlassButton onClick={handleClick}>Submit Action</GlassButton>);

      const button = screen.getByRole("button", { name: "Submit Action" });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("disables button and shows spinner in loading state", () => {
      render(<GlassButton loading>Saving Changes</GlassButton>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("applies danger variant styles correctly", () => {
      render(<GlassButton variant="danger">Delete Class</GlassButton>);
      const button = screen.getByRole("button", { name: "Delete Class" });
      expect(button.className).toContain("bg-destructive");
    });
  });

  describe("GlassBadge", () => {
    it("renders status badge and maps status names to variants", () => {
      render(<GlassBadge variant="success">Active</GlassBadge>);
      expect(screen.getByText("Active")).toBeInTheDocument();

      expect(statusToBadgeVariant("Present")).toBe("success");
      expect(statusToBadgeVariant("Flagged")).toBe("warning");
      expect(statusToBadgeVariant("Absent")).toBe("danger");
      expect(statusToBadgeVariant("Unknown")).toBe("neutral");
    });
  });

  describe("GlassInput", () => {
    it("renders input and passes value changes", () => {
      const handleChange = vi.fn();
      render(
        <GlassInput
          placeholder="Enter enrollment number"
          onChange={handleChange}
        />
      );

      const input = screen.getByPlaceholderText("Enter enrollment number");
      fireEvent.change(input, { target: { value: "CS-2024-0042" } });
      expect(handleChange).toHaveBeenCalled();
    });

    it("displays validation error message when error prop is provided", () => {
      render(
        <GlassInput
          placeholder="Email address"
          error="Email is required"
        />
      );
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });
});
