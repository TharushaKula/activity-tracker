"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, BarChart3, Home, Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/daily", label: "Daily", icon: Calendar },
  { href: "/dashboard/weekly", label: "Weekly", icon: TrendingUp },
  { href: "/dashboard/monthly", label: "Monthly", icon: BarChart3 },
  { href: "/dashboard/search", label: "Search", icon: Search },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-12">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#0D7AB8] flex items-center justify-center group-hover:bg-[#0a6a9f] transition-colors">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-semibold text-gray-900 tracking-tight">
                Activity<span className="text-[#0D7AB8]">Tracker</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#0D7AB8] text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#0D7AB8]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            
            {/* Mobile Navigation */}
            <div className="lg:hidden flex items-center gap-2">
              <select
                value={pathname || "/dashboard"}
                onChange={(e) => window.location.href = e.target.value}
                className="px-3 py-2 rounded-lg border-2 border-gray-300 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0D7AB8] focus:border-[#0D7AB8]"
              >
                {navItems.map((item) => (
                  <option key={item.href} value={item.href}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User Button */}
          <div className="flex items-center">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-lg border border-gray-200",
                },
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

