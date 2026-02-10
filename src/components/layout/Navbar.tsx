import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut } from "lucide-react";
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

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    let mounted = true;
    getUnreadMessageCount()
      .then((res) => mounted && setUnreadCount(res.count))
      .catch(() => mounted && setUnreadCount(0));
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, location.pathname]);

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

            <div className="hidden items-center justify-end gap-1 md:flex">
              <Link
                to="/messages"
                className={cn(
                  "hover:text-primary relative rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors",
                  isActive("/messages") && "text-primary font-semibold",
                  unreadCount > 0 && "pr-5"
                )}
              >
                쪽지
                {unreadCount > 0 && (
                  <span className="bg-accent absolute -top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
              <Link
                to="/settings"
                className={cn(
                  "hover:text-primary rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors",
                  isActive("/settings") && "text-primary font-semibold"
                )}
              >
                계정
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-accent cursor-pointer rounded-lg py-2 pr-0 pl-3 text-gray-700 transition-colors"
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
            <div className="mt-2 border-t border-gray-100 pt-2">
              <Link
                to="/messages"
                onClick={closeMobileMenu}
                className="hover:text-primary flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors"
              >
                쪽지
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
              <button
                onClick={handleLogout}
                className="hover:text-accent flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-gray-700 transition-colors"
                aria-label="로그아웃"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
