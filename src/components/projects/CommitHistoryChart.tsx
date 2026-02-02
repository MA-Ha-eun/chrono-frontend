import { CommitHistoryCount } from "@/types/api";
import { getCommitIntensity } from "@/utils/dashboard";

export function CommitHistoryChart({
  history,
}: {
  history: CommitHistoryCount[];
}) {
  const validHistory = history.filter((h) => h.date != null);
  const sortedHistory = [...validHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const generateLast14Days = (): CommitHistoryCount[] => {
    const days: CommitHistoryCount[] = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const existing = sortedHistory.find((h) => {
        const backendDate = h.date?.split("T")[0] || h.date;
        return backendDate === dateStr;
      });
      days.push({
        date: dateStr,
        count: existing?.count ?? 0,
      });
    }
    return days;
  };

  const displayHistory = generateLast14Days();
  const maxCount = Math.max(...displayHistory.map((h) => h.count), 1);

  return (
    <div className="-mx-1.5 overflow-x-auto px-1.5 sm:-mx-2 sm:px-2 md:mx-0 md:px-0">
      <div className="flex min-w-fit items-end justify-between gap-0.5 sm:gap-1 md:gap-0">
        {displayHistory.map((item, index) => {
          const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
          const intensity = getCommitIntensity(item.count);
          return (
            <div
              key={`${item.date}-${index}`}
              className="group flex min-w-[32px] flex-1 flex-col items-center gap-1.5 sm:min-w-[36px] sm:gap-2 md:min-w-0"
            >
              <div
                className="relative flex w-full items-end"
                style={{ height: "60px" }}
              >
                {item.count > 0 && (
                  <span
                    className="absolute left-1/2 z-10 -translate-x-1/2 text-xs whitespace-nowrap text-gray-500 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                      bottom: `${60 * (Math.max(height, item.count > 0 ? 12 : 4) / 100) + 6}px`,
                    }}
                  >
                    {item.count}
                  </span>
                )}
                <div
                  className={`w-full rounded-t ${intensity.bg} transition-all hover:opacity-80`}
                  style={{
                    height: `${Math.max(height, item.count > 0 ? 12 : 4)}%`,
                    minHeight: item.count > 0 ? "16px" : "4px",
                  }}
                  title={`${formatDate(item.date)}: ${item.count} commits`}
                />
              </div>
              <span className="text-center text-[10px] whitespace-nowrap text-gray-500 sm:text-[11px]">
                {formatDate(item.date)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
