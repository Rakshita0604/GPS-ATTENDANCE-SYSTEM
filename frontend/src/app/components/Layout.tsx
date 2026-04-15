import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  History,
  Users,
  FileText,
  Menu,
  Bell,
  LogOut
} from "lucide-react";
import { cn } from "../utils/cn";
import { Button } from "./UI";
import { motion } from "framer-motion";
import { Toaster } from "sonner";

const NAV_ITEMS = [
  {
    title: "Employee",
    items: [
      { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
      { name: "Mark Attendance", href: "/app/mark-attendance", icon: MapPin },
      { name: "My History", href: "/app/history", icon: History },
    ]
  },
  {
    title: "Admin",
    items: [
      { name: "Overview", href: "/app/admin-dashboard", icon: LayoutDashboard },
      { name: "Employees", href: "/app/employees", icon: Users },
      { name: "Reports", href: "/app/reports", icon: FileText },
    ]
  }
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      <Toaster position="top-right" richColors />

      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <MapPin className="h-5 w-5" />
            </div>
            GeoTrack SaaS
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="grid gap-6 px-4">
            {NAV_ITEMS.map((section) => (
              <div key={section.title}>
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {section.title}
                </h4>

                <div className="grid gap-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4",
                            isActive ? "text-indigo-700" : "text-slate-500"
                          )}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-600 hover:text-red-600"
            asChild
          >
            <Link to="/login">
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-slate-900 md:hidden">
              GeoTrack
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-500">
              <Bell className="h-5 w-5" />
            </Button>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
              JD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}