import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useNotifications } from "../useNotifications";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { mockAdminProfile } from "@/tests/fixtures";

vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useNotifications Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().login("mock-token", mockAdminProfile);
  });

  it("should fetch notifications and set unread count", async () => {
    const mockNotifs = [
      {
        id: "notif-1",
        title: "Leave Request",
        message: "New leave submitted",
        type: "info" as const,
        category: "leave" as const,
        is_read: false,
        created_at: "2026-09-20T10:00:00Z",
      },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        items: mockNotifs,
        total_count: 1,
        unread_count: 1,
      },
    });

    const { result } = renderHook(() => useNotifications(0));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.notifications.length).toBe(1);
    expect(result.current.unreadCount).toBe(1);
  });

  it("should optimistically mark notification as read", async () => {
    const mockNotifs = [
      {
        id: "notif-1",
        title: "Leave Request",
        message: "New leave submitted",
        type: "info" as const,
        category: "leave" as const,
        is_read: false,
        created_at: "2026-09-20T10:00:00Z",
      },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        items: mockNotifs,
        total_count: 1,
        unread_count: 1,
      },
    });
    vi.mocked(api.patch).mockResolvedValueOnce({ data: { status: "success" } });

    const { result } = renderHook(() => useNotifications(0));

    await waitFor(() => expect(result.current.unreadCount).toBe(1));

    await act(async () => {
      await result.current.markAsRead("notif-1");
    });

    expect(result.current.notifications[0].is_read).toBe(true);
    expect(result.current.unreadCount).toBe(0);
    expect(api.patch).toHaveBeenCalledWith("/notifications/notif-1/read");
  });
});
