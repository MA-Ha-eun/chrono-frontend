import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "accent";
  isLoading?: boolean;
  closeOnBackdropClick?: boolean;
  showIcon?: boolean;
}

// 확인 모달 (사용자 확인 필요 시)
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  confirmVariant = "accent",
  isLoading = false,
  closeOnBackdropClick = true,
  showIcon = true,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && !isLoading && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-3">
            {showIcon && (
              <AlertTriangle className="text-accent-dark mt-0.5 h-5 w-5 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-lg leading-tight font-semibold text-gray-900">
                {title}
              </h3>
              {description && (
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {description
                    .replace(/\\n/g, "\n")
                    .split("\n")
                    .map((line, index, array) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < array.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button
              variant={confirmVariant === "accent" ? "accent" : "primary"}
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
