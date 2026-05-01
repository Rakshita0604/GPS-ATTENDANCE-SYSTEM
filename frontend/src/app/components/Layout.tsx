import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, FileText, History, LayoutDashboard, LogOut, MapPin, Menu, Users } from "lucide-react";
import { Toaster } from "sonner";
import { Button } from "./UI";
import { cn } from "../utils/cn";
import { getCurrentUser, logoutUser } from "../services/authService";

const employeeNav = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Mark Attendance", href: "/app/mark-attendance", icon: MapPin },
  { name: "My History", href: "/app/history", icon: History },
];

const adminNav = [
  { name: "Overview", href: "/app/admin-dashboard", icon: LayoutDashboard },
  { name: "Employees", href: "/app/employees", icon: Users },
  { name: "Reports", href: "/app/reports", icon: FileText },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const navItems = user?.role === "admin" ? adminNav : employeeNav;
  const initials = (user?.name || "User")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <Toaster position="top-right" richColors />

      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <MapPin className="h-5 w-5" />
            </div>
            GeoTrack
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-600 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-sm font-semibold text-slate-900 md:text-lg">
                {user?.role === "admin" ? "Admin Portal" : "Employee Portal"}
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-500">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-700">
              {initials}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
