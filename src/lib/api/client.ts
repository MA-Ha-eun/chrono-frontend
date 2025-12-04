import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { ApiError, ErrorCode } from "@/types/api";
import { useAuthStore } from "@/stores/authStore";

// 환경 변수에서 API Base URL 가져오기 (백엔드 준비되면 .env 파일에 설정)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Axios 인스턴스 생성
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10초
});

// Request 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Zustand 스토어에서 직접 토큰 가져오기 (중복 저장 방지)
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

// Response 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // 401 Unauthorized: 토큰 만료 또는 없음
    if (error.response?.status === 401) {
      // Zustand 스토어의 logout 호출 (persist 미들웨어가 자동으로 localStorage 정리)
      useAuthStore.getState().logout();
      
      // 현재 페이지가 보호된 라우트인 경우에만 리다이렉트
      if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
        window.location.href = "/login";
      }
    }

    // 에러 응답이 있는 경우 그대로 전달
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    // 네트워크 에러 등
    return Promise.reject({
      message: error.message || "네트워크 오류가 발생했습니다.",
      code: ErrorCode.SERVER_ERROR,
    } as ApiError);
  }
);

// API 에러인지 확인하는 헬퍼 함수
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error
  );
}

