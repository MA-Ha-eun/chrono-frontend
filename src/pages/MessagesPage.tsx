import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { Button } from "@/components/common/Button";
import { getInboxMessages, getSentMessages } from "@/lib/api/message";
import { MessageListItem } from "@/types/api";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { isApiError } from "@/lib/api/client";
import { PageResponse } from "@/types/api";
import { Badge } from "@/components/common/Badge";

type Tab = "all" | "inbox" | "sent";
type MessageSource = "inbox" | "sent";

type DisplayMessage = MessageListItem & {
  source: MessageSource;
};

function formatDate(s: string) {
  const d = new Date(s);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (isToday) {
    return d.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return d.toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function MessagesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("all");
  const [inboxData, setInboxData] =
    useState<PageResponse<MessageListItem> | null>(null);
  const [sentData, setSentData] =
    useState<PageResponse<MessageListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInbox = useCallback(async () => {
    try {
      const data = await getInboxMessages(0, 20);
      setInboxData(data);
    } catch (err) {
      if (isApiError(err))
        setError(err.message ?? "받은 쪽지를 불러오는 데 실패했습니다.");
      else setError("받은 쪽지를 불러오는 데 실패했습니다.");
    }
  }, []);

  const loadSent = useCallback(async () => {
    try {
      const data = await getSentMessages(0, 20);
      setSentData(data);
    } catch (err) {
      if (isApiError(err))
        setError(err.message ?? "보낸 쪽지를 불러오는 데 실패했습니다.");
      else setError("보낸 쪽지를 불러오는 데 실패했습니다.");
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    setError(null);
    setLoading(true);

    const load = async () => {
      try {
        if (tab === "all") {
          await Promise.all([loadInbox(), loadSent()]);
        } else if (tab === "inbox") {
          await loadInbox();
        } else {
          await loadSent();
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [tab, loadInbox, loadSent]);

  const allList: DisplayMessage[] = [
    ...(inboxData?.content ?? []).map((item) => ({
      ...item,
      source: "inbox" as const,
    })),
    ...(sentData?.content ?? []).map((item) => ({
      ...item,
      source: "sent" as const,
    })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const list: DisplayMessage[] =
    tab === "all"
      ? allList
      : tab === "inbox"
        ? (inboxData?.content ?? []).map((item) => ({
            ...item,
            source: "inbox" as const,
          }))
        : (sentData?.content ?? []).map((item) => ({
            ...item,
            source: "sent" as const,
          }));
  const isEmpty = !loading && list.length === 0;

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              쪽지
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              chrono. 사용자들과 쪽지를 주고받을 수 있어요.
            </p>
          </div>
          <Button
            size="md"
            type="button"
            className="bg-primary hover:bg-primary-dark inline-flex h-10 w-full justify-center rounded-lg px-4 text-sm font-medium text-white transition-colors sm:w-auto"
            onClick={(e) => {
              e.preventDefault();
              window.open(
                "/messages/new",
                "message-compose",
                "width=560,height=640,noopener,noreferrer"
              );
            }}
          >
            쪽지 보내기
          </Button>
        </div>
        <ErrorState
          title={error}
          actionLabel="다시 시도"
          onAction={async () => {
            if (tab === "all") {
              await Promise.all([loadInbox(), loadSent()]);
            } else if (tab === "inbox") {
              await loadInbox();
            } else {
              await loadSent();
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">쪽지</h1>
          <p className="mt-1 text-sm text-gray-500">
            chrono. 사용자들과 쪽지를 주고받을 수 있어요.
          </p>
        </div>
        <Button
          size="md"
          type="button"
          className="bg-primary hover:bg-primary-dark inline-flex h-10 w-full justify-center rounded-lg px-4 text-sm font-medium text-white transition-colors sm:w-auto"
          onClick={(e) => {
            e.preventDefault();
            window.open(
              "/messages/new",
              "message-compose",
              "width=560,height=640,noopener,noreferrer"
            );
          }}
        >
          쪽지 보내기
        </Button>
      </div>

      <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <div
          className="mb-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "all"}
            className={cn(
              "cursor-pointer rounded-full px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:px-4 sm:py-2.5",
              tab === "all"
                ? "bg-primary-50 text-primary"
                : "text-gray-700 hover:bg-zinc-50"
            )}
            onClick={() => setTab("all")}
          >
            전체
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "inbox"}
            className={cn(
              "cursor-pointer rounded-full px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:px-4 sm:py-2.5",
              tab === "inbox"
                ? "bg-primary-50 text-primary"
                : "text-gray-700 hover:bg-zinc-50"
            )}
            onClick={() => setTab("inbox")}
          >
            받은 쪽지
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "sent"}
            className={cn(
              "cursor-pointer rounded-full px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:px-4 sm:py-2.5",
              tab === "sent"
                ? "bg-primary-50 text-primary"
                : "text-gray-700 hover:bg-zinc-50"
            )}
            onClick={() => setTab("sent")}
          >
            보낸 쪽지
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-gray-200 bg-white"
              />
            ))}
          </div>
        ) : isEmpty ? (
          <EmptyState
            icon={Mail}
            title={
              tab === "all"
                ? "쪽지가 없습니다"
                : tab === "inbox"
                  ? "받은 쪽지가 없습니다"
                  : "보낸 쪽지가 없습니다"
            }
            description={
              tab === "all"
                ? "새로운 쪽지가 도착하거나 보내면 이곳에 표시됩니다."
                : tab === "inbox"
                  ? "새로운 쪽지가 도착하면 여기에서 확인할 수 있어요."
                  : "필요한 내용을 팀원에게 먼저 보내보세요."
            }
            actionLabel="쪽지 보내기"
            onAction={() => navigate("/messages/new")}
            className="py-16"
          />
        ) : (
          <ul className="space-y-2">
            {list.map((item) => (
              <MessageRow
                key={`${item.source}-${item.messageId}`}
                item={item}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function MessageRow({ item }: { item: DisplayMessage }) {
  const name =
    item.source === "inbox"
      ? (item.senderNickname ?? "알 수 없음")
      : (item.receiverNickname ?? "알 수 없음");
  const roleLabel = item.source === "inbox" ? "from." : "to.";
  const preview =
    item.content.length > 60 ? `${item.content.slice(0, 60)}…` : item.content;

  return (
    <li>
      <Link
        to={`/messages/${item.messageId}`}
        className="group hover:border-primary/50 hover:bg-primary/5 block min-h-[72px] rounded-lg border border-gray-200 bg-white p-4 text-left transition-all duration-200 ease-in-out"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-xs text-gray-500">{roleLabel}</span>
              <span className="group-hover:text-primary truncate font-medium text-gray-900 transition-colors">
                {name}
              </span>
              {item.source === "inbox" && !item.read && (
                <Badge
                  variant="accent"
                  className="px-2 py-1 text-[10px] uppercase"
                >
                  NEW
                </Badge>
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-gray-500 sm:mt-2">
              {preview}
            </p>
          </div>

          <span className="shrink-0 text-xs text-gray-500 sm:pt-0.5">
            {formatDate(item.createdAt)}
          </span>
        </div>
      </Link>
    </li>
  );
}
