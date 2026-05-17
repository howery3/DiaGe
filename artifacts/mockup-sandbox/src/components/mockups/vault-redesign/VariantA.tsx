
const PRIMARY = "#5B21B6";
const PRIMARY_LIGHT = "#EDE8FA";
const BG = "#FAFAFA";
const CARD = "#FFFFFF";
const BORDER = "#E8E0F5";
const TEXT = "#1A0F2E";
const MUTED = "#7C6D9A";
const GOLD = "#D4AA3A";

const pieces = [
  { id: "1", name: "Engagement Ring", type: "ring", brand: "Jared", retailer: "Jared", color: "#F5E6FF" },
  { id: "2", name: "Diamond Necklace", type: "necklace", brand: "Kay", retailer: "Kay Jewelers", color: "#E6F0FF" },
  { id: "3", name: "Gold Bracelet", type: "bracelet", brand: "Zales", retailer: "Zales", color: "#FFF3E6" },
  { id: "4", name: "Sapphire Earrings", type: "earrings", brand: "Blue Nile", retailer: "Blue Nile", color: "#E6FFF0" },
];

const retailers = [
  { name: "Jared", pieces: 3, wishlist: 2 },
  { name: "Kay Jewelers", pieces: 2, wishlist: 5 },
  { name: "Zales", pieces: 1, wishlist: 1 },
];

const typeIcon: Record<string, string> = {
  ring: "💍", necklace: "📿", bracelet: "⌚", earrings: "✨", watch: "🕐", other: "💎",
};

export function VariantA() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: BG, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Status bar mock */}
      <div style={{ height: 44, background: BG, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>9:41</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 12 }}>●●●</span>
          <span style={{ fontSize: 12 }}>WiFi</span>
          <span style={{ fontSize: 12 }}>🔋</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: "8px 20px 14px", background: BG }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: PRIMARY, letterSpacing: -0.5 }}>DiaGe</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>8 pieces · 3 documents</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ background: PRIMARY_LIGHT, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13 }}>📄</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: PRIMARY }}>Report</span>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: "#F0EBF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16 }}>⚙️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "flex", gap: 10, padding: "0 20px 16px" }}>
        {[
          { label: "Pieces", value: "8", icon: "💎", color: PRIMARY },
          { label: "Retailers", value: "3", icon: "🏪", color: "#7C3AED" },
          { label: "Wishlist", value: "12", icon: "❤️", color: "#DB2777" },
          { label: "Reminders", value: "2", icon: "🔔", color: GOLD },
        ].map((s) => (
          <div key={s.label} style={{ flex: 1, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "10px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: TEXT }}>{s.value}</span>
            <span style={{ fontSize: 10, color: MUTED, textAlign: "center", fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Pieces */}
      <div style={{ padding: "0 20px 6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: 0.8, textTransform: "uppercase" }}>Recent Pieces</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: PRIMARY }}>See all</span>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {pieces.map((p) => (
            <div key={p.id} style={{ minWidth: 100, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: 52, height: 52, borderRadius: 26, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {typeIcon[p.type]}
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: TEXT, lineHeight: 1.2 }} >{p.name}</div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{p.brand}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add button */}
      <div style={{ padding: "12px 20px" }}>
        <div style={{ background: PRIMARY, borderRadius: 14, padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px #5B21B640" }}>
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 300 }}>+</span>
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>Add Jewelry Piece</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ margin: "0 20px 12px", background: "#F0EBF8", borderRadius: 12, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
        <span style={{ color: MUTED }}>🔍</span>
        <span style={{ color: MUTED, fontSize: 14 }}>Search by retailer...</span>
      </div>

      {/* Retailers */}
      <div style={{ padding: "0 20px 6px" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: 0.8, textTransform: "uppercase" }}>By Retailer</span>
      </div>
      <div style={{ padding: "8px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {retailers.map((r) => (
          <div key={r.name} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20 }}>🏪</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: TEXT }}>{r.name}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <span style={{ fontSize: 11, color: MUTED }}>💎 {r.pieces} pieces</span>
                <span style={{ fontSize: 11, color: MUTED }}>❤️ {r.wishlist} wishlist</span>
              </div>
            </div>
            <span style={{ color: MUTED, fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
