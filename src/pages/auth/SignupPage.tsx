import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { signup } from "@/lib/api/auth";
import { isApiError } from "@/lib/api/client";

export function SignupPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);

    try {
      await signup({ email, password, nickname });
      navigate("/login", { state: { message: "회원가입이 완료되었습니다. 로그인해주세요." } });
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message || "회원가입에 실패했습니다.");
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Link to="/" className="mb-6 flex flex-col items-center gap-3 transition-opacity hover:opacity-80">
            <span className="text-5xl font-extrabold tracking-[-0.015em] text-gray-900">
              chrono<span className="text-primary text-6xl leading-none">.</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500">
            이메일로 간편하게 시작하세요!
          </p>
        </div>

        <Card className="p-6 sm:p-8 border-gray-100 shadow-lg shadow-zinc-100/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <Input
                id="email"
                type="email"
                label="이메일"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Input
                id="password"
                type="password"
                label="비밀번호"
                placeholder="8자 이상 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <Input
                id="passwordConfirm"
                type="password"
                label="비밀번호 확인"
                placeholder="비밀번호를 다시 입력하세요"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
              <Input
                id="nickname"
                type="text"
                label="닉네임"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                autoComplete="nickname"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base"
              isLoading={isLoading}
            >
              회원가입
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  이미 계정이 있으신가요?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-primary hover:text-primary-dark hover:underline"
              >
                로그인하기
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

