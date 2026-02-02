import {
  useState,
  useEffect,
  useRef,
  useMemo,
  type FormEvent,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { getRepos } from "@/lib/api/github";
import { createProject } from "@/lib/api/project";
import { getMe } from "@/lib/api/user";
import { isApiError } from "@/lib/api/client";
import { GitHubRepo } from "@/types/api";
import { cn } from "@/lib/utils";
import { POPULAR_TECH_STACKS } from "@/lib/constants/techStacks";

export function ProjectCreatePage() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const getTodayString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const today = getTodayString();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [techStack, setTechStack] = useState("");
  const [repoName, setRepoName] = useState("");
  const [titleMessage, setTitleMessage] = useState<string | null>(null);
  const [descriptionMessage, setDescriptionMessage] = useState<string | null>(
    null
  );
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current || isLoadingRef.current) return;

    const loadUserAndRepos = async () => {
      isLoadingRef.current = true;
      try {
        if (!user?.githubUsername) {
          const userData = await getMe();
          setUser(userData);
          if (!userData.githubUsername) {
            hasLoadedRef.current = true;
            isLoadingRef.current = false;
            return;
          }
        }

        setIsLoadingRepos(true);
        const repoList = await getRepos();
        setRepos(repoList);
        hasLoadedRef.current = true;
      } catch (err) {
        hasLoadedRef.current = true;
        if (isApiError(err)) {
          if (err.code === "GITHUB_USERNAME_NOT_SET") {
            return;
          } else {
            showToast(
              err.message || "리포지토리 목록을 불러오는데 실패했습니다.",
              "error"
            );
          }
        } else {
          showToast("리포지토리 목록을 불러오는데 실패했습니다.", "error");
        }
      } finally {
        setIsLoadingRepos(false);
        isLoadingRef.current = false;
      }
    };

    loadUserAndRepos();
  }, [user?.githubUsername, setUser, showToast]);

  const validateTitle = (
    value: string
  ): { valid: boolean; message?: string } => {
    if (!value.trim()) {
      return { valid: false, message: "제목을 입력해주세요." };
    }
    if (value.trim().length > 50) {
      return { valid: false, message: "제목은 50자 이하여야 합니다." };
    }
    return { valid: true };
  };

  const validateDescription = (
    value: string
  ): { valid: boolean; message?: string } => {
    if (value.length > 1000) {
      return { valid: false, message: "설명은 1000자 이하여야 합니다." };
    }
    return { valid: true };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTitleMessage(null);
    setDescriptionMessage(null);

    const titleValidation = validateTitle(title);
    if (!titleValidation.valid) {
      setTitleMessage(
        titleValidation.message || "제목 조건을 만족하지 않습니다."
      );
      return;
    }

    const descriptionValidation = validateDescription(description);
    if (!descriptionValidation.valid) {
      setDescriptionMessage(
        descriptionValidation.message || "설명 조건을 만족하지 않습니다."
      );
      return;
    }

    if (targetDate && targetDate < today) {
      showToast("목표일은 오늘 이후 날짜만 선택할 수 있습니다.", "error");
      return;
    }

    if (!repoName) {
      showToast("GitHub 리포지토리를 선택해주세요.", "error");
      return;
    }

    const githubUsername = user?.githubUsername;
    if (!githubUsername) {
      showToast("GitHub Username이 설정되지 않았습니다.", "error");
      return;
    }

    setIsLoading(true);

    try {
      let finalTechStack = techStack.trim();
      if (techStackInput.trim()) {
        addTechToStack(techStackInput);
        finalTechStack = techStack.trim();
      }

      await createProject(
        {
          title: title.trim(),
          description: description.trim() || undefined,
          targetDate: targetDate || undefined,
          techStack: finalTechStack || undefined,
          repoName,
        },
        githubUsername
      );
      showToast("프로젝트가 생성되었습니다.", "success");
      navigate("/projects");
    } catch (err) {
      if (isApiError(err)) {
        showToast(err.message || "프로젝트 생성에 실패했습니다.", "error");
      } else {
        showToast("프로젝트 생성 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const repoOptions = repos.map((repo) => ({
    value: repo.fullName,
    label: repo.fullName,
  }));

  const techStackArray = useMemo(() => {
    if (!techStack.trim()) return [];
    return techStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [techStack]);

  const handleRemoveTech = (indexToRemove: number) => {
    const newArray = techStackArray.filter((_, idx) => idx !== indexToRemove);
    setTechStack(newArray.join(", "));
  };

  const [techStackInput, setTechStackInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const techStackInputRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!techStackInput.trim() || !showSuggestions) return [];
    const inputLower = techStackInput.toLowerCase();
    const currentItems = techStackArray.map((s) => s.toLowerCase());
    return POPULAR_TECH_STACKS.filter(
      (tech) =>
        tech.toLowerCase().includes(inputLower) &&
        !currentItems.includes(tech.toLowerCase())
    ).slice(0, 8);
  }, [techStackInput, techStackArray, showSuggestions]);

  const addTechToStack = (tech: string) => {
    if (!tech.trim()) return;
    const trimmedTech = tech.trim();
    if (
      !techStackArray
        .map((s) => s.toLowerCase())
        .includes(trimmedTech.toLowerCase())
    ) {
      const newArray = [...techStackArray, trimmedTech];
      setTechStack(newArray.join(", "));
    }
    setTechStackInput("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleTechStackInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTechStackInput(value);

    const lastCommaIndex = value.lastIndexOf(",");
    if (lastCommaIndex >= 0) {
      const parts = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const newTechs = parts.slice(0, parts.length - 1);
      newTechs.forEach((tech) => addTechToStack(tech));
      setTechStackInput(parts[parts.length - 1] || "");
    }

    setShowSuggestions(value.trim().length > 0);
    setSelectedIndex(-1);
  };

  const handleSelectSuggestion = (tech: string) => {
    addTechToStack(tech);
  };

  const handleTechStackKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else if (techStackInput.trim()) {
        addTechToStack(techStackInput);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (
      e.key === "Backspace" &&
      !techStackInput &&
      techStackArray.length > 0
    ) {
      handleRemoveTech(techStackArray.length - 1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        techStackInputRef.current &&
        !techStackInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="w-full max-w-3xl">
        <Card className="border-0 p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              + 새 프로젝트
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="title"
                type="text"
                label="제목"
                placeholder="프로젝트 제목을 입력해주세요 (최대 50자)"
                value={title}
                onChange={(e) => {
                  const value = e.target.value;
                  setTitle(value);
                  if (titleMessage) {
                    const validation = validateTitle(value);
                    if (validation.valid) {
                      setTitleMessage(null);
                    } else {
                      setTitleMessage(validation.message || null);
                    }
                  }
                }}
                required
                error={titleMessage ? "" : undefined}
              />
              {titleMessage && (
                <p className="text-accent-dark mt-1.5 text-sm">
                  {titleMessage}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  설명
                </label>
                {descriptionMessage && (
                  <span className="text-accent-dark text-xs">
                    {descriptionMessage}
                  </span>
                )}
              </div>
              <textarea
                id="description"
                rows={4}
                className={`flex w-full rounded-lg border px-3 py-2 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
                  descriptionMessage
                    ? "border-accent focus:border-accent focus:ring-accent"
                    : "focus:border-primary focus:ring-primary border-gray-300 bg-white"
                }`}
                placeholder="프로젝트 설명을 추가할 수 있어요"
                value={description}
                onChange={(e) => {
                  const value = e.target.value;
                  setDescription(value);
                  if (descriptionMessage || value.length > 0) {
                    const validation = validateDescription(value);
                    if (validation.valid) {
                      setDescriptionMessage(null);
                    } else {
                      setDescriptionMessage(validation.message || null);
                    }
                  }
                }}
              />
              <p className="text-xs text-gray-500">{description.length}/1000</p>
            </div>

            <div className="w-full space-y-1.5">
              <label
                htmlFor="targetDate"
                className="block text-sm font-medium text-gray-700"
              >
                목표
              </label>
              <div className="group relative">
                <input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={today}
                  className={cn(
                    "flex h-10 w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm transition-all duration-200",
                    "focus:border-primary focus:ring-primary focus:ring-1 focus:outline-none",
                    "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
                    "date-input-custom",
                    !targetDate
                      ? "text-transparent focus:text-gray-900"
                      : "text-gray-900"
                  )}
                  style={{
                    colorScheme: "light",
                  }}
                />
                {!targetDate && (
                  <span className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 text-sm text-gray-400 group-focus-within:hidden">
                    프로젝트 목표일을 설정해보세요
                  </span>
                )}
              </div>
            </div>

            <div className="w-full space-y-1.5">
              <label
                htmlFor="techStack"
                className="block text-sm font-medium text-gray-700"
              >
                기술 스택
              </label>
              <div className="relative" ref={techStackInputRef}>
                <Input
                  id="techStack"
                  type="text"
                  placeholder="기술 스택을 입력하세요. 쉼표(,) 또는 Enter로 추가됩니다"
                  value={techStackInput}
                  onChange={handleTechStackInputChange}
                  onKeyDown={handleTechStackKeyDown}
                  onFocus={() => {
                    if (techStackInput.trim()) {
                      setShowSuggestions(true);
                    }
                  }}
                  label=""
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
                  >
                    {suggestions.map((tech, idx) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => handleSelectSuggestion(tech)}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm transition-colors",
                          "hover:bg-gray-50",
                          idx === selectedIndex && "bg-primary-50 text-primary"
                        )}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {techStackArray.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {techStackArray.map((tech, idx) => (
                    <Badge
                      key={`${tech}-${idx}`}
                      variant="outline"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(idx)}
                        className="-mr-0.5 ml-0.5 rounded-full p-0.5 transition-colors hover:bg-gray-100"
                        aria-label={`${tech} 제거`}
                      >
                        <X className="h-3 w-3 text-gray-500" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Select
              id="repoName"
              label="프로젝트 리포지토리"
              options={
                isLoadingRepos
                  ? [{ value: "", label: "로딩 중..." }]
                  : repoOptions.length > 0
                    ? [
                        { value: "", label: "GitHub 리포지토리 선택" },
                        ...repoOptions,
                      ]
                    : [
                        {
                          value: "",
                          label: "GitHub 리포지토리를 선택할 수 없습니다",
                        },
                      ]
              }
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              required
              disabled={isLoadingRepos || repoOptions.length === 0}
              helperText={
                isLoadingRepos ? (
                  "리포지토리 목록을 불러오는 중..."
                ) : repoOptions.length === 0 ? (
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                    <span className="text-xs text-gray-500">
                      GitHub Username을 먼저 등록하고 리포지토리를 확인해주세요
                    </span>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/settings");
                      }}
                      className="text-primary hover:text-primary-dark inline-flex shrink-0 cursor-pointer items-center gap-1 text-xs underline"
                    >
                      GitHub Username 등록 바로가기
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ) : undefined
              }
            />

            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/projects")}
                className="w-full sm:flex-1"
              >
                취소
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoadingRepos || repoOptions.length === 0}
                className="w-full sm:flex-1"
              >
                생성
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
