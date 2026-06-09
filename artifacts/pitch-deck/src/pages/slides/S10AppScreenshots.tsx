import type { CSSProperties, ReactNode } from "react";

/* ─── shared tokens ────────────────────────────────────────────────── */
const P = "#5B21B6";   // primary purple
const P8 = "#5B21B610";
const P15 = "#5B21B626";
const BORDER = "#E5E7EB";
const MUTED = "#6B7280";
const FG = "#111827";
const CARD_BG = "#FFFFFF";
const SCREEN_BG = "#F8F8FB";
const GOLD = "#D4AA3A";
const RED = "#DC2626";
const AMBER = "#B45309";
const GREEN = "#15803D";

/* ─── phone shell ───────────────────────────────────────────────────── */
function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{
      width: "20vw",
      aspectRatio: "9/19.5",
      background: "#1C1C1E",
      borderRadius: "3.2vw",
      padding: "0.6vw",
      boxShadow: "0 12px 40px rgba(0,0,0,0.32), inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 0 2px rgba(0,0,0,0.5)",
      flexShrink: 0,
      position: "relative",
    }}>
      {/* Side buttons */}
      <div style={{ position: "absolute", left: "-0.25vw", top: "4vw", width: "0.22vw", height: "1.2vw", background: "#3A3A3C", borderRadius: "2px" }} />
      <div style={{ position: "absolute", left: "-0.25vw", top: "5.6vw", width: "0.22vw", height: "2vw", background: "#3A3A3C", borderRadius: "2px" }} />
      <div style={{ position: "absolute", left: "-0.25vw", top: "8vw", width: "0.22vw", height: "2vw", background: "#3A3A3C", borderRadius: "2px" }} />
      <div style={{ position: "absolute", right: "-0.25vw", top: "5.6vw", width: "0.22vw", height: "3.2vw", background: "#3A3A3C", borderRadius: "2px" }} />

      {/* Dynamic island */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "0.55vw", paddingBottom: "0.35vw" }}>
        <div style={{ width: "4.5vw", height: "0.75vw", background: "#0a0a0a", borderRadius: "1.5vw" }} />
      </div>

      {/* Screen */}
      <div style={{
        background: SCREEN_BG,
        borderRadius: "2.5vw",
        overflow: "hidden",
        height: "calc(100% - 1.6vw)",
        display: "flex",
        flexDirection: "column",
      }}>
        {children}
      </div>
    </div>
  );
}

/* ─── small helpers ─────────────────────────────────────────────────── */
function F({ name, size = 10, color = MUTED }: { name: string; size?: number; color?: string }) {
  const ICONS: Record<string, string> = {
    box: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z",
    archive: "M21 8v13H3V8M1 3h22v5H1zM10 12h4",
    heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
    search: "M11 17a6 6 0 100-12 6 6 0 000 12zM21 21l-4.35-4.35",
    "map-pin": "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z",
    "chevron-right": "M9 18l6-6-6-6",
    "shopping-bag": "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
    calendar: "M3 4h18v18H3V4zM16 2v4M8 2v4M3 10h18",
    "file-text": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2zM14 2v6h6M16 13H8M16 17H8M10 9H8",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    ring: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16a4 4 0 100-8 4 4 0 000 8z",
    watch: "M12 22a7 7 0 100-14 7 7 0 000 14zM12 8v4l2 2M8 2h8M8 22h8",
    check: "M20 6L9 17l-5-5",
    "share-2": "M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98",
    "edit-2": "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z",
    "trash-2": "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
  };
  const d = ICONS[name] || "M12 12h.01";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      <path d={d} />
    </svg>
  );
}

function Txt({ size, weight = 400, color = FG, style, children }: {
  size: number; weight?: number; color?: string;
  style?: CSSProperties; children: ReactNode;
}) {
  return (
    <span style={{
      fontSize: `${size}vw`, fontWeight: weight, color, lineHeight: 1.3,
      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      display: "block", ...style,
    }}>
      {children}
    </span>
  );
}

/* ─── screen 1: vault ───────────────────────────────────────────────── */
function VaultScreen() {
  const stats = [
    { icon: "box", label: "PIECES", val: "8" },
    { icon: "archive", label: "RETAILERS", val: "5" },
    { icon: "heart", label: "WISHLIST", val: "4" },
    { icon: "bell", label: "REMINDERS", val: "4" },
  ];
  const pieces = [
    { icon: "ring", name: "Tiffany Setting Ring", brand: "Tiffany & Co.", warranty: true },
    { icon: "watch", name: "Submariner Date", brand: "Rolex", warranty: false },
    { icon: "ring", name: "Love Bracelet", brand: "Cartier", warranty: true },
  ];
  const retailers = [
    { name: "Tiffany & Co.", pieces: 2, wish: 0 },
    { name: "Kay Jewelers", pieces: 1, wish: 2 },
    { name: "Rolex", pieces: 2, wish: 0 },
  ];

  return (
    <>
      {/* Header */}
      <div style={{ padding: "1.2vw 1.4vw 0.8vw", background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Txt size={1.6} weight={700} color={P}>DiaGe</Txt>
            <Txt size={0.58} color={MUTED} style={{ marginTop: "0.1vw" }}>8 pieces · 5 retailers</Txt>
          </div>
          <div style={{ display: "flex", gap: "0.4vw", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25vw", background: P8, border: `1px solid ${P}30`, borderRadius: "99px", padding: "0.2vw 0.55vw" }}>
              <F name="file-text" size={7} color={P} />
              <Txt size={0.52} weight={600} color={P}>Report</Txt>
            </div>
          </div>
        </div>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4vw", background: "#F3F4F6", borderRadius: "0.7vw", padding: "0.45vw 0.7vw", marginTop: "0.6vw", border: `1px solid ${BORDER}` }}>
          <F name="search" size={8} color={MUTED} />
          <Txt size={0.54} color="#9CA3AF">Search pieces, brands…</Txt>
        </div>
      </div>

      {/* Scrollable area */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Stats row */}
        <div style={{ display: "flex", gap: "0.5vw", padding: "0.7vw 1vw 0" }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: "0.9vw",
              padding: "0.5vw 0.3vw", gap: "0.15vw",
            }}>
              <F name={s.icon} size={8} color={P} />
              <Txt size={0.75} weight={700}>{s.val}</Txt>
              <Txt size={0.42} weight={600} color={MUTED} style={{ letterSpacing: "0.03em" }}>{s.label}</Txt>
            </div>
          ))}
        </div>

        {/* Collection value banner */}
        <div style={{
          margin: "0.6vw 1vw 0", background: P, borderRadius: "1vw", padding: "0.65vw 1vw",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <Txt size={0.42} weight={600} color="rgba(255,255,255,0.65)" style={{ letterSpacing: "0.08em" }}>COLLECTION VALUE</Txt>
            <Txt size={1.05} weight={700} color="#fff">$87,400</Txt>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.15vw" }}>
            <F name="file-text" size={10} color="rgba(255,255,255,0.7)" />
            <Txt size={0.5} color="rgba(255,255,255,0.7)">View Report</Txt>
          </div>
        </div>

        {/* YOUR COLLECTION label */}
        <Txt size={0.5} weight={700} color={MUTED} style={{ padding: "0.6vw 1vw 0.3vw", letterSpacing: "0.07em" }}>YOUR COLLECTION</Txt>

        {/* Piece cards horizontal scroll */}
        <div style={{ display: "flex", gap: "0.6vw", paddingLeft: "1vw", paddingRight: "0.5vw", overflow: "hidden" }}>
          {pieces.map((p) => (
            <div key={p.name} style={{
              width: "4.4vw", flexShrink: 0, background: CARD_BG,
              border: `1px solid ${BORDER}`, borderRadius: "1vw", padding: "0.6vw 0.5vw",
              display: "flex", flexDirection: "column", gap: "0.3vw",
            }}>
              <div style={{ width: "2.2vw", height: "2.2vw", borderRadius: "0.6vw", background: P15, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <F name={p.icon} size={11} color={P} />
              </div>
              <Txt size={0.55} weight={600} style={{ whiteSpace: "normal", overflow: "hidden", lineHeight: 1.2, maxHeight: "1.6vw" }}>{p.name}</Txt>
              <Txt size={0.47} color={MUTED}>{p.brand}</Txt>
              {p.warranty ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.2vw", background: "#D4AA3A14", border: "1px solid #D4AA3A40", borderRadius: "4px", padding: "0.1vw 0.3vw", width: "fit-content" }}>
                  <F name="shield" size={6} color={GOLD} />
                  <Txt size={0.4} weight={600} color={GOLD}>Warranty</Txt>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* BY RETAILER */}
        <Txt size={0.5} weight={700} color={MUTED} style={{ padding: "0.6vw 1vw 0.3vw", letterSpacing: "0.07em" }}>BY RETAILER</Txt>

        {retailers.map((r) => (
          <div key={r.name} style={{
            display: "flex", alignItems: "center", gap: "0.5vw",
            margin: "0 1vw 0.45vw", padding: "0.6vw 0.7vw",
            background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: "0.9vw",
          }}>
            <div style={{ width: "1.8vw", height: "1.8vw", borderRadius: "0.45vw", background: P15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <F name="archive" size={8} color={P} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Txt size={0.62} weight={600}>{r.name}</Txt>
              <div style={{ display: "flex", gap: "0.4vw", marginTop: "0.1vw" }}>
                {r.pieces > 0 && <Txt size={0.47} color={MUTED}><F name="box" size={6} color={MUTED} /> {r.pieces} pieces</Txt>}
                {r.wish > 0 && <Txt size={0.47} color={MUTED}><F name="heart" size={6} color={MUTED} /> {r.wish} wishlist</Txt>}
              </div>
            </div>
            <F name="chevron-right" size={8} color={MUTED} />
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── screen 2: wishlist ─────────────────────────────────────────────── */
function WishlistScreen() {
  const sections = [
    {
      retailer: "KAY JEWELERS",
      items: [
        { name: "Open Heart Diamond Pendant", brand: "Le Vian", price: "$1,850", priority: "high" as const },
        { name: "Pavé Diamond Hoop Earrings", brand: "", price: "$2,100", priority: "high" as const },
      ],
    },
    {
      retailer: "BLUE NILE",
      items: [
        { name: "Diamond Tennis Necklace", brand: "Blue Nile", price: "$6,400", priority: "medium" as const },
      ],
    },
    {
      retailer: "MIKIMOTO",
      items: [
        { name: "Pearl Drop Earrings 18K", brand: "Mikimoto", price: "$3,200", priority: "low" as const },
      ],
    },
  ];

  const PCOL: Record<"high" | "medium" | "low", string> = { high: RED, medium: AMBER, low: GREEN };

  return (
    <>
      {/* Header */}
      <div style={{ padding: "1.2vw 1.4vw 0.8vw", background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <Txt size={1.6} weight={700}>Wishlist</Txt>
        <Txt size={0.58} color={MUTED} style={{ marginTop: "0.1vw" }}>4 items</Txt>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4vw", background: "#F3F4F6", borderRadius: "0.7vw", padding: "0.45vw 0.7vw", marginTop: "0.6vw", border: `1px solid ${BORDER}` }}>
          <F name="search" size={8} color={MUTED} />
          <Txt size={0.54} color="#9CA3AF">Search by name, brand, SKU…</Txt>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflow: "hidden", padding: "0.4vw 1vw" }}>
        {sections.map((sec) => (
          <div key={sec.retailer} style={{ marginBottom: "0.5vw" }}>
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4vw", marginBottom: "0.4vw", marginTop: "0.3vw" }}>
              <div style={{ width: "0.45vw", height: "0.45vw", borderRadius: "50%", background: P, flexShrink: 0 }} />
              <Txt size={0.5} weight={700} color={MUTED} style={{ letterSpacing: "0.07em", flex: 1 }}>{sec.retailer}</Txt>
              <Txt size={0.5} color={MUTED}>{sec.items.length}</Txt>
              <div style={{ display: "flex", alignItems: "center", gap: "0.2vw", background: P8, borderRadius: "99px", padding: "0.15vw 0.4vw" }}>
                <F name="calendar" size={6} color={P} />
                <Txt size={0.42} weight={600} color={P}>Book Appt</Txt>
              </div>
            </div>

            {/* Cards */}
            {sec.items.map((item) => (
              <div key={item.name} style={{
                display: "flex", background: CARD_BG, border: `1px solid ${BORDER}`,
                borderRadius: "1vw", marginBottom: "0.4vw", overflow: "hidden",
              }}>
                {/* Priority bar */}
                <div style={{ width: "0.3vw", background: PCOL[item.priority], flexShrink: 0 }} />
                {/* Content */}
                <div style={{ flex: 1, padding: "0.6vw 0.7vw" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Txt size={0.62} weight={600} style={{ flex: 1, marginRight: "0.4vw" }}>{item.name}</Txt>
                    <div style={{ display: "flex", gap: "0.35vw", flexShrink: 0 }}>
                      <F name="share-2" size={8} color={GOLD} />
                      <F name="edit-2" size={8} color={MUTED} />
                      <F name="trash-2" size={8} color={MUTED} />
                    </div>
                  </div>
                  {item.brand ? <Txt size={0.52} color={MUTED}>{item.brand}</Txt> : null}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25vw", marginTop: "0.1vw" }}>
                    <F name="map-pin" size={6} color={MUTED} />
                    <Txt size={0.5} color={MUTED}>{sec.retailer.split(" ").map(w => w[0] + w.slice(1).toLowerCase()).join(" ")}</Txt>
                  </div>
                  <Txt size={0.65} weight={600} color={GOLD} style={{ marginTop: "0.1vw" }}>{item.price}</Txt>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* FAB */}
      <div style={{
        position: "absolute" as const, right: "1.2vw", bottom: "1.5vw",
        width: "2.8vw", height: "2.8vw", borderRadius: "50%",
        background: P, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px rgba(91,33,182,0.4)", zIndex: 10,
      }}>
        <span style={{ color: "#fff", fontSize: "1.5vw", lineHeight: 1, marginTop: "-0.1vw" }}>+</span>
      </div>
    </>
  );
}

/* ─── screen 3: reminders ───────────────────────────────────────────── */
function RemindersScreen() {
  type Urg = "overdue" | "this-week" | "due-soon" | "ok";
  const UCOL: Record<Urg, string> = { overdue: RED, "this-week": AMBER, "due-soon": P, ok: GREEN };
  const ULBL: Record<Urg, string> = { overdue: "Overdue", "this-week": "This week", "due-soon": "Due soon", ok: "Jun 14" };

  const sections = [
    {
      retailer: "Tiffany & Co.",
      items: [
        { name: "Tiffany Setting Ring", date: "June 23, 2026", recur: "1yr", urg: "due-soon" as Urg },
      ],
    },
    {
      retailer: "Kay Jewelers",
      items: [
        { name: "Open Heart Pendant", date: "June 11, 2026", recur: "1yr", urg: "this-week" as Urg },
        { name: "Tennis Bracelet", date: "May 30, 2026", recur: "6mo", urg: "overdue" as Urg },
      ],
    },
    {
      retailer: "Rolex",
      items: [
        { name: "Submariner Full Service", date: "July 24, 2026", recur: "2yr", urg: "ok" as Urg },
      ],
    },
  ];

  return (
    <>
      {/* Header */}
      <div style={{ padding: "1.2vw 1.4vw 0.6vw", background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
          <Txt size={1.6} weight={700}>Reminders</Txt>
          <div style={{ background: P, borderRadius: "99px", padding: "0.15vw 0.5vw" }}>
            <Txt size={0.6} weight={700} color="#fff">4</Txt>
          </div>
        </div>
        <Txt size={0.56} color={MUTED} style={{ marginTop: "0.1vw" }}>Inspection schedule & store booking</Txt>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflow: "hidden", padding: "0.2vw 1vw" }}>
        {sections.map((sec) => (
          <div key={sec.retailer} style={{ marginBottom: "0.3vw" }}>
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4vw", margin: "0.5vw 0 0.35vw" }}>
              <div style={{ width: "1.4vw", height: "1.4vw", borderRadius: "0.35vw", background: P15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <F name="shopping-bag" size={7} color={P} />
              </div>
              <Txt size={0.6} weight={700} style={{ flex: 1 }}>{sec.retailer}</Txt>
              <div style={{ background: BORDER, borderRadius: "0.6vw", padding: "0.1vw 0.4vw" }}>
                <Txt size={0.5} weight={600} color={MUTED}>{sec.items.length}</Txt>
              </div>
            </div>

            {sec.items.map((item) => {
              const urg = item.urg;
              const uc = UCOL[urg];
              return (
                <div key={item.name} style={{ marginBottom: "0.4vw" }}>
                  {/* Urgency chip above card */}
                  <div style={{ display: "flex", marginBottom: "0.2vw" }}>
                    <div style={{ background: uc + (urg === "due-soon" ? "18" : "20"), borderRadius: "99px", padding: "0.12vw 0.5vw" }}>
                      <Txt size={0.48} weight={600} color={uc}>{ULBL[urg]}</Txt>
                    </div>
                  </div>
                  {/* Card */}
                  <div style={{
                    background: CARD_BG, border: `1px solid ${BORDER}`,
                    borderRadius: "1vw", overflow: "hidden",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", padding: "0.65vw 0.7vw", gap: "0.55vw" }}>
                      {/* Circle check */}
                      <div style={{
                        width: "1.6vw", height: "1.6vw", borderRadius: "50%",
                        border: `1.5px solid ${uc}`, flexShrink: 0,
                        background: "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                      }} />
                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Txt size={0.62} weight={600}>{item.name}</Txt>
                        <Txt size={0.5} color={MUTED}>{sec.retailer}</Txt>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25vw", marginTop: "0.15vw" }}>
                          <F name="calendar" size={6} color={MUTED} />
                          <Txt size={0.5} color={MUTED}>{item.date}</Txt>
                          <div style={{ background: "#F3F4F6", borderRadius: "0.4vw", padding: "0.05vw 0.3vw" }}>
                            <Txt size={0.44} weight={600} color={MUTED}>{item.recur}</Txt>
                          </div>
                        </div>
                      </div>
                      {/* Urgency badge */}
                      <div style={{ flexShrink: 0, background: uc + "18", borderRadius: "99px", padding: "0.15vw 0.45vw" }}>
                        <Txt size={0.5} weight={600} color={uc}>{ULBL[urg]}</Txt>
                      </div>
                    </div>
                    {/* Book strip */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: "0.4vw",
                      padding: "0.4vw 0.7vw", borderTop: `1px solid ${BORDER}`,
                      background: P8,
                    }}>
                      <F name="calendar" size={7} color={P} />
                      <Txt size={0.5} weight={600} color={P} style={{ flex: 1 }}>Book appointment at {sec.retailer}</Txt>
                      <F name="chevron-right" size={7} color={P} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* FAB */}
      <div style={{
        position: "absolute" as const, right: "1.2vw", bottom: "1.5vw",
        width: "2.8vw", height: "2.8vw", borderRadius: "50%",
        background: P, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px rgba(91,33,182,0.4)", zIndex: 10,
      }}>
        <span style={{ color: "#fff", fontSize: "1.5vw", lineHeight: 1, marginTop: "-0.1vw" }}>+</span>
      </div>
    </>
  );
}

/* ─── slide ─────────────────────────────────────────────────────────── */
export default function S10AppScreenshots() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[7vw] pt-[6vh] pb-[6vh]">
        <p className="text-[1.1vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6]">
          The live app
        </p>
        <h1 className="mt-[0.8vh] text-[2.4vw] font-bold text-[#111827] leading-[1.2]">
          Real screens. Real customers. In market today.
        </h1>

        {/* Phones */}
        <div className="mt-[2.5vh] flex gap-[2.5vw] items-start justify-center flex-1">

          <div className="flex flex-col items-center gap-[1.4vh]">
            <PhoneFrame>
              <VaultScreen />
            </PhoneFrame>
            <div className="text-center">
              <p className="text-[1.15vw] font-bold text-[#111827]">Jewelry Vault</p>
              <p className="text-[0.9vw] text-[#6B7280] mt-[0.2vh]">Every piece, warranty &amp; receipt in one place</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-[1.4vh]">
            <PhoneFrame>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
                <WishlistScreen />
              </div>
            </PhoneFrame>
            <div className="text-center">
              <p className="text-[1.15vw] font-bold text-[#111827]">Wishlist</p>
              <p className="text-[0.9vw] text-[#6B7280] mt-[0.2vh]">Saved purchase intent your associates act on</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-[1.4vh]">
            <PhoneFrame>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
                <RemindersScreen />
              </div>
            </PhoneFrame>
            <div className="text-center">
              <p className="text-[1.15vw] font-bold text-[#111827]">Reminders</p>
              <p className="text-[0.9vw] text-[#6B7280] mt-[0.2vh]">Alerts before Diamond Bond windows lapse</p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-[3vh] left-[7vw] right-[7vw] flex justify-between items-center">
        <p className="text-[1.1vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
        <p className="text-[1.3vw] text-[#9CA3AF]">10 / 17</p>
      </div>
    </div>
  );
}
