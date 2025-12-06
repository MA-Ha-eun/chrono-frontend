import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

export function PasswordSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword.length < 6) {
      setError("새 비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: API 연동 예정
      console.log("비밀번호 변경 요청 - 추후 API 구현 예정");
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSuccess("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("비밀번호 변경에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        id="currentPassword"
        type="password"
        label="현재 비밀번호"
        placeholder="현재 비밀번호 입력"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">새 비밀번호</label>
        <div className="space-y-3">
          <input
            id="newPassword"
            type="password"
            placeholder="새 비밀번호 입력 (6자 이상)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
          />
          <input
            id="confirmPassword"
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="-mt-2 w-full md:w-auto">
        비밀번호 변경
      </Button>
    </form>
  );
}

