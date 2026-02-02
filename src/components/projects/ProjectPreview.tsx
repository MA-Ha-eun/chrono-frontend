import React from "react";
import { Link } from "react-router-dom";
import {
  GitCommitVertical,
  Calendar,
  ChevronRight,
  Target,
  CircleAlert,
  Flame,
} from "lucide-react";
import { ProjectListItem, ProjectStatus } from "@/types/api";
import { Badge } from "@/components/common/Badge";
import { InfoCard } from "@/components/common/InfoCard";
import { getDaysSinceLastCommit } from "@/utils/dashboard";

interface ProjectPreviewProps {
  project: ProjectListItem;
  getStatusLabel: (status: ProjectStatus) => string;
  getStatusVariant: (status: ProjectStatus) => "primary" | "accent";
  getTimeLabel: (daysAgo: number | null) => string;
  getDday: (targetDate?: string) => number | null;
  getDdayLabel: (
    dday: number | null
  ) => { label: string; isUrgent?: boolean; isOverdue?: boolean } | null;
}

export function ProjectPreview({
  project,
  getStatusLabel,
  getStatusVariant,
  getTimeLabel,
  getDday,
  getDdayLabel,
}: ProjectPreviewProps) {
  const daysAgo = getDaysSinceLastCommit(project);
  const techStackArray = project.techStack
    ? project.techStack.split(",").map((s) => s.trim())
    : [];
  const dday =
    project.status !== ProjectStatus.COMPLETED
      ? getDday(project.targetDate)
      : null;
  const ddayInfo = dday !== null ? getDdayLabel(dday) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{project.title}</h2>
      </div>

      <div className="space-y-3">
        <InfoCard
          icon={GitCommitVertical}
          label="총 커밋"
          value={project.totalCommits ?? 0}
        />

        <InfoCard
          icon={Calendar}
          label="최근 활동"
          value={getTimeLabel(daysAgo)}
        />

        <div
          className={`flex min-h-[85px] items-center justify-between rounded-lg p-5 ${
            project.status === ProjectStatus.COMPLETED
              ? "bg-zinc-50"
              : ddayInfo?.isOverdue
                ? "bg-accent-50"
                : "bg-zinc-50"
          }`}
        >
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Target className="text-primary h-4 w-4" />
            <span>목표</span>
          </div>
          {project.targetDate ? (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                {ddayInfo && project.status !== ProjectStatus.COMPLETED && (
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      ddayInfo.isOverdue
                        ? "text-gray-300"
                        : ddayInfo.isUrgent
                          ? "text-accent"
                          : "text-gray-700"
                    }`}
                  >
                    {ddayInfo.label}
                    {ddayInfo.isOverdue && (
                      <CircleAlert className="h-3.5 w-3.5" />
                    )}
                    {ddayInfo.isUrgent && !ddayInfo.isOverdue && (
                      <Flame className="h-3.5 w-3.5" />
                    )}
                  </div>
                )}
                <Badge variant={getStatusVariant(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(project.targetDate).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          ) : (
            <span className="text-base font-semibold text-gray-500">
              설정 없음
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center">
        {techStackArray.length > 0 ? (
          <>
            {techStackArray.slice(0, 5).map((tech, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <div className="mx-2 h-4 border-l border-gray-100"></div>
                )}
                <span className="rounded-md px-5 py-2.5 text-sm font-semibold text-gray-900">
                  {tech}
                </span>
              </React.Fragment>
            ))}
            {techStackArray.length > 5 && (
              <>
                <div className="mx-2 h-4 border-l border-gray-100"></div>
                <div className="group relative">
                  <span className="cursor-pointer rounded-md px-5 py-2.5 text-sm font-semibold text-gray-900">
                    외 {techStackArray.length - 5}가지
                  </span>
                  <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 group-hover:block">
                    <div className="rounded-lg bg-gray-900 px-3 py-2 text-center text-xs text-white shadow-lg">
                      <div className="flex flex-col gap-1">
                        {techStackArray.slice(5).map((tech, idx) => (
                          <span key={idx}>{tech}</span>
                        ))}
                      </div>
                      <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-4 border-r-4 border-l-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <span className="rounded-md px-5 py-2.5 text-sm font-medium text-gray-500">
            기술 스택 정보가 없습니다
          </span>
        )}
      </div>

      <Link
        to={`/projects/${project.projectId}`}
        className="bg-primary hover:bg-primary-dark flex h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-white transition-colors"
      >
        상세보기
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
