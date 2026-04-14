import { apiClient, shouldUseMock, shouldUseMockFallback } from "./client";
import { getErrorInfo } from "@/lib/utils";
import {
  GitHubRepo,
  GitHubUsernameValidation,
  GitHubConnectBasicRequest,
  GitHubConnectBasicResponse,
  GitHubConnectPatRequest,
  GitHubConnectPatResponse,
  GitHubDisconnectPatResponse,
} from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function validateGitHubUsername(
  username: string
): Promise<GitHubUsernameValidation> {
  if (await shouldUseMock()) {
    const normalized = username.trim();
    return {
      valid: !!normalized,
      username: normalized,
      avatarUrl: null,
      message: normalized
        ? "사용 가능한 사용자명입니다."
        : "사용자명을 입력해주세요.",
    };
  }
  const response = await apiClient.get<GitHubUsernameValidation>(
    "/github/validate",
    {
      params: { username },
    }
  );
  return response.data;
}

export async function connectGitHubBasic(
  data: GitHubConnectBasicRequest
): Promise<GitHubConnectBasicResponse> {
  if (await shouldUseMock()) {
    return {
      connected: true,
      type: "BASIC",
      username: data.username,
      message: "mock: GitHub 연결(기본) 성공",
    };
  }
  const response = await apiClient.post<GitHubConnectBasicResponse>(
    "/github/connect-basic",
    data
  );
  return response.data;
}

export async function connectGitHubPat(
  data: GitHubConnectPatRequest
): Promise<GitHubConnectPatResponse> {
  if (await shouldUseMock()) {
    return {
      connected: true,
      type: "FULL",
      message: "mock: GitHub 연결(PAT) 성공",
    };
  }
  const response = await apiClient.post<GitHubConnectPatResponse>(
    "/github/connect-pat",
    data
  );
  return response.data;
}

export async function disconnectGitHubPat(): Promise<GitHubDisconnectPatResponse> {
  if (await shouldUseMock()) {
    return {
      connected: false,
      type: "BASIC",
      message: "mock: GitHub PAT 연결 해제",
    };
  }
  const response =
    await apiClient.delete<GitHubDisconnectPatResponse>("/github/pat");
  return response.data;
}

export async function getRepos(): Promise<GitHubRepo[]> {
  if (await shouldUseMock()) {
    return mockApi.github.getRepos();
  }

  try {
    const response = await apiClient.get<GitHubRepo[]>("/github/repos");
    return response.data;
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const errorInfo = getErrorInfo(error);
    if (import.meta.env.DEV) {
      console.warn(
        `GitHub 리포지토리 조회 API 호출 실패, mock 데이터 사용: ${errorInfo}`,
        error
      );
    }
    return mockApi.github.getRepos();
  }
}
