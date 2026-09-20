import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/store/authStore";
import { mockAdminProfile, mockTeacherProfile, mockStudentProfile } from "@/tests/fixtures";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("should initialize in unauthenticated state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should set user and token on successful login", () => {
    useAuthStore.getState().login("mock-jwt-token-123", mockAdminProfile);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe("mock-jwt-token-123");
    expect(state.user?.email).toBe("admin.sarah@yopmail.com");
    expect(state.user?.role).toBe("ADMIN");
  });

  it("should clear state on logout", () => {
    useAuthStore.getState().login("mock-jwt-token-123", mockTeacherProfile);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it("should allow updating user profile directly", () => {
    useAuthStore.getState().login("mock-jwt-token-123", mockStudentProfile);
    expect(useAuthStore.getState().user?.email).toBe("student.rahul@yopmail.com");

    const updatedProfile = {
      ...mockStudentProfile,
      student_profile: {
        ...mockStudentProfile.student_profile!,
        first_name: "Rahul Updated",
      },
    };
    useAuthStore.getState().setUser(updatedProfile);
    expect(useAuthStore.getState().user?.student_profile?.first_name).toBe("Rahul Updated");
  });
});
