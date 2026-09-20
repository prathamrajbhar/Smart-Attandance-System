import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 350));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes after the specified delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "first", delay: 350 } }
    );

    expect(result.current).toBe("first");

    // Update the input value
    rerender({ value: "second", delay: 350 });
    expect(result.current).toBe("first"); // should not update immediately

    // Advance time by 200ms (less than 350ms)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("first");

    // Advance remaining 150ms
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("second");
  });

  it("should cancel previous timer on rapid updates", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "ab" });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: "abc" });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: "abcd" });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("abcd");
  });
});
