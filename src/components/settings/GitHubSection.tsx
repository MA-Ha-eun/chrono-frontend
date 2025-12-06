import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { updateGithubUsername } from "@/lib/api/user";
import { isApiError } from "@/lib/api/client";
import { Github } from "lucide-react";

interface GitHubSectionProps {
  initialUsername: string;
  onUpdate: (username: string) => void;
}

export function GitHubSection({ initialUsername, onUpdate }: GitHubSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState(initialUsername);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!githubUsername.trim()) {
      setError("GitHub username을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const updated = await updateGithubUsername({ githubUsername: githubUsername.trim() });
      onUpdate(updated.githubUsername);
      setSuccess("GitHub username이 업데이트되었습니다.");
    } catch (err) {
      if (isApiError(err)) {
        if (err.code === "GITHUB_USER_NOT_FOUND") {
          setError("해당 GitHub 사용자를 찾을 수 없습니다. 올바른 username을 입력해주세요.");
        } else {
          setError(err.message || "GitHub username 업데이트에 실패했습니다.");
        }
      } else {
        setError("GitHub username 업데이트 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-5">
        <Github className="h-10 w-10 text-gray-900" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">GitHub 연동</h2>
          <p className="text-sm text-gray-500">
            GitHub username을 설정하여 리포지토리를 연동하세요.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            {success}
          </div>
        )}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          id="githubUsername"
          type="text"
          label="GitHub Username"
          placeholder="예: octocat"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          required
          helperText="프로젝트 생성을 위해 반드시 설정해야 합니다."
        />

        <Button type="submit" isLoading={isLoading} className="-mt-2 w-full md:w-auto">
          GitHub 연동 저장
        </Button>
      </form>
    </Card>
  );
}

