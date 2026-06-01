import { ROLLOUT_PHASES, INTEGRATION_POINTS, ROLLOUT_SCALE } from "@/data/corporate";
import { CheckCircle2, Circle, Rocket, QrCode, Layers, Building2, ChevronRight, Users, Store, MapPin } from "lucide-react";

const PURPLE = "#5B21B6";

const IT_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  None:     { bg: "hsl(142 76% 90%)", text: "hsl(142 76% 25%)", label: "No IT Required" },
  Minimal:  { bg: "hsl(38 92% 90%)",  text: "hsl(38 92% 30%)",  label: "Minimal IT"     },
  Standard: { bg: "hsl(262 40% 90%)", text: "hsl(262 80% 30%)", label: "Standard IT"    },
};

const STATUS_STYLE: Record<string, { bg: string; dot: string; text: string; label: string }> = {
  live:    { bg: "hsl(142 76% 90%)", dot: "#009118", text: "hsl(142 76% 25%)", label: "Live"    },
  ready:   { bg: "hsl(211 100% 90%)", dot: "#0079F2", text: "#0055a5",          label: "Ready"   },
  planned: { bg: "hsl(240 5% 90%)",  dot: "#9CA3AF", text: "#6B7280",           label: "Planned" },
};

const PHASE_ICONS = [Rocket, QrCode, Layers, Building2];

export default function Roadmap() {
  return (
    <div className="p-8 max-w-[1300px]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Rocket size={18} style={{ color: "#8B5CF6" }} />
          <h1 className="text-2xl font-bold text-foreground">Integration Roadmap</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          How DiaGe rolls out across Signet stores — from a one-afternoon pilot to 2,800+ locations
        </p>
      </div>

      {/* Callout banner */}
      <div
        className="rounded-xl px-6 py-4 mb-8 flex items-center gap-4"
        style={{ background: "hsl(262 40% 94%)", border: "1px solid hsl(262 40% 82%)" }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: PURPLE }}>
          <Rocket size={18} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-bold" style={{ color: "hsl(262 80% 25%)" }}>
            A pilot store is live in one afternoon. No IT ticket required.
          </div>
          <div className="text-xs mt-0.5" style={{ color: "hsl(262 60% 40%)" }}>
            Phases 1 and 2 require zero engineering from Signet — just an email address and a printer. Full enterprise integration follows on a standard timeline.
          </div>
        </div>
      </div>

      {/* Phase cards with connector */}
      <div className="relative mb-8">
        {/* Connector line */}
        <div
          className="absolute top-[52px] left-[52px] right-[52px] h-0.5 z-0 hidden lg:block"
          style={{ background: "linear-gradient(to right, #009118, #0079F2, #D97706, #5B21B6)" }}
        />

        <div className="grid grid-cols-4 gap-4 relative z-10">
          {ROLLOUT_PHASES.map((p, i) => {
            const Icon = PHASE_ICONS[i]!;
            const it = IT_BADGE[p.itRequired]!;
            return (
              <div key={p.phase} className="bg-card border border-card-border rounded-xl p-5 flex flex-col">
                {/* Phase circle + connector dot */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-sm"
                    style={{ background: p.color }}
                  >
                    {p.phase}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{p.timeline}</div>
                    <div className="font-bold text-sm text-foreground">{p.name}</div>
                  </div>
                </div>

                {/* IT badge */}
                <div className="mb-3">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: it.bg, color: it.text }}>
                    {it.label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{p.description}</p>

                {/* Steps */}
                <ul className="flex flex-col gap-1.5 mb-4">
                  {p.steps.map((step) => (
                    <li key={step} className="flex items-start gap-1.5">
                      <CheckCircle2 size={12} style={{ color: p.color, flexShrink: 0, marginTop: 2 }} />
                      <span className="text-xs text-foreground leading-snug">{step}</span>
                    </li>
                  ))}
                </ul>

                {/* Signet action */}
                <div className="rounded-lg px-3 py-2 mt-auto" style={{ background: p.lightBg }}>
                  <div className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: p.textColor, opacity: 0.7 }}>
                    Signet provides
                  </div>
                  <div className="text-xs font-medium" style={{ color: p.textColor }}>{p.signetAction}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scale progression */}
      <div className="bg-card border border-card-border rounded-xl p-6 mb-6">
        <div className="font-semibold text-sm text-foreground mb-1">Network Scale Over Time</div>
        <div className="text-xs text-muted-foreground mb-6">From 5 pilot stores to the full Signet US network</div>

        <div className="grid grid-cols-3 gap-0 relative">
          {/* Progress bar backdrop */}
          <div className="absolute top-[26px] left-[calc(16.66%)] right-[calc(16.66%)] h-1 bg-gray-200 rounded-full z-0" />
          <div
            className="absolute top-[26px] left-[calc(16.66%)] h-1 rounded-full z-0"
            style={{ width: "66.66%", background: `linear-gradient(to right, ${PURPLE}, #A78BFA)` }}
          />

          {ROLLOUT_SCALE.map((s, i) => {
            const colors = ["#009118", "#0079F2", PURPLE];
            const lightBgs = ["hsl(142 76% 94%)", "hsl(211 100% 94%)", "hsl(262 40% 94%)"];
            const textColors = ["hsl(142 76% 25%)", "#0055a5", "hsl(262 80% 30%)"];
            return (
              <div key={s.milestone} className="flex flex-col items-center text-center px-4 relative z-10">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mb-3 shadow"
                  style={{ background: colors[i] }}
                >
                  {i + 1}
                </div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">{s.timeframe}</div>
                <div className="text-2xl font-black mb-0.5" style={{ color: colors[i] }}>
                  {s.stores.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mb-3">stores</div>

                <div className="w-full rounded-xl p-3 grid grid-cols-3 gap-2" style={{ background: lightBgs[i] }}>
                  {[
                    { icon: Store,  label: "Stores",     value: s.stores.toLocaleString() },
                    { icon: Users,  label: "Associates", value: s.associates.toLocaleString() },
                    { icon: MapPin, label: "Banners",    value: s.banners },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label}>
                      <div className="text-lg font-black" style={{ color: colors[i] }}>{value}</div>
                      <div className="text-[10px]" style={{ color: textColors[i], opacity: 0.75 }}>{label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-xs font-semibold" style={{ color: colors[i] }}>{s.milestone}</div>
                {s.pct < 100 && (
                  <div className="text-[10px] text-muted-foreground">{s.pct}% of network</div>
                )}
                {s.pct === 100 && (
                  <div className="text-[10px] font-semibold" style={{ color: colors[i] }}>Full network</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Integration points table */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <div className="font-semibold text-sm text-foreground mb-1">Integration Points</div>
        <div className="text-xs text-muted-foreground mb-4">Every touchpoint between DiaGe and Signet's tech stack</div>

        <div className="flex flex-col gap-0 divide-y divide-border">
          {/* Header */}
          <div className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr] gap-4 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
            <div>Integration</div>
            <div>Type</div>
            <div>Description</div>
            <div className="text-center">Phase</div>
            <div className="text-center">Status</div>
          </div>

          {INTEGRATION_POINTS.map((pt) => {
            const phaseColors = ["#009118", "#0079F2", "#D97706", PURPLE];
            const st = STATUS_STYLE[pt.status]!;
            return (
              <div key={pt.name} className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr] gap-4 py-3 items-center">
                <div className="text-sm font-semibold text-foreground">{pt.name}</div>
                <div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">{pt.type}</span>
                </div>
                <div className="text-xs text-muted-foreground">{pt.description}</div>
                <div className="flex justify-center">
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                    style={{ background: phaseColors[pt.phase - 1] }}
                  >
                    Phase {pt.phase}
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.text }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: st.dot }} />
                    {st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-border grid grid-cols-3 gap-4">
          {[
            { color: "#009118", label: "Phases 1–2", sub: "Zero IT from Signet. Partner Portal + QR signage. Live on day one.", icon: CheckCircle2 },
            { color: "#D97706", label: "Phase 3",    sub: "One-time catalog feed setup. DiaGe handles all ongoing syncs.", icon: ChevronRight },
            { color: PURPLE,    label: "Phase 4",    sub: "Standard enterprise integration. Follows a proven SaaS playbook.", icon: Circle },
          ].map(({ color, label, sub, icon: Icon }) => (
            <div key={label} className="flex items-start gap-2.5">
              <Icon size={14} style={{ color, flexShrink: 0, marginTop: 2 }} />
              <div>
                <div className="text-xs font-bold" style={{ color }}>{label}</div>
                <div className="text-xs text-muted-foreground leading-snug mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
