import { Link, useLocation } from "wouter";
import { LayoutDashboard, Building2, MapPin, Lock, TrendingUp } from "lucide-react";

const NAV = [
  { href: "/", label: "Platform Overview", icon: LayoutDashboard },
  { href: "/metrics", label: "Traffic & Conversion", icon: TrendingUp },
  { href: "/retailers", label: "Retailer Performance", icon: Building2 },
  { href: "/geography", label: "SKU Geography", icon: MapPin },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        style={{ backgroundColor: "hsl(var(--sidebar))", borderRight: "1px solid hsl(var(--sidebar-border))" }}
        className="w-56 flex-shrink-0 flex flex-col"
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "hsl(var(--sidebar-primary))" }}>
              D
            </div>
            <span className="font-semibold text-sm" style={{ color: "hsl(var(--sidebar-foreground))" }}>
              DiaGe
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded font-medium ml-auto"
              style={{ background: "hsl(var(--sidebar-accent))", color: "hsl(var(--sidebar-accent-foreground))" }}>
              Corp
            </span>
          </div>
          <div className="text-xs mt-1.5 font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
            Prepared for Signet Jewelers
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            <Lock size={10} style={{ color: "hsl(var(--sidebar-primary))" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Confidential · Internal Only
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link key={href} href={href}>
                <div
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors"
                  style={{
                    backgroundColor: active ? "hsl(var(--sidebar-accent))" : "transparent",
                    color: active ? "hsl(var(--sidebar-foreground))" : "rgba(255,255,255,0.55)",
                  }}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t text-xs" style={{ borderColor: "hsl(var(--sidebar-border))", color: "rgba(255,255,255,0.3)" }}>
          DiaGe Inc. · May 2026
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
