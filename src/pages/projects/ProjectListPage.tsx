import { Link } from "react-router-dom";

export function ProjectListPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">프로젝트</h1>
          <p className="text-sm text-gray-500">관리 중인 사이드 프로젝트 목록입니다.</p>
        </div>
        <Link
          to="/projects/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          + 새 프로젝트
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
         {/* Project List Placeholders */}
         <div className="h-40 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            Project Card Placeholder
         </div>
      </div>
    </div>
  );
}

