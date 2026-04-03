import { Copy, X } from "lucide-react";

interface GeneratedTextModalProps {
  isOpen: boolean;
  title: string;
  text: string;
  emptyText: string;
  isLoading: boolean;
  error: string | null;
  loadingBorderClassName?: string;
  onClose: () => void;
  onRegenerate: () => void;
  onCopy: () => void;
}

export function GeneratedTextModal({
  isOpen,
  title,
  text,
  emptyText,
  isLoading,
  error,
  loadingBorderClassName = "border-primary",
  onClose,
  onRegenerate,
  onCopy,
}: GeneratedTextModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${loadingBorderClassName}`}
              />
              생성 중입니다...
            </div>
          ) : error ? (
            <p className="text-accent-dark text-sm">{error}</p>
          ) : (
            <div className="max-h-[420px] overflow-y-auto rounded-lg bg-zinc-50 p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                {text || emptyText}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isLoading}
            className="text-primary hover:text-primary-dark cursor-pointer text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            다시 생성
          </button>
          <button
            type="button"
            onClick={onCopy}
            disabled={!text || isLoading}
            className="hover:text-primary inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            복사
          </button>
        </div>
      </div>
    </div>
  );
}
