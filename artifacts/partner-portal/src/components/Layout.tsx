import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, TrendingUp, Gem, Menu, X, Bell } from "lucide-react";
import { RETAILER_NAME } from "@/data/demo";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Wishlist Leads", icon: Users },
  { href: "/trends", label: "Trends & Insights", icon: TrendingUp },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F7FF]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1E0B4B] flex flex-col transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}
      >
        <div className="px-6 py-5 border-b border-[#3B1E8E]">
          <div className="flex items-center gap-2 mb-1">
            <Gem size={20} className="text-[#A78BFA]" />
            <span className="text-white font-bold text-lg tracking-tight">DiaGe</span>
            <span className="text-[#A78BFA] text-xs font-semibold ml-1 px-1.5 py-0.5 bg-[#3B1E8E] rounded">Partner</span>
          </div>
          <p className="text-[#C4B5FD] text-xs truncate">{RETAILER_NAME}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link key={href} href={href}>
                <div
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors
                    ${active
                      ? "bg-[#5B21B6] text-white"
                      : "text-[#C4B5FD] hover:bg-[#3B1E8E] hover:text-white"
                    }`}
                >
                  <Icon size={17} />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-[#3B1E8E]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#5B21B6] flex items-center justify-center text-white text-xs font-bold">
              KJ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Kay Jewelers</p>
              <p className="text-[#A78BFA] text-xs truncate">Enterprise Partner</p>
            </div>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-[#E5E2F0] px-6 py-3 flex items-center gap-4">
          <button
            className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#F3F0FF] px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live · May 25, 2026
          </div>
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#5B21B6] rounded-full" />
          </button>
        </header>

        <main className="flex-1 px-6 py-6 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
