import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useToastStore } from "@/stores/toastStore";
import { MessageUserSearchItem, SendMessageRequest } from "@/types/api";
import { searchMessageUsers, sendMessage } from "@/lib/api/message";
import { isApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

export function MessageComposePage() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<MessageUserSearchItem[]>(
    []
  );
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] =
    useState<MessageUserSearchItem | null>(null);

  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contentLength = content.length;
  const contentTooLong = contentLength > 1000;

  // 받는 사람 검색 (디바운스)
  useEffect(() => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      setIsSearching(false);
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await searchMessageUsers(trimmed, 0, 10);
        if (cancelled) return;
        setSearchResults(res.content);
        setSearchError(null);
      } catch (err) {
        if (cancelled) return;
        if (isApiError(err)) {
          setSearchError(err.message || "사용자 검색에 실패했습니다.");
        } else {
          setSearchError("사용자 검색에 실패했습니다.");
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [keyword]);

  const canSubmit = useMemo(() => {
    return (
      !!selectedUser && !!content.trim() && !contentTooLong && !isSubmitting
    );
  }, [selectedUser, content, contentTooLong, isSubmitting]);

  const handleSubmit = async () => {
    if (!selectedUser) {
      showToast("받는 사람을 선택해주세요.", "error");
      return;
    }
    if (!content.trim()) {
      showToast("내용을 입력해주세요.", "error");
      return;
    }
    if (contentTooLong) {
      showToast("내용은 1000자 이하여야 합니다.", "error");
      return;
    }

    const payload: SendMessageRequest = {
      receiverId: selectedUser.userId,
      content: content.trim(),
    };

    setIsSubmitting(true);
    try {
      await sendMessage(payload);
      showToast("쪽지를 보냈습니다.", "success");
      navigate("/messages");
    } catch (err) {
      if (isApiError(err)) {
        showToast(err.message || "쪽지 보내기에 실패했습니다.", "error");
      } else {
        showToast("쪽지를 보내는 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showResultsDropdown =
    keyword.trim().length > 0 && searchResults.length > 0 && !selectedUser;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-start justify-center py-4 sm:items-center sm:py-0">
      <div className="w-full max-w-3xl">
        <Card className="border-0 p-4 shadow-sm sm:p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              쪽지 보내기
            </h1>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  받는 사람
                  <span className="text-primary ml-1">*</span>
                </label>
                <p className="text-xs text-gray-500">
                  닉네임, 이메일 또는 GitHub 아이디로 검색할 수 있어요.
                </p>
              </div>

              <div className="relative">
                <Input
                  value={selectedUser ? selectedUser.nickname : keyword}
                  onChange={(e) => {
                    setSelectedUser(null);
                    setKeyword(e.target.value);
                  }}
                  placeholder="예: 개발자, developer@example.com, github 아이디 등"
                  className="pl-9"
                />
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

                {selectedUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(null);
                      setKeyword("");
                      setSearchResults([]);
                      setSearchError(null);
                    }}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="선택한 사용자 제거"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {isSearching && !selectedUser && (
                  <p className="mt-1 text-xs text-gray-500">
                    사용자를 검색하는 중입니다…
                  </p>
                )}
                {searchError && !selectedUser && (
                  <p className="text-accent-dark mt-1 text-xs">{searchError}</p>
                )}

                {showResultsDropdown && (
                  <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {searchResults.map((user) => (
                      <button
                        key={user.userId}
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          setSelectedUser(user);
                          setKeyword("");
                          setSearchResults([]);
                          setSearchError(null);
                        }}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">
                            {user.nickname}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {user.email}
                            {user.githubUsername && (
                              <span className="ml-1 text-[11px] text-gray-400">
                                · @{user.githubUsername}
                              </span>
                            )}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="message-content"
                className="block text-sm font-medium text-gray-700"
              >
                내용
                <span className="text-primary ml-1">*</span>
              </label>
              <textarea
                id="message-content"
                rows={5}
                className={cn(
                  "flex w-full rounded-lg border px-3 py-2 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:ring-1 focus:outline-none",
                  contentTooLong
                    ? "border-accent focus:border-accent focus:ring-accent"
                    : "focus:border-primary focus:ring-primary border-gray-300 bg-white",
                  "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                )}
                placeholder="보낼 내용을 입력해주세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p
                className={cn(
                  "text-xs",
                  contentTooLong ? "text-accent-dark" : "text-gray-500"
                )}
              >
                {contentLength}/1000
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:border-t-0 sm:pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // 팝업으로 열린 경우 창 닫기, 아니면 쪽지함으로 이동
                  if (window.name === "message-compose") {
                    window.close();
                  } else {
                    navigate("/messages");
                  }
                }}
                disabled={isSubmitting}
                className="w-full sm:flex-1"
              >
                취소
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={!canSubmit}
                className="w-full sm:flex-1"
              >
                {isSubmitting ? "전송 중…" : "전송"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
