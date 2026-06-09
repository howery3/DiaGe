import type { ReactNode, CSSProperties } from "react";

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "19vw",
        aspectRatio: "9/19",
        background: "#1A1A1A",
        borderRadius: "2.8vw",
        padding: "0.5vw",
        boxShadow: "0 8px 32px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}
    >
      {/* Dynamic island */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "0.5vw", paddingBottom: "0.3vw" }}>
        <div style={{ width: "4vw", height: "0.6vw", background: "#111", borderRadius: "1vw" }} />
      </div>
      {/* Screen */}
      <div
        style={{
          background: "#F8F7FF",
          borderRadius: "2.2vw",
          overflow: "hidden",
          height: "calc(100% - 1.4vw)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ScreenHeader({ title, count }: { title: string; count: string }) {
  return (
    <div style={{ background: "#5B21B6", padding: "1vw 1.2vw 0.9vw", flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 700, letterSpacing: "-0.02em" }}>{title}</span>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75vw" }}>{count}</span>
      </div>
    </div>
  );
}

function PieceRow({ name, sub, brand, last }: { name: string; sub: string; brand: string; last?: boolean }) {
  return (
    <div style={{
      padding: "0.7vw 1vw",
      borderBottom: last ? "none" : "1px solid #EDE9F8",
      display: "flex",
      alignItems: "center",
      gap: "0.7vw",
    }}>
      <div style={{ width: "2vw", height: "2vw", borderRadius: "0.5vw", background: "#EDE9F8", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "0.9vw", height: "0.9vw", borderRadius: "50%", background: "#8B5CF6" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#111827", fontSize: "0.75vw", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
        <div style={{ color: "#6B7280", fontSize: "0.6vw", marginTop: "0.1vw", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
        <div style={{ color: "#8B5CF6", fontSize: "0.55vw", marginTop: "0.1vw", fontWeight: 500 }}>{brand}</div>
      </div>
      <div style={{ color: "#D1C4E9", fontSize: "0.7vw" }}>›</div>
    </div>
  );
}

const PRIORITY_COLOR: Record<string, string> = { HIGH: "#5B21B6", MED: "#D97706", LOW: "#059669" };
const PRIORITY_BG: Record<string, string> = { HIGH: "#EDE9F8", MED: "#FEF3C7", LOW: "#D1FAE5" };

function WishRow({ name, retailer, price, priority, last }: { name: string; retailer: string; price: string; priority: string; last?: boolean }) {
  return (
    <div style={{ padding: "0.7vw 1vw", borderBottom: last ? "none" : "1px solid #EDE9F8", display: "flex", alignItems: "center", gap: "0.6vw" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#111827", fontSize: "0.75vw", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
        <div style={{ color: "#6B7280", fontSize: "0.6vw", marginTop: "0.1vw" }}>{retailer} · {price}</div>
      </div>
      <div style={{
        background: PRIORITY_BG[priority], color: PRIORITY_COLOR[priority],
        fontSize: "0.5vw", fontWeight: 700, padding: "0.15vw 0.4vw", borderRadius: "99px", flexShrink: 0, letterSpacing: "0.05em"
      }}>{priority}</div>
    </div>
  );
}

function ReminderRow({ name, sub, days, last }: { name: string; sub: string; days: string; last?: boolean }) {
  const urgent = parseInt(days) <= 30;
  return (
    <div style={{ padding: "0.7vw 1vw", borderBottom: last ? "none" : "1px solid #EDE9F8", display: "flex", alignItems: "center", gap: "0.6vw" }}>
      <div style={{
        width: "2vw", height: "2vw", borderRadius: "0.5vw",
        background: urgent ? "#FEF3C7" : "#EDE9F8",
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{ width: "0.7vw", height: "0.7vw", borderRadius: "2px", background: urgent ? "#D97706" : "#8B5CF6" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#111827", fontSize: "0.72vw", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
        <div style={{ color: "#6B7280", fontSize: "0.58vw", marginTop: "0.1vw" }}>{sub}</div>
      </div>
      <div style={{ color: urgent ? "#D97706" : "#8B5CF6", fontSize: "0.6vw", fontWeight: 700, flexShrink: 0 }}>{days}d</div>
    </div>
  );
}

export default function S10AppScreenshots() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <p className="text-[1.2vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6]">
          The live app
        </p>
        <h1
          className="mt-[1vh] text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" } as CSSProperties}
        >
          Real screens. Real customers. In market today.
        </h1>

        {/* Phone mockups */}
        <div className="mt-[3.5vh] flex gap-[3vw] items-end justify-center flex-1">

          {/* Screen 1 — Collection */}
          <div className="flex flex-col items-center gap-[1.5vh]">
            <PhoneFrame>
              <ScreenHeader title="My Vault" count="8 pieces" />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <PieceRow name="Tiffany Setting Ring" sub="Platinum · 1.52ct E VS1" brand="Tiffany & Co." />
                <PieceRow name="Submariner Date" sub="Oystersteel · Cal. 3235" brand="Rolex" />
                <PieceRow name="Love Bracelet" sub="18K Yellow Gold · Size 17" brand="Cartier" />
                <PieceRow name="Diamond Tennis Bracelet" sub="18K White Gold · 10.00ct" brand="Kay Jewelers" />
                <PieceRow name="Akoya Pearl Strand" sub="18K White Gold · 18in" brand="Mikimoto" last />
              </div>
              <div style={{ padding: "0.6vw 1vw", background: "#F3F0FF", borderTop: "1px solid #EDE9F8", textAlign: "center" }}>
                <span style={{ color: "#5B21B6", fontSize: "0.65vw", fontWeight: 600 }}>+ Add piece</span>
              </div>
            </PhoneFrame>
            <div className="text-center">
              <p className="text-[1.2vw] font-bold text-[#111827]">Jewelry Vault</p>
              <p className="text-[0.95vw] text-[#6B7280] mt-[0.3vh]">Every piece, warranty, and serial in one place</p>
            </div>
          </div>

          {/* Screen 2 — Wishlist */}
          <div className="flex flex-col items-center gap-[1.5vh]">
            <PhoneFrame>
              <ScreenHeader title="Wishlist" count="4 saved" />
              <div style={{ padding: "0.6vw 1vw", background: "#5B21B610", borderBottom: "1px solid #EDE9F8" }}>
                <span style={{ color: "#5B21B6", fontSize: "0.62vw", fontWeight: 600 }}>Saved from retailer websites</span>
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <WishRow name="Open Heart Diamond Pendant" retailer="Kay Jewelers" price="$1,850" priority="HIGH" />
                <WishRow name="Pavé Diamond Hoops" retailer="Blue Nile" price="$2,100" priority="HIGH" />
                <WishRow name="Diamond Tennis Necklace" retailer="Zales" price="$6,400" priority="MED" />
                <WishRow name="Pearl Drop Earrings" retailer="Mikimoto" price="$3,200" priority="LOW" last />
              </div>
              <div style={{ padding: "0.6vw 1vw", background: "#F3F0FF", borderTop: "1px solid #EDE9F8", textAlign: "center" }}>
                <span style={{ color: "#5B21B6", fontSize: "0.65vw", fontWeight: 600 }}>Send wishlist to my store</span>
              </div>
            </PhoneFrame>
            <div className="text-center">
              <p className="text-[1.2vw] font-bold text-[#111827]">Wishlist</p>
              <p className="text-[0.95vw] text-[#6B7280] mt-[0.3vh]">Saved intent your associates can act on</p>
            </div>
          </div>

          {/* Screen 3 — Reminders */}
          <div className="flex flex-col items-center gap-[1.5vh]">
            <PhoneFrame>
              <ScreenHeader title="Reminders" count="4 upcoming" />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <ReminderRow name="Tiffany Ring Inspection" sub="Annual prong check · Tiffany & Co." days="14" />
                <ReminderRow name="Cartier Love Warranty" sub="Warranty renewal · Cartier" days="30" />
                <ReminderRow name="Rolex Full Service" sub="Movement service · Auth. Dealer" days="45" />
                <ReminderRow name="Kay Tennis Bracelet" sub="Prong & clasp check · Kay Jewelers" days="72" last />
              </div>
              <div style={{ padding: "0.6vw 1vw", background: "#FEF9C3", borderTop: "1px solid #FDE68A", textAlign: "center" }}>
                <span style={{ color: "#92400E", fontSize: "0.62vw", fontWeight: 600 }}>2 reminders due within 30 days</span>
              </div>
            </PhoneFrame>
            <div className="text-center">
              <p className="text-[1.2vw] font-bold text-[#111827]">Reminders</p>
              <p className="text-[0.95vw] text-[#6B7280] mt-[0.3vh]">Inspection alerts before Diamond Bond windows lapse</p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-[3vh] left-[8vw] right-[8vw] flex justify-between items-center">
        <p className="text-[1.1vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
        <p className="text-[1.3vw] text-[#9CA3AF]">10 / 17</p>
      </div>
    </div>
  );
}
