import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError, ErrorCode } from "@/types/api";
import { useAuthStore } from "@/stores/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

type ApiMode = "real" | "mock" | "auto";

export function getApiMode(): ApiMode {
  const raw = String(import.meta.env.VITE_API_MODE ?? "").toLowerCase();
  if (raw === "real" || raw === "mock" || raw === "auto") {
    return raw;
  }

  // 기존 동작 유지. DEV + VITE_USE_MOCK=true면 항상 mock
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return "mock";
  }

  return "real";
}

type BackendAvailability = "unknown" | "available" | "unavailable";
let backendAvailability: BackendAvailability = "unknown";
let backendAvailabilityExpiresAt = 0;

function cacheBackendAvailability(value: BackendAvailability, ttlMs: number) {
  backendAvailability = value;
  backendAvailabilityExpiresAt = Date.now() + ttlMs;
}

export function markBackendUnavailable(ttlMs = 30_000) {
  cacheBackendAvailability("unavailable", ttlMs);
}

function isBackendUnavailableCached(): boolean {
  const now = Date.now();
  return (
    backendAvailability === "unavailable" && now < backendAvailabilityExpiresAt
  );
}

export async function shouldUseMock(): Promise<boolean> {
  const mode = getApiMode();
  if (mode === "mock") return true;
  if (mode === "real") return false;

  // 최근 네트워크 레벨로 서버 죽었다 확인될 때 auto
  // 다음 호출부터 즉시 mock 전환
  return isBackendUnavailableCached();
}

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

export const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

refreshClient.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === "object" &&
      "success" in response.data &&
      "data" in response.data
    ) {
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

function normalizeApiError(data: unknown): ApiError | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const value = data as {
    message?: unknown;
    code?: unknown;
    errorCode?: unknown;
  };

  const message =
    typeof value.message === "string"
      ? value.message
      : "요청 처리 중 오류가 발생했습니다.";
  const codeCandidate = value.code ?? value.errorCode;
  const code =
    typeof codeCandidate === "string" ? codeCandidate : ErrorCode.SERVER_ERROR;

  return { message, code };
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => {
    // 어떤 형태로든 응답 오면
    if (getApiMode() === "auto") {
      cacheBackendAvailability("available", 15_000);
    }
    if (
      response.data &&
      typeof response.data === "object" &&
      "success" in response.data &&
      "data" in response.data
    ) {
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 네트워크 레벨에서 응답 자체가 없으면 (서버 다운 등) auto 모드에서 빠르게 mock 전환할 수 있게 캐시
    if (getApiMode() === "auto" && !error.response) {
      markBackendUnavailable();
    }

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/signup") ||
      originalRequest?.url?.includes("/auth/email") ||
      originalRequest?.url?.includes("/auth/password");

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      // 401(인증 만료) 또는 403(토큰 만료 시 백엔드가 403 반환하는 경우)
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (originalRequest.url?.includes("/auth/refresh")) {
        useAuthStore.getState().logout();
        return Promise.reject(
          error.response.data || {
            message: "인증이 만료되었습니다. 다시 로그인해주세요.",
            code: ErrorCode.UNAUTHORIZED,
          }
        );
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse =
          await refreshClient.post<string>("/auth/refresh");
        const newAccessToken = refreshResponse.data;
        useAuthStore.getState().setToken(newAccessToken);

        refreshSubscribers.forEach((callback) => callback(newAccessToken));
        refreshSubscribers = [];

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        refreshSubscribers = [];
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.data) {
      const normalized = normalizeApiError(error.response.data);
      if (normalized) {
        return Promise.reject(normalized);
      }
    }

    // 백엔드 에러 메시지 없을 경우 status code별 기본 메시지 제공
    const statusCode = error.response?.status;
    let message = "요청 처리 중 오류가 발생했습니다.";
    let code = ErrorCode.SERVER_ERROR;

    if (statusCode) {
      switch (statusCode) {
        case 400:
          message = "잘못된 요청입니다.";
          code = ErrorCode.VALIDATION_ERROR;
          break;
        case 401:
          message = "인증이 필요합니다.";
          code = ErrorCode.UNAUTHORIZED;
          break;
        case 403:
          message = "요청을 처리할 수 없습니다.";
          code = ErrorCode.FORBIDDEN;
          break;
        case 404:
          message = "요청한 리소스를 찾을 수 없습니다.";
          code = ErrorCode.NOT_FOUND;
          break;
        case 500:
        case 502:
        case 503:
          message = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
          code = ErrorCode.SERVER_ERROR;
          break;
        default:
          message = `요청 처리 중 오류가 발생했습니다. (${statusCode})`;
      }
    } else if (
      error.code === "ECONNABORTED" ||
      error.message?.includes("timeout")
    ) {
      message = "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
    } else if (error.message?.includes("Network Error") || !error.response) {
      message = "네트워크 연결을 확인해주세요.";
    }

    return Promise.reject({
      message,
      code,
    } as ApiError);
  }
);

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error
  );
}

export function isNetworkError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    // 응답 자체가 없는 경우(서버 다운/연결 실패/CORS 등) 또는 timeout
    if (!error.response) return true;
    if (error.code === "ECONNABORTED") return true;
    if (typeof error.message === "string" && error.message.includes("timeout"))
      return true;
    if (
      typeof error.message === "string" &&
      error.message.includes("Network Error")
    )
      return true;
  }

  // interceptor에서 AxiosError를 ApiError로 normalize한 경우도 네트워크 성격 인지해야
  if (isApiError(error)) {
    if (error.message === "네트워크 연결을 확인해주세요.") return true;
    if (error.message.startsWith("요청 시간이 초과되었습니다.")) return true;
  }

  return false;
}

export function shouldUseMockFallback(error: unknown): boolean {
  // auto 모드에선 네트워크 에러일 때만 mock fallback
  if (getApiMode() === "auto") {
    // 캐시가 이미 unavailable이면 에러 형태와 무관하게 fallback 허용
    if (isBackendUnavailableCached()) return true;
    return isNetworkError(error);
  }

  if (!isApiError(error)) {
    return true;
  }

  if (
    error.code === ErrorCode.UNAUTHORIZED ||
    error.code === ErrorCode.FORBIDDEN
  ) {
    return false;
  }

  return true;
}
