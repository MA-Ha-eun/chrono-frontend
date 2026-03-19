import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getMessageDetail, deleteMessage } from "@/lib/api/message";
import { MessageDetail as MessageDetailType } from "@/types/api";
import { ErrorState } from "@/components/common/ErrorState";
import { isApiError } from "@/lib/api/client";
import { Badge } from "@/components/common/Badge";

function formatDateTimeFull(s: string) {
  return new Date(s).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function MessageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<MessageDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const messageId = id ? parseInt(id, 10) : NaN;

  useEffect(() => {
    if (!id || Number.isNaN(messageId)) {
      setError("잘못된 쪽지입니다.");
      setLoading(false);
      return;
    }

    let mounted = true;
    setError(null);

    getMessageDetail(messageId)
      .then((data) => mounted && setMessage(data))
      .catch((err) => {
        if (!mounted) return;
        if (isApiError(err))
          setError(err.message ?? "쪽지를 불러오는 데 실패했습니다.");
        else setError("쪽지를 불러오는 데 실패했습니다.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id, messageId]);

  const handleDelete = async () => {
    if (Number.isNaN(messageId) || deleting) return;
    if (!window.confirm("이 쪽지를 삭제하시겠습니까?")) return;

    setDeleting(true);
    try {
      await deleteMessage(messageId);
      navigate("/messages", { replace: true });
    } catch (err) {
      if (isApiError(err)) setError(err.message ?? "삭제에 실패했습니다.");
      else setError("삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  const listRow = (
    <div className="flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={() => navigate("/messages")}
        className="hover:text-primary flex min-w-0 cursor-pointer items-center gap-1.5 text-sm text-gray-500 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 shrink-0" />
        <span>목록으로</span>
      </button>
      <div className="flex shrink-0 justify-end">
        {message && !error ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="hover:text-accent cursor-pointer text-sm text-gray-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "삭제 중…" : "삭제"}
          </button>
        ) : (
          <span className="invisible inline-block text-sm" aria-hidden>
            삭제
          </span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {listRow}
        <div className="h-64 animate-pulse rounded-xl bg-white shadow-sm" />
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="space-y-6">
        {listRow}
        <ErrorState
          title={error ?? "쪽지를 찾을 수 없습니다."}
          description="쪽지가 삭제되었거나 접근 권한이 없습니다."
          actionLabel="목록으로"
          actionLink="/messages"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {listRow}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <time className="text-xs text-gray-500" dateTime={message.createdAt}>
            {formatDateTimeFull(message.createdAt)}
          </time>
          {!message.read ? (
            <Badge
              variant="accent"
              className="min-h-7 justify-center leading-none uppercase"
            >
              NEW
            </Badge>
          ) : (
            <Badge
              variant="accent"
              className="min-h-7 justify-center border-0 bg-zinc-50 leading-none text-gray-900"
            >
              읽음
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-sm text-gray-500">보낸 사람</span>
            <span className="text-sm font-semibold text-gray-950">
              {message.senderNickname}
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-sm text-gray-500">받는 사람</span>
            <span className="text-sm font-semibold text-gray-950">
              {message.receiverNickname}
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-zinc-50 p-5">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
