import { apiClient } from "./client";
import { DashboardResponse } from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function getDashboard(): Promise<DashboardResponse> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.dashboard.getDashboard();
  }
  
  try {
    const response = await apiClient.get<DashboardResponse>("/dashboard");
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("대시보드 API 호출 실패, mock 데이터 사용:", error);
      return mockApi.dashboard.getDashboard();
    }
    throw error;
  }
}

