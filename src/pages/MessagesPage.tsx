import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { Button } from "@/components/common/Button";
import { getInboxMessages, getSentMessages } from "@/lib/api/message";
import { MessageListItem } from "@/types/api";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { isApiError } from "@/lib/api/client";
import { PageResponse } from "@/types/api";

type Tab = "inbox" | "sent";

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
    });
  }
  return d.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessagesPage() {
  const [tab, setTab] = useState<Tab>("inbox");
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
        if (tab === "inbox") await loadInbox();
        else await loadSent();
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [tab, loadInbox, loadSent]);

  const list =
    tab === "inbox" ? (inboxData?.content ?? []) : (sentData?.content ?? []);
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
            className="inline-flex h-10 px-4 text-sm font-medium"
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
          onAction={tab === "inbox" ? loadInbox : loadSent}
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
          className="inline-flex h-10 w-full px-4 text-sm font-medium sm:w-auto"
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

      <div
        className="flex gap-1 overflow-x-auto rounded-lg border border-gray-200 bg-white p-1 shadow-sm"
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "inbox"}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            tab === "inbox"
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
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
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            tab === "sent"
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
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
            tab === "inbox" ? "받은 쪽지가 없습니다" : "보낸 쪽지가 없습니다"
          }
          description={
            tab === "inbox" ? "받은 쪽지가 없어요." : "보낸 쪽지가 없어요."
          }
        />
      ) : (
        <ul className="space-y-2">
          {list.map((item) => (
            <MessageRow key={item.messageId} item={item} tab={tab} />
          ))}
        </ul>
      )}
    </div>
  );
}

function MessageRow({ item, tab }: { item: MessageListItem; tab: Tab }) {
  const name =
    tab === "inbox"
      ? (item.senderNickname ?? "알 수 없음")
      : (item.receiverNickname ?? "알 수 없음");
  const roleLabel = tab === "inbox" ? "from" : "to";
  const preview =
    item.content.length > 60 ? `${item.content.slice(0, 60)}…` : item.content;

  return (
    <li>
      <Link
        to={`/messages/${item.messageId}`}
        className={cn(
          "hover:border-primary/30 block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:shadow-md",
          !item.read && tab === "inbox" && "border-primary/20 bg-primary-50/50"
        )}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{roleLabel}</span>
              <span className="truncate font-medium text-gray-900">{name}</span>
              {tab === "inbox" && !item.read && (
                <span className="bg-primary rounded px-1.5 py-0.5 text-[10px] font-medium text-white">
                  새 쪽지
                </span>
              )}
            </div>
            <p className="mt-1 text-sm break-words text-gray-600">{preview}</p>
          </div>

          <span className="shrink-0 text-xs text-gray-500 sm:pt-0.5">
            {formatDate(item.createdAt)}
          </span>
        </div>
      </Link>
    </li>
  );
}
