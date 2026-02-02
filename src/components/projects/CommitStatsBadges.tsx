import { GitCommitHorizontal, Sparkle } from "lucide-react";

interface CommitStatsBadgesProps {
  streakDays: number;
  mostActiveDayName: string | null;
}

export function CommitStatsBadges({
  streakDays,
  mostActiveDayName,
}: CommitStatsBadgesProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 pt-4">
      <div className="bg-accent-50 flex items-center gap-2 rounded-lg px-3 py-1.5">
        <GitCommitHorizontal className="text-accent h-4 w-4" />
        <span className="text-accent text-xs font-medium">
          {streakDays}일 연속
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Sparkle className="text-accent h-4 w-4" />
        <span className="text-xs font-medium text-gray-500">
          {mostActiveDayName
            ? `${mostActiveDayName}에 가장 활발했어요`
            : "최근 활동이 없어요"}
        </span>
      </div>
    </div>
  );
}
