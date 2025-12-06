import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { updateProfile } from "@/lib/api/user";
import { isApiError } from "@/lib/api/client";
import { User as UserType } from "@/types/api";

interface ProfileSectionProps {
  user: UserType | null;
  onUpdate: (nickname: string) => void;
}

export function ProfileSection({ user, onUpdate }: ProfileSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [nickname, setNickname] = useState(user?.nickname || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await updateProfile({ nickname: nickname.trim() });
      onUpdate(nickname.trim());
      setSuccess("닉네임이 업데이트되었습니다.");
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message || "닉네임 업데이트에 실패했습니다.");
      } else {
        setError("닉네임 업데이트 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
        id="email"
        type="email"
        label="이메일"
        value={user?.email || ""}
        disabled
        helperText="이메일은 변경할 수 없습니다."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="nickname"
          type="text"
          label="닉네임"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading} className="-mt-2 w-full md:w-auto">
          닉네임 저장
        </Button>
      </form>
    </>
  );
}

