import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeviceChangeTable from "../DeviceChangeTable";
import api from "@/lib/api";
import { mockDeviceChangeRequest } from "@/tests/fixtures";

vi.mock("@/lib/api", () => ({
  default: {
    put: vi.fn(),
  },
  getApiErrorMessage: vi.fn().mockReturnValue("An error occurred"),
}));

describe("DeviceChangeTable Component", () => {
  it("renders pending device change request rows", () => {
    render(
      <DeviceChangeTable
        requests={[mockDeviceChangeRequest]}
        onActionComplete={vi.fn()}
      />
    );

    expect(screen.getByText("Rahul Verma")).toBeInTheDocument();
    expect(screen.getByText("CS-2024-0042")).toBeInTheDocument();
    expect(screen.getByText("Upgraded smartphone after screen malfunction")).toBeInTheDocument();
  });

  it("calls approve API when Approve button is clicked", async () => {
    const onActionComplete = vi.fn();
    vi.mocked(api.put).mockResolvedValueOnce({ data: { status: "success" } });

    render(
      <DeviceChangeTable
        requests={[mockDeviceChangeRequest]}
        onActionComplete={onActionComplete}
      />
    );

    const approveButton = screen.getByRole("button", { name: /approve/i });
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        `/teacher/device-changes/${mockDeviceChangeRequest.id}/approve`,
        { status: "APPROVED" }
      );
      expect(onActionComplete).toHaveBeenCalled();
    });
  });
});
