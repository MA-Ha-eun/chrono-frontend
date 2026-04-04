import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, MessagesSquare, UserCog } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useAuthStore } from "@/stores/authStore";
import { getUnreadMessageCount } from "@/lib/api/message";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const isLanding =
    location.pathname === "/" || location.pathname === "/landing";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

  const refreshUnreadCount = useCallback(async () => {
    try {
      const res = await getUnreadMessageCount();
      setUnreadCount(res.count);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    void refreshUnreadCount();
  }, [isAuthenticated, location.pathname, refreshUnreadCount]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const eventSource = new EventSource(
      `${API_BASE_URL}/v1/messages/subscribe`,
      {
        withCredentials: true,
      }
    );

    eventSource.addEventListener("새로운 메시지", () => {
      void refreshUnreadCount();
    });

    eventSource.onerror = () => {
      // 연결 실패(인증 포함) 시 조용히 닫고 라우트 기반 갱신으로 fallback
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [API_BASE_URL, isAuthenticated, refreshUnreadCount]);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/dashboard", label: "대시보드" },
    { path: "/projects", label: "프로젝트" },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    closeMobileMenu();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 shadow-xs backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-3 items-center px-4 md:px-6">
        <Link
          to={isAuthenticated ? "/dashboard" : "/landing"}
          className="flex items-center gap-2"
          onClick={closeMobileMenu}
        >
          <span className="text-2xl font-extrabold tracking-[-0.015em] text-gray-900 md:text-3xl">
            chrono
            <span className="text-primary text-3xl leading-none md:text-4xl">
              .
            </span>
          </span>
        </Link>

        {isLanding ? (
          <div className="col-start-3 flex items-center justify-end gap-3 md:gap-4">
            <Link
              to="/login"
              className="hover:text-primary shrink-0 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors"
            >
              로그인
            </Link>
            <Link to="/signup" className="shrink-0">
              <Button
                size="sm"
                className="px-3 text-sm font-medium whitespace-nowrap md:px-4"
              >
                회원가입
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden items-center justify-center gap-1 md:flex">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "text-primary font-semibold"
                        : "hover:text-primary font-medium text-gray-700"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden items-center justify-end gap-1.5 md:flex">
              <Link
                to="/messages"
                aria-label="메시지"
                className={cn(
                  "hover:text-primary relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition-colors",
                  isActive("/messages") && "text-primary"
                )}
              >
                <MessagesSquare className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="bg-accent absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
              <Link
                to="/settings"
                aria-label="계정"
                className={cn(
                  "hover:text-primary flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition-colors",
                  isActive("/settings") && "text-primary"
                )}
              >
                <UserCog className="h-5 w-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-accent flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-700 transition-colors"
                aria-label="로그아웃"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            <div className="col-start-3 flex items-center justify-end gap-2 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="cursor-pointer rounded-lg p-2 text-gray-700 transition-colors hover:text-gray-900"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {!isLanding && isMobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "text-primary font-semibold"
                      : "hover:text-primary font-medium text-gray-700"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/messages"
              onClick={closeMobileMenu}
              className="hover:text-primary flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors"
            >
              메시지
              {unreadCount > 0 && (
                <span className="bg-accent rounded-full px-2 py-0.5 text-xs font-medium text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
            <Link
              to="/settings"
              onClick={closeMobileMenu}
              className="hover:text-primary block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors"
            >
              계정
            </Link>
            <div className="mt-2 border-t border-gray-100 pt-2">
              <button
                onClick={handleLogout}
                className="hover:text-accent block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors"
                aria-label="로그아웃"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
