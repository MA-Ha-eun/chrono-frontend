import {
  mockUser,
  mockRepos,
  mockProjects,
  mockProjectsDetail,
  mockProject,
  mockDashboard,
  mockRecent7DaysCommits,
  mockWeeklyCommits,
  mockCommitSummary,
  mockCommitHistory,
  mockMessages,
  mockMessageUsers,
} from "./data";
import {
  User,
  GitHubRepo,
  ProjectListItem,
  Project,
  DashboardResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  UpdateGithubUsernameRequest,
  UpdateGithubUsernameResponse,
  UpdateProfileRequest,
  UpdatePasswordRequest,
  ProjectStatus,
  WeeklyCommitCount,
  CommitSummary,
  CommitHistoryCount,
  DailyCommitCount,
  LoginRequest,
  LoginResponse,
  MessageListItem,
  MessageDetail,
  MessageUserSearchItem,
  PageResponse,
  SendMessageRequest,
  UnreadMessageCountResponse,
} from "@/types/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL ?? "demo@example.com";
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? "demo123!";

function paginate<T>(items: T[], page: number, size: number): PageResponse<T> {
  const start = page * size;
  const end = start + size;
  const content = items.slice(start, end);
  const totalElements = items.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));

  return {
    content,
    totalElements,
    totalPages,
    size,
    number: page,
    first: page === 0,
    last: page >= totalPages - 1,
  };
}

export const mockApi = {
  auth: {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
      await delay(300);
      const isDemoAccount =
        data.email === DEMO_EMAIL && data.password === DEMO_PASSWORD;

      if (!isDemoAccount) {
        throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
      }

      return {
        accessToken: "mock-access-token",
        user: mockUser,
      };
    },
  },
  user: {
    getMe: async (): Promise<User> => {
      await delay(300);
      return mockUser;
    },
    updateGithubUsername: async (
      data: UpdateGithubUsernameRequest
    ): Promise<UpdateGithubUsernameResponse> => {
      await delay(300);
      return { githubUsername: data.githubUsername };
    },
    updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
      await delay(300);
      return { ...mockUser, ...data };
    },
    updatePassword: async (_data: UpdatePasswordRequest): Promise<void> => {
      await delay(500);
    },
  },

  github: {
    getRepos: async (): Promise<GitHubRepo[]> => {
      await delay(500);
      return mockRepos;
    },
  },

  project: {
    createProject: async (data: CreateProjectRequest): Promise<Project> => {
      await delay(500);
      const now = new Date();
      const [repoOwner, repoName] = data.repoName.includes("/")
        ? data.repoName.split("/")
        : [mockUser.githubUsername || "testuser", data.repoName];

      // 기존 리포지토리 데이터가 있으면 활용
      const existingRepo = mockRepos.find(
        (r) => r.fullName === `${repoOwner}/${repoName}`
      );

      return {
        projectId: Math.floor(Math.random() * 1000) + 1000,
        title: data.title,
        description: data.description,
        startDate: now.toISOString().split("T")[0],
        targetDate: data.targetDate,
        techStack: data.techStack,
        status: ProjectStatus.IN_PROGRESS,
        repoName: repoName,
        repoOwner: repoOwner,
        totalCommits: existingRepo ? Math.floor(Math.random() * 200) + 50 : 0,
        lastCommitAt: existingRepo ? existingRepo.updatedAt : now.toISOString(),
        github: {
          totalCommits: existingRepo ? Math.floor(Math.random() * 200) + 50 : 0,
          lastCommitAt: existingRepo
            ? existingRepo.updatedAt
            : now.toISOString(),
        },
      };
    },
    getProjects: async (): Promise<ProjectListItem[]> => {
      await delay(300);
      return mockProjects;
    },
    getProject: async (id: number): Promise<Project> => {
      await delay(300);
      // 상세 정보가 있으면 사용, 없으면 기본 프로젝트 사용
      const projectDetail = mockProjectsDetail[id];
      if (projectDetail) {
        return { ...projectDetail, projectId: id };
      }
      return { ...mockProject, projectId: id };
    },
    updateProject: async (
      id: number,
      data: UpdateProjectRequest
    ): Promise<Project> => {
      await delay(300);
      const projectDetail = mockProjectsDetail[id] || mockProject;
      return { ...projectDetail, projectId: id, ...data };
    },
    deleteProject: async (): Promise<void> => {
      await delay(300);
    },
  },

  dashboard: {
    getDashboard: async (): Promise<DashboardResponse> => {
      await delay(500);
      return mockDashboard;
    },
    getRecent7DaysCommits: async (): Promise<DailyCommitCount[]> => {
      await delay(300);
      return mockRecent7DaysCommits;
    },
  },

  commit: {
    getWeeklyCommits: async (
      _projectId: number
    ): Promise<WeeklyCommitCount[]> => {
      await delay(300);
      return mockWeeklyCommits;
    },
    getCommitSummary: async (_projectId: number): Promise<CommitSummary> => {
      await delay(300);
      return mockCommitSummary;
    },
    getCommitHistory: async (
      _projectId: number
    ): Promise<CommitHistoryCount[]> => {
      await delay(300);
      return mockCommitHistory;
    },
  },

  message: {
    sendMessage: async (data: SendMessageRequest): Promise<void> => {
      await delay(200);
      const now = new Date();
      const receiver =
        mockMessageUsers.find((u) => u.userId === data.receiverId) ?? null;

      const newMessage: MessageListItem = {
        messageId:
          (mockMessages.reduce((max, m) => Math.max(max, m.messageId), 0) ||
            0) + 1,
        senderId: mockUser.userId ?? 1,
        senderNickname: mockUser.nickname,
        receiverId: data.receiverId,
        receiverNickname: receiver?.nickname ?? `사용자 ${data.receiverId}`,
        content: data.content,
        read: false,
        createdAt: now.toISOString(),
      };

      mockMessages.unshift(newMessage);
    },

    getInboxMessages: async (
      page = 0,
      size = 20
    ): Promise<PageResponse<MessageListItem>> => {
      await delay(200);
      const inbox = mockMessages
        .filter((m) => m.receiverId === mockUser.userId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return paginate(inbox, page, size);
    },

    getSentMessages: async (
      page = 0,
      size = 20
    ): Promise<PageResponse<MessageListItem>> => {
      await delay(200);
      const sent = mockMessages
        .filter((m) => m.senderId === mockUser.userId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return paginate(sent, page, size);
    },

    getMessageDetail: async (id: number): Promise<MessageDetail> => {
      await delay(200);
      const found = mockMessages.find((m) => m.messageId === id);
      if (!found) {
        throw new Error("쪽지를 찾을 수 없습니다.");
      }

      if (found.receiverId === mockUser.userId && !found.read) {
        found.read = true;
      }

      return {
        messageId: found.messageId,
        senderId: found.senderId ?? mockUser.userId ?? 1,
        senderNickname: found.senderNickname ?? mockUser.nickname,
        receiverId: found.receiverId ?? mockUser.userId ?? 1,
        receiverNickname: found.receiverNickname ?? mockUser.nickname,
        content: found.content,
        read: found.read,
        createdAt: found.createdAt,
      };
    },

    deleteMessage: async (id: number): Promise<void> => {
      await delay(150);
      const index = mockMessages.findIndex((m) => m.messageId === id);
      if (index !== -1) {
        mockMessages.splice(index, 1);
      }
    },

    searchUsers: async (
      keyword: string,
      page = 0,
      size = 20
    ): Promise<PageResponse<MessageUserSearchItem>> => {
      await delay(200);
      const normalized = keyword.trim().toLowerCase();
      if (!normalized) {
        return paginate([], page, size);
      }

      const allCandidates: MessageUserSearchItem[] = [
        {
          userId: mockUser.userId ?? 1,
          nickname: mockUser.nickname,
          email: mockUser.email,
          githubUsername: mockUser.githubUsername,
        },
        ...mockMessageUsers,
      ];

      const filtered = allCandidates.filter((u) => {
        // 자기 자신 제외 (백엔드와 동일)
        if (u.userId === mockUser.userId) return false;
        const target = `${u.nickname ?? ""} ${u.email ?? ""} ${
          u.githubUsername ?? ""
        }`.toLowerCase();
        return target.includes(normalized);
      });

      return paginate(filtered, page, size);
    },

    getUnreadMessageCount: async (): Promise<UnreadMessageCountResponse> => {
      await delay(150);
      const count = mockMessages.filter(
        (m) => m.receiverId === mockUser.userId && !m.read
      ).length;
      return { count };
    },
  },
};
