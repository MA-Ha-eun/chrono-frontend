import { apiClient } from "./client";
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "@/types/api";

// ========== Auth API ==========

/**
 * 회원가입
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>("/auth/signup", data);
  return response.data;
}

/**
 * 로그인
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);
  return response.data;
}

/**
 * 로그아웃 (서버 측 세션 정리 등)
 * 현재는 클라이언트 측에서만 처리하므로 빈 함수
 * 추후 서버 측 로그아웃 API가 필요하면 여기에 구현
 */
export function logout(): void {
  // 클라이언트 측 로그아웃은 Zustand 스토어의 logout에서 처리
  // 서버 측 로그아웃 API가 필요하면 여기에 구현
}

