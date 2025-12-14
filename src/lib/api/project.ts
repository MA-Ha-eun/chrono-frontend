import { apiClient } from "./client";
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectListItem,
  ProjectStatus,
} from "@/types/api";
import { mockApi } from "@/lib/mock/api";

export async function createProject(
  data: CreateProjectRequest,
  owner?: string // GitHub username
): Promise<{ projectId: number }> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    const mockProject = await mockApi.project.createProject(data);
    return { projectId: mockProject.id };
  }
  
  try {
    if (!owner) {
      throw new Error("GitHub username이 필요합니다.");
    }
    
    // 백엔드 현재 요청 형식: { "owner", "repoName", "repoUrl" }
    // TODO: 백엔드에서 title, description, targetDate, techStack 필드 추가 필요
    // repoName은 fullName 형식 (예: "owner/repoName")
    const [repoOwner, repoName] = data.repoName.includes("/")
      ? data.repoName.split("/")
      : [owner, data.repoName];
    
    const response = await apiClient.post<{ projectId: number }>("/projects", {
      owner: repoOwner,
      repoName: repoName,
      repoUrl: `https://github.com/${repoOwner}/${repoName}`,
    });
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("프로젝트 생성 API 호출 실패, mock 데이터 사용:", error);
      const mockProject = await mockApi.project.createProject(data);
      return { projectId: mockProject.id };
    }
    throw error;
  }
}

// 백엔드 현재 응답 형식: { "projectId", "owner", "repoName", "repoUrl", "active", "createdAt" }
interface BackendProjectResponse {
  projectId: number;
  owner: string;
  repoName: string;
  repoUrl: string;
  active: boolean;
  createdAt: string;
}

export async function getProjects(): Promise<ProjectListItem[]> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.project.getProjects();
  }
  
  try {
    const response = await apiClient.get<BackendProjectResponse[]>("/projects");
    
    return response.data.map((p) => ({
      id: p.projectId,
      title: p.repoName,
      status: p.active ? ProjectStatus.IN_PROGRESS : ProjectStatus.COMPLETED,
      techStack: undefined,
      lastCommitAt: undefined,
      totalCommits: undefined,
      targetDate: undefined,
      startDate: p.createdAt,
    }));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("프로젝트 목록 API 호출 실패, mock 데이터 사용:", error);
      return mockApi.project.getProjects();
    }
    throw error;
  }
}

// TODO: 백엔드에 GET /api/projects/{id} 엔드포인트 추가 필요
export async function getProject(id: number): Promise<Project> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.project.getProject(id);
  }
  
  try {
    throw new Error("백엔드에 프로젝트 상세 조회 API가 없습니다.");
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("프로젝트 상세 조회 API 호출 실패, mock 데이터 사용:", error);
      return mockApi.project.getProject(id);
    }
    throw error;
  }
}

// TODO: 백엔드에 PUT /api/projects/{id} 엔드포인트 추가 필요
export async function updateProject(
  id: number,
  data: UpdateProjectRequest
): Promise<Project> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.project.updateProject(id, data);
  }
  throw new Error("백엔드에 프로젝트 수정 API가 없습니다.");
}

// TODO: 백엔드에 DELETE /api/projects/{id} 엔드포인트 추가 필요
export async function deleteProject(id: number): Promise<void> {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
    return mockApi.project.deleteProject(id);
  }
  throw new Error("백엔드에 프로젝트 삭제 API가 없습니다.");
}

