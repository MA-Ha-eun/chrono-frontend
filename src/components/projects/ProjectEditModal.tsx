import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Project } from "@/types/api";

export interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSubmit: (data: {
    title: string;
    description?: string;
    techStack?: string;
    targetDate?: string;
  }) => Promise<void>;
}

export function ProjectEditModal({
  isOpen,
  onClose,
  project,
  onSubmit,
}: ProjectEditModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (isOpen && project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setTechStack(project.techStack || "");
      setTargetDate(project.targetDate || "");
      setError(null);
    }
  }, [isOpen, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        techStack: techStack.trim() || undefined,
        targetDate: targetDate || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "프로젝트 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLoading && e.target === e.currentTarget) {
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
        className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">프로젝트 수정</h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer rounded-lg p-2 text-gray-700 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="title"
              type="text"
              label="제목"
              placeholder="프로젝트 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
            />

            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                설명
              </label>
              <textarea
                id="description"
                rows={4}
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="프로젝트에 대한 설명을 입력하세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                id="targetDate"
                type="date"
                label="목표일"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                disabled={isLoading}
              />

              <Input
                id="techStack"
                type="text"
                label="기술 스택"
                placeholder="예: React, TypeScript, Node.js"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
              >
                수정하기
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

