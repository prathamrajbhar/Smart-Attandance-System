import axios from "axios";
import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || "";
      const isAuthUrl =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/forgot-password") ||
        requestUrl.includes("/auth/reset-password") ||
        requestUrl.includes("/auth/verify-token");

      if (!isAuthUrl) {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export interface ApiValidationErrorDetail {
  field: string;
  issue: string;
}

export interface ApiValidationErrorEnvelope {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: ApiValidationErrorDetail[];
  };
}

export function getApiErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  const axiosError = err as {
    response?: {
      data?: {
        detail?: string | Array<{ msg?: string }>;
        message?: string;
        error?: {
          message?: string;
          details?: ApiValidationErrorDetail[];
        };
      };
    };
  };

  const responseData = axiosError?.response?.data;
  if (!responseData) return fallback;

  if (responseData.error?.message) {
    if (responseData.error.details && responseData.error.details.length > 0) {
      const firstIssue = responseData.error.details[0];
      return `${firstIssue.field}: ${firstIssue.issue}`;
    }
    return responseData.error.message;
  }

  if (typeof responseData.detail === "string") {
    return responseData.detail;
  }

  if (Array.isArray(responseData.detail) && responseData.detail.length > 0) {
    return responseData.detail[0]?.msg || fallback;
  }

  if (responseData.message) {
    return responseData.message;
  }

  return fallback;
}

export function applyValidationErrorsToForm<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>
): boolean {
  const axiosError = err as {
    response?: {
      data?: {
        error?: {
          details?: ApiValidationErrorDetail[];
        };
      };
    };
  };

  const details = axiosError?.response?.data?.error?.details;
  if (Array.isArray(details) && details.length > 0) {
    for (const item of details) {
      if (item.field && item.issue) {
        setError(item.field as Path<T>, {
          type: "server",
          message: item.issue,
        });
      }
    }
    return true;
  }
  return false;
}

export default api;
