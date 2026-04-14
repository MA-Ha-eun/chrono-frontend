import { apiClient, shouldUseMock, shouldUseMockFallback } from "./client";
import { getErrorInfo } from "@/lib/utils";
import { DailyCommitCount, DashboardResponse } from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function getDashboard(): Promise<DashboardResponse> {
  if (await shouldUseMock()) {
    return mockApi.dashboard.getDashboard();
  }

  try {
    const response = await apiClient.get<DashboardResponse>("/dashboard");
    return response.data;
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = getErrorInfo(error);
    if (import.meta.env.DEV) {
      console.warn(
        `대시보드 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.dashboard.getDashboard();
  }
}

export async function getRecent7DaysCommits(): Promise<DailyCommitCount[]> {
  if (await shouldUseMock()) {
    return mockApi.dashboard.getRecent7DaysCommits();
  }

  try {
    const response = await apiClient.get<
      { date: string; commitCount: number }[]
    >("/dashboard/recent-7-days");
    return response.data.map((d) => ({ date: d.date, count: d.commitCount }));
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = getErrorInfo(error);
    if (import.meta.env.DEV) {
      console.warn(
        `recent-7-days API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.dashboard.getRecent7DaysCommits();
  }
}
