import { Link } from "react-router-dom";
import { GitCommit } from "lucide-react";
import { ProjectListItem } from "@/types/api";
import { getDaysSinceLastCommit } from "@/utils/dashboard";

interface RecentProjectsProps {
  projects: ProjectListItem[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-uniform">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">최근 프로젝트</h2>
        <Link
          to="/projects/new"
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          + 새 프로젝트
        </Link>
      </div>
      {projects.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-500">아직 프로젝트가 없습니다.</p>
          <Link
            to="/projects/new"
            className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-dark"
          >
            첫 프로젝트 만들기
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const daysAgo = getDaysSinceLastCommit(project);
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group block rounded-lg border border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-primary/50 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 transition-colors group-hover:text-primary">
                      {project.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {project.techStack && (
                        <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600">
                          {project.techStack}
                        </span>
                      )}
                      {project.totalCommits !== undefined && (
                        <span className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600">
                          <GitCommit className="h-3 w-3" />
                          {project.totalCommits}
                        </span>
                      )}
                    </div>
                  </div>
                  {daysAgo !== null && (
                    <div className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
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

