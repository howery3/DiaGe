import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, TrendingUp, Gem, Menu, X, Bell, Contact, Send, Calendar, Star, AlertCircle, CheckCircle } from "lucide-react";
import { useStore, BANNERS } from "@/context/StoreContext";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Wishlist Leads", icon: Users },
  { href: "/appointments", label: "Visit Requests", icon: Calendar },
  { href: "/customers", label: "DiaGe Opt-Ins", icon: Contact },
  { href: "/trends", label: "Trends & Insights", icon: TrendingUp },
];

interface Notif {
  id: string;
  type: "lead" | "appointment" | "alert" | "summary";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const DEMO_NOTIFS: Notif[] = [
  {
    id: "n1",
    type: "lead",
    title: "New wishlist shared — 0.4 mi away",
    body: "Sarah M. sent her wishlist directly to your store. 4 items: oval halo engagement ring, tennis bracelet, diamond studs (+1). Est. value $3,800. Ring size 6.5.",
    time: "3 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "appointment",
    title: "Appointment request received",
    body: "James K. is requesting an inspection appointment for his engagement ring (purchased here Mar 2024). His Kay warranty expires in 6 weeks — time-sensitive.",
    time: "21 min ago",
    read: false,
  },
  {
    id: "n3",
    type: "lead",
    title: "New wishlist in your area — 1.2 mi",
    body: "Priya L. saved a 2ct lab-diamond solitaire and a yellow-gold bangle on DiaGe. She hasn't linked a store yet — first associate to reach out wins the lead.",
    time: "47 min ago",
    read: false,
  },
  {
    id: "n4",
    type: "alert",
    title: "Wishlist updated — returning customer",
    body: "Emily R. (purchased 3× at this location) updated her wishlist and added an anniversary band, est. $2,200. She has 2 overdue inspection reminders — great outreach moment.",
    time: "2 hrs ago",
    read: false,
  },
  {
    id: "n5",
    type: "appointment",
    title: "Appointment request — ring resizing",
    body: "Marcus T. wants to book a resizing consultation for an heirloom ring. He mentioned a budget of $4K+ for a possible reset while it's in-store.",
    time: "4 hrs ago",
    read: false,
  },
  {
    id: "n6",
    type: "summary",
    title: "Today's DiaGe activity summary",
    body: "5 new wishlist leads within 5 miles, 2 appointment requests, $14,600 in combined wishlist value shared with your store today.",
    time: "8 hrs ago",
    read: true,
  },
  {
    id: "n7",
    type: "lead",
    title: "High-value wishlist — 2.1 mi away",
    body: "Anonymous DiaGe user (not yet linked) has a wishlist totalling $11,400 — including a 3ct cushion-cut diamond ring. Upgrade prompt sent automatically.",
    time: "Yesterday",
    read: true,
  },
];

const NOTIF_ICON: Record<Notif["type"], React.ReactNode> = {
  lead:        <Send size={13} className="text-[#5B21B6]" />,
  appointment: <Calendar size={13} className="text-[#0079F2]" />,
  alert:       <AlertCircle size={13} className="text-[#D97706]" />,
  summary:     <Star size={13} className="text-green-600" />,
};

const NOTIF_BG: Record<Notif["type"], string> = {
  lead:        "bg-[#F3F0FF]",
  appointment: "bg-blue-50",
  alert:       "bg-amber-50",
  summary:     "bg-green-50",
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { current, setCurrent } = useStore();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>(DEMO_NOTIFS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  function toggleNotif() {
    setNotifOpen((v) => !v);
  }

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

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
          <p className="text-[#C4B5FD] text-xs truncate">{current.banner}</p>
          <p className="text-[#7C5CBF] text-[10px] mt-0.5">A {current.parentCompany} Banner</p>
        </div>

        {/* Banner switcher */}
        <div className="px-4 py-3 border-b border-[#3B1E8E]">
          <p className="text-[#7C5CBF] text-[9px] uppercase tracking-widest mb-2 font-semibold">Switch Banner</p>
          <div className="grid grid-cols-2 gap-1.5">
            {BANNERS.map((b) => (
              <button
                key={b.storeId}
                onClick={() => setCurrent(b)}
                style={current.storeId === b.storeId ? { borderColor: b.color } : {}}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-left transition-all ${
                  current.storeId === b.storeId
                    ? "bg-[#3B1E8E] border-opacity-100"
                    : "border-transparent hover:bg-[#2D1175]"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0"
                  style={{ backgroundColor: b.color }}
                >
                  {b.initial}
                </span>
                <span className="text-[10px] font-medium text-[#C4B5FD] truncate">
                  {b.banner.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
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
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: current.color }}
            >
              {current.initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{current.banner}</p>
              <p className="text-[#A78BFA] text-xs truncate">{current.parentCompany} · Enterprise</p>
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
            Live · June 9, 2026
          </div>

          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={toggleNotif}
              className={`relative p-2 rounded-lg transition-colors ${notifOpen ? "bg-[#EDE9FE] text-[#5B21B6]" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-[#5B21B6] rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold leading-none px-0.5">{unreadCount}</span>
                </span>
              )}
            </button>

            {/* Dropdown panel */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-2xl shadow-xl border border-[#E5E2F0] overflow-hidden z-50">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0EEF8]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs font-bold bg-[#5B21B6] text-white px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-[#5B21B6] font-semibold hover:underline flex items-center gap-1"
                    >
                      <CheckCircle size={12} />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-[420px] overflow-y-auto divide-y divide-[#F5F3FF]">
                  {notifs.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-[#FAFAFA] ${n.read ? "opacity-60" : ""}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${NOTIF_BG[n.type]}`}>
                        {NOTIF_ICON[n.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className={`text-sm font-semibold text-gray-900 truncate ${!n.read ? "text-[#3B0764]" : ""}`}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-[#5B21B6] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{n.body}</p>
                        <p className="text-[11px] text-gray-400 mt-1 font-medium">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-[#F0EEF8] bg-[#FAFAFA]">
                  <p className="text-xs text-center text-gray-400">Showing last 7 days · Synced with DiaGe app</p>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-6 py-6 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
