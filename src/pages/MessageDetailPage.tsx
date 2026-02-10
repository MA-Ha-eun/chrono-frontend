import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getMessageDetail, deleteMessage } from "@/lib/api/message";
import { MessageDetail as MessageDetailType } from "@/types/api";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { ErrorState } from "@/components/common/ErrorState";
import { isApiError } from "@/lib/api/client";

function formatDateTime(s: string) {
  return new Date(s).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

  if (loading) {
    return (
      <div className="space-y-4">
        <Link
          to="/messages"
          className="hover:text-primary inline-flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          쪽지함으로
        </Link>
        <div className="h-64 animate-pulse rounded-xl border border-gray-200 bg-white" />
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="space-y-4">
        <Link
          to="/messages"
          className="hover:text-primary inline-flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          쪽지함으로
        </Link>
        <ErrorState
          title={error ?? "쪽지를 찾을 수 없습니다."}
          actionLabel="쪽지함으로"
          actionLink="/messages"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        to="/messages"
        className="hover:text-primary inline-flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        쪽지함으로
      </Link>

      <Card>
        <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">
              보낸 사람:{" "}
              <span className="font-medium text-gray-900">
                {message.senderNickname}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              받는 사람:{" "}
              <span className="font-medium text-gray-900">
                {message.receiverNickname}
              </span>
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {formatDateTime(message.createdAt)}
              {message.read && <span className="ml-2">· 읽음</span>}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="mt-2 shrink-0 sm:mt-0"
          >
            {deleting ? "삭제 중…" : "삭제"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-gray-800">
            {message.content}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
