import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/logo.svg";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";

export function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: API 연동
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center text-center">
          <Link to="/" className="mb-6 flex flex-col items-center gap-3 transition-opacity hover:opacity-80">
            <span className="text-5xl font-extrabold tracking-[-0.015em] text-gray-900">
              chrono<span className="text-primary text-6xl leading-none">.</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500">
            돌아오신 것을 환영합니다 👋
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 sm:p-8 border-gray-100 shadow-lg shadow-gray-100/50">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    비밀번호
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-primary hover:text-primary-dark"
                  >
                    비밀번호 찾기
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base"
              isLoading={isLoading}
            >
              로그인
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  아직 계정이 없으신가요?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/signup"
                className="text-sm font-medium text-primary hover:text-primary-dark hover:underline"
              >
                회원가입하고 시작하기
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
