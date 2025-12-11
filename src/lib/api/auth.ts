import { apiClient } from "./client";
import { LoginRequest, LoginResponse, SignupRequest } from "@/types/api";

export async function signup(data: SignupRequest): Promise<void> {
  await apiClient.post("/auth/signup", data);
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<{ accessToken: string; nickname: string }>("/auth/login", data);
  
  // TODO: 백엔드에서 user 객체를 포함하도록 수정 필요
  return {
    accessToken: response.data.accessToken,
    user: {
      id: 0,
      email: data.email,
      nickname: response.data.nickname,
      githubUsername: undefined,
    },
  };
}

export async function refreshToken(): Promise<string> {
  const response = await apiClient.post<string>("/auth/refresh");
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

