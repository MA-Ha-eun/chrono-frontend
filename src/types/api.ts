// API 응답 타입 정의 (API_SPEC.md 기반)

// 공통 에러 응답
export type ApiError = {
  message: string;
  code: string;
};

// 공통 에러 코드
export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  SERVER_ERROR = "SERVER_ERROR",
  GITHUB_USERNAME_NOT_SET = "GITHUB_USERNAME_NOT_SET",
  GITHUB_USER_NOT_FOUND = "GITHUB_USER_NOT_FOUND",
  GITHUB_RATE_LIMIT = "GITHUB_RATE_LIMIT",
  GITHUB_REPO_NOT_FOUND = "GITHUB_REPO_NOT_FOUND",
}

// ========== Auth ==========
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

// ========== User ==========
export interface User {
  id: number;
  email: string;
  nickname: string;
  bio?: string;
  githubUsername?: string;
}

export interface UpdateGithubUsernameRequest {
  githubUsername: string;
}

export interface UpdateGithubUsernameResponse {
  githubUsername: string;
}

export interface UpdateProfileRequest {
  nickname?: string;
  bio?: string;
}

// ========== GitHub ==========
// 백엔드 GithubRepoDto에 맞춘 타입
export interface GitHubRepo {
  repoId: number;
  repoName: string;
  fullName: string;
  description: string | null;
  isPrivate: boolean;
  htmlUrl: string;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  updatedAt: string;
}

export interface CommitStats {
  totalCommits: number;
  lastCommitAt: string;
}

// ========== Project ==========
export enum ProjectStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  targetDate?: string;
  techStack?: string;
  status: ProjectStatus;
  repoName: string;
  repoOwner: string;
  totalCommits?: number;
  lastCommitAt?: string;
  github?: CommitStats;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  targetDate?: string;
  techStack?: string;
  repoName: string;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  targetDate?: string;
  techStack?: string;
  status?: ProjectStatus;
}

export interface ProjectListItem {
  id: number;
  title: string;
  status: ProjectStatus;
  techStack?: string;
  lastCommitAt?: string;
  totalCommits?: number;
  targetDate?: string;
  startDate?: string;
}

// ========== Dashboard ==========
export interface DashboardSummary {
  inProgressCount: number;
  completedCount: number;
  totalCommitsThisMonth: number;
}

export interface WeeklyCommit {
  dayOfWeek: string; // "MON", "TUE", etc.
  date: string; // "2025-11-17"
  count: number;
}

export interface WeekInfo {
  startDate: string;
  endDate: string;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  weeklyCommits: WeeklyCommit[];
  weekInfo: WeekInfo;
  recentProjects: ProjectListItem[];
}

