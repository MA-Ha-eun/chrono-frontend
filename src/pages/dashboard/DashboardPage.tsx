export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">대시보드</h1>
        <p className="text-sm text-gray-500">당신의 프로젝트 활동을 한눈에 확인하세요.</p>
      </div>
      
      {/* Placeholder Content */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="h-32 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          Loading Summary...
        </div>
        <div className="h-32 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          Loading Summary...
        </div>
        <div className="h-32 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          Loading Summary...
        </div>
      </div>
    </div>
  );
}

