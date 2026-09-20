import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTableQuery } from "../useTableQuery";
import api from "@/lib/api";

vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("useTableQuery Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch data on initial mount and update state", async () => {
    const mockItems = [
      { id: "stu-1", name: "Rahul Verma", email: "student.rahul@yopmail.com" },
      { id: "stu-2", name: "Pooja Hegde", email: "student.pooja@yopmail.com" },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        items: mockItems,
        total_items: 2,
        page: 1,
        page_size: 10,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      },
    });

    const { result } = renderHook(() =>
      useTableQuery({
        endpoint: "/admin/users/students",
        defaultPageSize: 10,
      })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockItems);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.currentPage).toBe(1);
  });

  it("should toggle sort order when handleSort is called on current column", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { items: [], total_items: 0, total_pages: 1 },
    });

    const { result } = renderHook(() =>
      useTableQuery({
        endpoint: "/admin/classes",
        defaultSortBy: "name",
        defaultSortOrder: "asc",
      })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleSort("name");
    });

    expect(result.current.sortOrder).toBe("desc");
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("should change page number and reset on search", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { items: [], total_items: 50, total_pages: 5 },
    });

    const { result } = renderHook(() =>
      useTableQuery({
        endpoint: "/admin/audit",
      })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setCurrentPage(3);
    });
    expect(result.current.currentPage).toBe(3);
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSearchQuery("audit filter");
    });
    expect(result.current.currentPage).toBe(1);
    expect(result.current.searchQuery).toBe("audit filter");
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
