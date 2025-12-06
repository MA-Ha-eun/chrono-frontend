import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { useAuthStore } from "@/stores/authStore";
import { getMe, updateGithubUsername, updateProfile } from "@/lib/api/user";
import { isApiError } from "@/lib/api/client";
import { Github, User, AlertTriangle } from "lucide-react";

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [githubSuccess, setGithubSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [nickname, setNickname] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      setNickname(userData.nickname || "");
      setGithubUsername(userData.githubUsername || "");
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    };

    if (!user) {
      loadUser();
    } else {
      setNickname(user.nickname || "");
      setGithubUsername(user.githubUsername || "");
    }
  }, [user, setUser]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!nickname.trim()) {
      setProfileError("닉네임을 입력해주세요.");
      return;
    }

    setIsLoadingProfile(true);

    try {
      const updated = await updateProfile({
        nickname: nickname.trim(),
      });
      setUser({ ...user!, nickname: updated.nickname });
      setProfileSuccess("닉네임이 업데이트되었습니다.");
    } catch (err) {
      if (isApiError(err)) {
        setProfileError(err.message || "프로필 업데이트에 실패했습니다.");
      } else {
        setProfileError("프로필 업데이트 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleGithubUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGithubError(null);
    setGithubSuccess(null);

    if (!githubUsername.trim()) {
      setGithubError("GitHub username을 입력해주세요.");
      return;
    }

    setIsLoadingGithub(true);

    try {
      const updated = await updateGithubUsername({ githubUsername: githubUsername.trim() });
      setUser({ ...user!, githubUsername: updated.githubUsername });
      setGithubSuccess("GitHub username이 업데이트되었습니다.");
    } catch (err) {
      if (isApiError(err)) {
        if (err.code === "GITHUB_USER_NOT_FOUND") {
          setGithubError("해당 GitHub 사용자를 찾을 수 없습니다. 올바른 username을 입력해주세요.");
        } else {
          setGithubError(err.message || "GitHub username 업데이트에 실패했습니다.");
        }
      } else {
        setGithubError("GitHub username 업데이트 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoadingGithub(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("새 비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoadingPassword(true);

    try {
      // TODO: API 연동 예정
      console.log("비밀번호 변경 요청 - 추후 API 구현 예정");
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPasswordSuccess("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError("비밀번호 변경에 실패했습니다.");
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    // TODO: 회원탈퇴 확인 모달 표시
    console.log("회원탈퇴 버튼 클릭 - 추후 모달 구현 예정");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">설정</h1>
        <p className="mt-1 text-sm text-gray-500">계정 정보와 GitHub 연동을 관리하세요.</p>
      </div>

      {/* 그리드 레이아웃: 내 정보 관리 + GitHub 연동 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 내 정보 관리 (프로필 + 비밀번호) */}
        <Card className="border-0 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-5">
            <User className="h-10 w-10 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">내 정보 관리</h2>
              <p className="text-sm text-gray-500">이메일, 비밀번호, 닉네임을 관리합니다.</p>
            </div>
          </div>

          {/* 프로필 및 비밀번호 */}
          <div className="space-y-5">
            {profileSuccess && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {profileError}
              </div>
            )}
            {passwordSuccess && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {passwordError}
              </div>
            )}

            {/* 이메일 */}
            <Input
              id="email"
              type="email"
              label="이메일"
              value={user?.email || ""}
              disabled
              helperText="이메일은 변경할 수 없습니다."
            />

            {/* 비밀번호 변경 */}
            <form onSubmit={handlePasswordUpdate} className="space-y-5">
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

              <Button type="submit" isLoading={isLoadingPassword} className="-mt-2 w-full md:w-auto">
                비밀번호 변경
              </Button>
            </form>

            {/* 닉네임 */}
            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <Input
                id="nickname"
                type="text"
                label="닉네임"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />

              <Button type="submit" isLoading={isLoadingProfile} className="-mt-2 w-full md:w-auto">
                닉네임 저장
              </Button>
            </form>
          </div>
        </Card>

        {/* GitHub 연동 */}
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

          <form onSubmit={handleGithubUpdate} className="space-y-5">
          {githubSuccess && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
              {githubSuccess}
            </div>
          )}
          {githubError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {githubError}
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

            <Button type="submit" isLoading={isLoadingGithub} className="-mt-2 w-full md:w-auto">
              GitHub 연동 저장
            </Button>
          </form>
        </Card>
      </div>

      {/* 회원 탈퇴 */}
      <Card className="border-0 p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">회원 탈퇴</h2>

        <div className="flex items-center justify-between gap-4">
          <p className="flex items-start gap-1 text-sm text-accent-dark">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent-dark" />
            <span><strong>주의:</strong> 회원 탈퇴 후에는 프로젝트 기록 및 데이터를 복구할 수 없습니다. 그래도 탈퇴하시겠습니까?</span>
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteAccount}
            className="shrink-0 border-accent-dark text-accent-dark"
          >
            탈퇴하기
          </Button>
        </div>
      </Card>
    </div>
  );
}

