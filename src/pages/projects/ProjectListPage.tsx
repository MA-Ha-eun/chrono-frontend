import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GitCommit, Calendar, Loader2 } from "lucide-react";
import { getProjects } from "@/lib/api/project";
import { ProjectListItem, ProjectStatus } from "@/types/api";
import { Badge } from "@/components/common/Badge";
import { getDaysSinceLastCommit } from "@/utils/dashboard";

export function ProjectListPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError("프로젝트 목록을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    return status === ProjectStatus.IN_PROGRESS ? "진행 중" : "완료";
  };

  const getStatusVariant = (status: ProjectStatus): "primary" | "accent" => {
    return status === ProjectStatus.IN_PROGRESS ? "primary" : "accent";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">프로젝트</h1>
          <p className="mt-1 text-sm text-gray-500">관리 중인 사이드 프로젝트 목록입니다.</p>
        </div>
        <Link
          to="/projects/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          + 새 프로젝트
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 shadow-sm">
          <div className="rounded-full bg-gray-100 p-4">
            <GitCommit className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">프로젝트가 없습니다</h3>
          <p className="mt-2 text-sm text-gray-500">첫 프로젝트를 만들어보세요!</p>
          <Link
            to="/projects/new"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            + 새 프로젝트 만들기
          </Link>
        </div>
      ) : (
        /* Project Grid */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const daysAgo = getDaysSinceLastCommit(project);
            const techStackArray = project.techStack
              ? project.techStack.split(",").map((s) => s.trim())
              : [];

            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group block rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                {/* Header: Title + Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>
                  <Badge variant={getStatusVariant(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>

                {/* Tech Stack */}
                {techStackArray.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {techStackArray.map((tech, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer: Commit Info + Last Activity */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                  {/* Commit Count */}
                  {project.totalCommits !== undefined ? (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <GitCommit className="h-4 w-4 text-primary" />
                      <span className="font-medium text-gray-900">
                        {project.totalCommits}
                      </span>
                      <span className="text-gray-500">commits</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}

                  {/* Last Activity */}
                  {daysAgo !== null && (
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {daysAgo === 0 ? "오늘" : `${daysAgo}일 전`}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

