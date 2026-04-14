import { apiClient, shouldUseMock, shouldUseMockFallback } from "./client";
import { getErrorInfo } from "@/lib/utils";
import {
  CommitSummary,
  WeeklyCommitCount,
  CommitHistoryCount,
} from "@/types/api";
import { mockApi } from "@/lib/mock/api";
import { mockProject, mockProjectsDetail } from "@/lib/mock/data";

function getMockProjectById(projectId: number) {
  return mockProjectsDetail[projectId] ?? { ...mockProject, projectId };
}

export async function syncCommits(projectId: number): Promise<number> {
  if (await shouldUseMock()) {
    return getMockProjectById(projectId).totalCommits ?? 0;
  }
  const response = await apiClient.post<number>(
    `/projects/${projectId}/commits/sync`
  );
  return response.data;
}

export async function getCommitCount(projectId: number): Promise<number> {
  if (await shouldUseMock()) {
    return getMockProjectById(projectId).totalCommits ?? 0;
  }
  const response = await apiClient.get<number>(
    `/projects/${projectId}/commits/count`
  );
  return response.data;
}

export async function getLatestCommit(projectId: number): Promise<string> {
  if (await shouldUseMock()) {
    return (
      getMockProjectById(projectId).lastCommitAt ?? new Date().toISOString()
    );
  }
  const response = await apiClient.get<string>(
    `/projects/${projectId}/commits/latest`
  );
  return response.data;
}

export async function getCommitSummary(
  projectId: number
): Promise<CommitSummary> {
  if (await shouldUseMock()) {
    return mockApi.commit.getCommitSummary(projectId);
  }

  try {
    const response = await apiClient.get<CommitSummary>(
      `/projects/${projectId}/commits/summary`
    );
    return response.data;
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = getErrorInfo(error);
    if (import.meta.env.DEV) {
      console.warn(
        `커밋 통계 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.commit.getCommitSummary(projectId);
  }
}

export async function getWeeklyCommits(
  projectId: number
): Promise<WeeklyCommitCount[]> {
  if (await shouldUseMock()) {
    return mockApi.commit.getWeeklyCommits(projectId);
  }

  try {
    const response = await apiClient.get<WeeklyCommitCount[]>(
      `/projects/${projectId}/commits/weekly`
    );
    return response.data;
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = getErrorInfo(error);
    if (import.meta.env.DEV) {
      console.warn(
        `주간 커밋 통계 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.commit.getWeeklyCommits(projectId);
  }
}

export async function getCommitHistory(
  projectId: number
): Promise<CommitHistoryCount[]> {
  if (await shouldUseMock()) {
    return mockApi.commit.getCommitHistory(projectId);
  }

  try {
    const response = await apiClient.get<CommitHistoryCount[]>(
      `/projects/${projectId}/commits/history`
    );
    return response.data;
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = getErrorInfo(error);
    if (import.meta.env.DEV) {
      console.warn(
        `커밋 히스토리 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.commit.getCommitHistory(projectId);
  }
}

export async function getProjectIntro(projectId: number): Promise<string> {
  if (await shouldUseMock()) {
    throw new Error("AI 기능은 mock을 제공하지 않습니다.");
  }
  const response = await apiClient.post<string>(
    `/projects/${projectId}/commits/project-intro`
  );
  return response.data;
}

export async function getAiSummary(projectId: number): Promise<string> {
  if (await shouldUseMock()) {
    throw new Error("AI 기능은 mock을 제공하지 않습니다.");
  }
  const response = await apiClient.post<string>(
    `/projects/${projectId}/commits/ai-summary`
  );
  return response.data;
}
