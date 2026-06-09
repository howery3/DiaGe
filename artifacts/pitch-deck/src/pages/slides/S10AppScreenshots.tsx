import type { CSSProperties, ReactNode } from "react";

/* ─── design tokens ─────────────────────────────────────────────────── */
const P      = "#5B21B6";
const P8     = "#5B21B610";
const P18    = "#5B21B62e";
const BORDER = "#E5E7EB";
const MUTED  = "#6B7280";
const FG     = "#111827";
const GOLD   = "#D4AA3A";
const RED    = "#DC2626";
const AMBER  = "#B45309";
const GREEN  = "#15803D";

/* ─── size constants (tuned for 13vw phone width) ──────────────────── */
const TL  = "0.92vw";  // large title (DiaGe / Wishlist / Reminders)
const TM  = "0.52vw";  // medium (card item names)
const TS  = "0.38vw";  // small meta
const TXS = "0.30vw";  // badge labels
const PH  = "0.7vw";   // horizontal padding
const PV  = "0.5vw";   // vertical padding
const R   = "0.6vw";   // card border radius
const RL  = "1.5vw";   // large border radius (screen corners)
const G   = "0.3vw";   // small gap

/* ─── helpers ───────────────────────────────────────────────────────── */
function Icon({ d, size = 8, color = MUTED, fill = "none" }: { d: string; size?: number; color?: string; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: "block" }}>
      <path d={d} />
    </svg>
  );
}

const IC: Record<string, string> = {
  box:      "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z",
  archive:  "M21 8v13H3V8M1 3h22v5H1zM10 12h4",
  heart:    "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  bell:     "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  search:   "M11 17a6 6 0 100-12 6 6 0 000 12zM21 21l-4.35-4.35",
  mappin:   "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z",
  chevron:  "M9 18l6-6-6-6",
  bag:      "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
  calendar: "M3 4h18v18H3V4zM16 2v4M8 2v4M3 10h18",
  file:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  ring:     "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16a4 4 0 100-8 4 4 0 000 8z",
  watch:    "M12 22a7 7 0 100-14 7 7 0 000 14zM12 8v4l2 2M8 2h8M8 22h8",
  share:    "M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98",
  edit:     "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z",
  trash:    "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
  user:     "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  camera:   "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z",
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  info:     "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16v-4M12 8h.01",
  maxim:    "M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3",
  hexagon:  "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  hash:     "M4 9h16M4 15h16M10 3L8 21M16 3l-2 18",
};

function Row({ children, gap = G, align = "center", style }: { children: ReactNode; gap?: string; align?: string; style?: CSSProperties }) {
  return <div style={{ display: "flex", alignItems: align, gap, ...style }}>{children}</div>;
}

function Txt({ s, w = 400, c = FG, children, clip, style }: {
  s: string; w?: number; c?: string; children: ReactNode; clip?: boolean; style?: CSSProperties;
}) {
  return (
    <span style={{
      fontSize: s, fontWeight: w, color: c, lineHeight: 1.3, display: "block",
      ...(clip ? { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } : {}),
      ...style,
    }}>
      {children}
    </span>
  );
}

function SearchBar() {
  return (
    <Row gap="0.25vw" style={{ background: "#F3F4F6", borderRadius: R, padding: `0.3vw ${PH}`, border: `1px solid ${BORDER}`, marginTop: "0.4vw" }}>
      <Icon d={IC.search} size={7} />
      <Txt s={TS} c="#9CA3AF">Search…</Txt>
    </Row>
  );
}

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <div style={{ background: bg, borderRadius: "99px", padding: `0.1vw 0.35vw`, display: "inline-flex" }}>
      <Txt s={TXS} w={600} c={color}>{label}</Txt>
    </div>
  );
}

/* ─── phone shell ───────────────────────────────────────────────────── */
function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    // filter: drop-shadow renders correctly in PDF; box-shadow loses blur and becomes a solid box
    <div style={{ filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.38))", flexShrink: 0, flexGrow: 0 }}>
    <div style={{
      width: "13vw",
      height: "28.17vw",  /* 13vw × (19.5/9) — explicit keeps all phones identical */
      background: "#1C1C1E",
      borderRadius: "2.2vw",
      padding: "0.4vw",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09), inset 0 0 0 2px rgba(0,0,0,0.45)",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* side buttons */}
      <div style={{ position: "absolute", left: "-0.18vw", top: "2.8vw", width: "0.16vw", height: "0.85vw", background: "#3A3A3C", borderRadius: "2px" }} />
      <div style={{ position: "absolute", left: "-0.18vw", top: "3.9vw", width: "0.16vw", height: "1.4vw", background: "#3A3A3C", borderRadius: "2px" }} />
      <div style={{ position: "absolute", left: "-0.18vw", top: "5.6vw", width: "0.16vw", height: "1.4vw", background: "#3A3A3C", borderRadius: "2px" }} />
      <div style={{ position: "absolute", right: "-0.18vw", top: "3.9vw", width: "0.16vw", height: "2.2vw", background: "#3A3A3C", borderRadius: "2px" }} />

      {/* dynamic island */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0.38vw 0 0.24vw" }}>
        <div style={{ width: "3.1vw", height: "0.52vw", background: "#090909", borderRadius: "1vw" }} />
      </div>

      {/* screen */}
      <div style={{ background: "#F8F8FB", borderRadius: RL, overflow: "hidden", height: "calc(100% - 1.1vw)", display: "flex", flexDirection: "column", position: "relative" }}>
        {children}
      </div>
    </div>
    </div>
  );
}

/* ─── screen: vault ─────────────────────────────────────────────────── */
function VaultScreen() {
  return (
    <>
      <div style={{ background: "#fff", padding: `${PV} ${PH} 0.35vw`, borderBottom: `1px solid ${BORDER}` }}>
        <Row style={{ justifyContent: "space-between" }}>
          <div>
            <Txt s={TL} w={700} c={P}>DiaGe</Txt>
            <Txt s={TS} c={MUTED} style={{ marginTop: "0.1vw" }}>8 pieces · 5 retailers</Txt>
          </div>
          <Row gap="0.25vw">
            <div style={{ background: P8, border: `1px solid ${P}30`, borderRadius: "99px", padding: "0.15vw 0.4vw", display: "flex", alignItems: "center", gap: "0.18vw" }}>
              <Icon d={IC.file} size={6} color={P} />
              <Txt s={TXS} w={600} c={P}>Report</Txt>
            </div>
          </Row>
        </Row>
        <SearchBar />
      </div>

      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: "0.25vw", padding: `0.35vw 0` }}>
        {/* Stats chips */}
        <Row gap="0.3vw" style={{ padding: `0 ${PH}` }}>
          {[["box","8","PIECES"],["archive","5","RETAILERS"],["heart","4","WISHLIST"],["bell","4","REMINDERS"]].map(([icon,val,lbl])=>(
            <div key={lbl} style={{ flex:1, background:"#fff", border:`1px solid ${BORDER}`, borderRadius:"0.6vw", padding:"0.35vw 0.2vw", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.12vw" }}>
              <Icon d={IC[icon]} size={6} color={P} />
              <Txt s="0.6vw" w={700}>{val}</Txt>
              <Txt s={TXS} w={600} c={MUTED} style={{ letterSpacing:"0.03em" }}>{lbl}</Txt>
            </div>
          ))}
        </Row>

        {/* Value banner */}
        <div style={{ margin: `0 ${PH}`, background: P, borderRadius: R, padding: "0.45vw 0.6vw", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Txt s={TXS} w={600} c="rgba(255,255,255,0.65)" style={{ letterSpacing: "0.08em" }}>COLLECTION VALUE</Txt>
            <Txt s="0.75vw" w={700} c="#fff">$87,400</Txt>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.1vw" }}>
            <Icon d={IC.file} size={8} color="rgba(255,255,255,0.7)" />
            <Txt s={TXS} c="rgba(255,255,255,0.7)">Report</Txt>
          </div>
        </div>

        {/* YOUR COLLECTION */}
        <Txt s={TXS} w={700} c={MUTED} style={{ padding: `0.15vw ${PH} 0.1vw`, letterSpacing: "0.07em" }}>YOUR COLLECTION</Txt>
        <div style={{ display: "flex", gap: "0.35vw", paddingLeft: PH, overflow: "hidden" }}>
          {[
            { icon: "ring",  name: "Tiffany Setting Ring", brand: "Tiffany & Co.", w: true },
            { icon: "watch", name: "Submariner Date",       brand: "Rolex",          w: false },
            { icon: "ring",  name: "Love Bracelet",         brand: "Cartier",        w: true },
          ].map(p=>(
            <div key={p.name} style={{ width: "3.2vw", flexShrink:0, background:"#fff", border:`1px solid ${BORDER}`, borderRadius:R, padding:"0.45vw 0.35vw", display:"flex", flexDirection:"column", gap:"0.18vw" }}>
              <div style={{ width:"1.6vw", height:"1.6vw", borderRadius:"0.4vw", background:P18, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon d={IC[p.icon]} size={8} color={P} />
              </div>
              <Txt s={TXS} w={600} style={{ whiteSpace:"normal", lineHeight:1.2, maxHeight:"0.9vw", overflow:"hidden" }}>{p.name}</Txt>
              <Txt s={TXS} c={MUTED}>{p.brand}</Txt>
              {p.w && (
                <Row gap="0.1vw" style={{ background:"#D4AA3A14", border:"1px solid #D4AA3A40", borderRadius:"3px", padding:"0.05vw 0.2vw", width:"fit-content" }}>
                  <Icon d={IC.shield} size={5} color={GOLD} />
                  <Txt s={TXS} w={600} c={GOLD}>Warranty</Txt>
                </Row>
              )}
            </div>
          ))}
        </div>

        {/* BY RETAILER */}
        <Txt s={TXS} w={700} c={MUTED} style={{ padding: `0.25vw ${PH} 0.1vw`, letterSpacing: "0.07em" }}>BY RETAILER</Txt>
        {[["Tiffany & Co.","2 pieces"],["Kay Jewelers","1 piece · 2 wishlist"],["Rolex","2 pieces"]].map(([name,meta])=>(
          <Row key={name} gap="0.35vw" style={{ margin:`0 ${PH} 0.22vw`, padding:"0.45vw 0.5vw", background:"#fff", border:`1px solid ${BORDER}`, borderRadius:R }}>
            <div style={{ width:"1.35vw", height:"1.35vw", borderRadius:"0.35vw", background:P18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon d={IC.archive} size={7} color={P} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <Txt s={TS} w={600} clip>{name}</Txt>
              <Txt s={TXS} c={MUTED}>{meta}</Txt>
            </div>
            <Icon d={IC.chevron} size={7} />
          </Row>
        ))}
      </div>
    </>
  );
}

/* ─── screen: wishlist ──────────────────────────────────────────────── */
function WishlistScreen() {
  const PCOL: Record<string, string> = { high: RED, med: AMBER, low: GREEN };
  const items = [
    { retailer: "KAY JEWELERS", name: "Open Heart Diamond Pendant", brand: "Le Vian", price: "$1,850", p: "high" },
    { retailer: "KAY JEWELERS", name: "Pavé Diamond Hoop Earrings", brand: "",         price: "$2,100", p: "high" },
    { retailer: "BLUE NILE",    name: "Diamond Tennis Necklace",    brand: "Blue Nile", price: "$6,400", p: "med"  },
    { retailer: "MIKIMOTO",     name: "Pearl Drop Earrings 18K",   brand: "Mikimoto",  price: "$3,200", p: "low"  },
  ];
  const groups = [...new Set(items.map(i=>i.retailer))];

  return (
    <>
      <div style={{ background:"#fff", padding:`${PV} ${PH} 0.35vw`, borderBottom:`1px solid ${BORDER}` }}>
        <Txt s={TL} w={700}>Wishlist</Txt>
        <Txt s={TS} c={MUTED} style={{ marginTop:"0.1vw" }}>4 items</Txt>
        <SearchBar />
      </div>
      <div style={{ flex:1, overflow:"hidden", padding:`0.3vw ${PH}` }}>
        {groups.map(retailer => (
          <div key={retailer} style={{ marginBottom:"0.3vw" }}>
            <Row gap="0.25vw" style={{ marginBottom:"0.25vw", marginTop:"0.15vw" }}>
              <div style={{ width:"0.35vw", height:"0.35vw", borderRadius:"50%", background:P, flexShrink:0 }} />
              <Txt s={TXS} w={700} c={MUTED} style={{ letterSpacing:"0.06em", flex:1 }}>{retailer}</Txt>
              <div style={{ background:P8, borderRadius:"99px", padding:"0.1vw 0.3vw", display:"flex", alignItems:"center", gap:"0.12vw" }}>
                <Icon d={IC.calendar} size={5} color={P} />
                <Txt s={TXS} w={600} c={P}>Book</Txt>
              </div>
            </Row>
            {items.filter(i=>i.retailer===retailer).map(item=>(
              <div key={item.name} style={{ display:"flex", background:"#fff", border:`1px solid ${BORDER}`, borderRadius:R, marginBottom:"0.28vw", overflow:"hidden" }}>
                <div style={{ width:"0.22vw", background:PCOL[item.p], flexShrink:0 }} />
                <div style={{ flex:1, padding:"0.45vw 0.4vw" }}>
                  <Row style={{ justifyContent:"space-between", alignItems:"flex-start" }}>
                    <Txt s={TM} w={600} clip style={{ flex:1, marginRight:"0.2vw" }}>{item.name}</Txt>
                    <Row gap="0.22vw" style={{ flexShrink:0 }}>
                      <Icon d={IC.share} size={6} color={GOLD} />
                      <Icon d={IC.edit}  size={6} color={MUTED} />
                      <Icon d={IC.trash} size={6} color={MUTED} />
                    </Row>
                  </Row>
                  {item.brand ? <Txt s={TS} c={MUTED}>{item.brand}</Txt> : null}
                  <Row gap="0.15vw" style={{ marginTop:"0.1vw" }}>
                    <Icon d={IC.mappin} size={6} />
                    <Txt s={TS} c={MUTED}>{retailer.split(" ").map((w:string)=>w[0]+w.slice(1).toLowerCase()).join(" ")}</Txt>
                  </Row>
                  <Txt s={TM} w={600} c={GOLD} style={{ marginTop:"0.1vw" }}>{item.price}</Txt>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* FAB */}
      <div style={{ position:"absolute", right:"0.9vw", bottom:"1.1vw", width:"2.1vw", height:"2.1vw", borderRadius:"50%", background:P, display:"flex", alignItems:"center", justifyContent:"center", filter:`drop-shadow(0 3px 8px ${P}88)`, zIndex:10 }}>
        <span style={{ color:"#fff", fontSize:"1.1vw", lineHeight:1 }}>+</span>
      </div>
    </>
  );
}

/* ─── screen: reminders ─────────────────────────────────────────────── */
function RemindersScreen() {
  type U = "overdue"|"week"|"soon"|"ok";
  const UC: Record<U,string> = { overdue:RED, week:AMBER, soon:P, ok:GREEN };
  const UL: Record<U,string> = { overdue:"Overdue", week:"This week", soon:"Due soon", ok:"Jul 24" };
  const secs = [
    { r:"Tiffany & Co.",  items:[{ n:"Tiffany Setting Ring",  date:"Jun 23, 2026", rec:"1yr", u:"soon" as U }] },
    { r:"Kay Jewelers",   items:[{ n:"Open Heart Pendant",    date:"Jun 11, 2026", rec:"1yr", u:"week" as U },
                                 { n:"Tennis Bracelet",       date:"May 30, 2026", rec:"6mo", u:"overdue" as U }] },
    { r:"Rolex",          items:[{ n:"Submariner Full Service",date:"Jul 24, 2026", rec:"2yr", u:"ok" as U }] },
  ];

  return (
    <>
      <div style={{ background:"#fff", padding:`${PV} ${PH} 0.35vw`, borderBottom:`1px solid ${BORDER}` }}>
        <Row gap="0.35vw">
          <Txt s={TL} w={700}>Reminders</Txt>
          <div style={{ background:P, borderRadius:"99px", padding:"0.1vw 0.38vw" }}>
            <Txt s={TXS} w={700} c="#fff">4</Txt>
          </div>
        </Row>
        <Txt s={TS} c={MUTED} style={{ marginTop:"0.1vw" }}>Inspection schedule & booking</Txt>
      </div>
      <div style={{ flex:1, overflow:"hidden", padding:`0.2vw ${PH}` }}>
        {secs.map(sec=>(
          <div key={sec.r}>
            <Row gap="0.28vw" style={{ margin:`0.4vw 0 0.25vw` }}>
              <div style={{ width:"1.05vw", height:"1.05vw", borderRadius:"0.25vw", background:P18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon d={IC.bag} size={5} color={P} />
              </div>
              <Txt s={TM} w={700} style={{ flex:1 }}>{sec.r}</Txt>
              <div style={{ background:BORDER, borderRadius:"0.4vw", padding:"0.05vw 0.3vw" }}>
                <Txt s={TXS} w={600} c={MUTED}>{sec.items.length}</Txt>
              </div>
            </Row>
            {sec.items.map(item=>{
              const uc = UC[item.u];
              return (
                <div key={item.n} style={{ marginBottom:"0.3vw" }}>
                  <div style={{ marginBottom:"0.14vw" }}>
                    <Badge label={UL[item.u]} bg={uc+"22"} color={uc} />
                  </div>
                  <div style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:R, overflow:"hidden" }}>
                    <Row gap="0.38vw" style={{ padding:"0.45vw 0.4vw" }}>
                      <div style={{ width:"1.15vw", height:"1.15vw", borderRadius:"50%", border:`1.5px solid ${uc}`, flexShrink:0 }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <Txt s={TM} w={600} clip>{item.n}</Txt>
                        <Txt s={TS} c={MUTED}>{sec.r}</Txt>
                        <Row gap="0.18vw" style={{ marginTop:"0.1vw" }}>
                          <Icon d={IC.calendar} size={5} />
                          <Txt s={TS} c={MUTED}>{item.date}</Txt>
                          <div style={{ background:"#F3F4F6", borderRadius:"0.3vw", padding:"0.03vw 0.22vw" }}>
                            <Txt s={TXS} w={600} c={MUTED}>{item.rec}</Txt>
                          </div>
                        </Row>
                      </div>
                      <Badge label={UL[item.u]} bg={uc+"18"} color={uc} />
                    </Row>
                    <Row gap="0.28vw" style={{ padding:"0.28vw 0.4vw", borderTop:`1px solid ${BORDER}`, background:P8 }}>
                      <Icon d={IC.calendar} size={6} color={P} />
                      <Txt s={TS} w={600} c={P} style={{ flex:1 }}>Book appt at {sec.r}</Txt>
                      <Icon d={IC.chevron} size={6} color={P} />
                    </Row>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ position:"absolute", right:"0.9vw", bottom:"1.1vw", width:"2.1vw", height:"2.1vw", borderRadius:"50%", background:P, display:"flex", alignItems:"center", justifyContent:"center", filter:`drop-shadow(0 3px 8px ${P}88)`, zIndex:10 }}>
        <span style={{ color:"#fff", fontSize:"1.1vw", lineHeight:1 }}>+</span>
      </div>
    </>
  );
}

/* ─── screen: profile ───────────────────────────────────────────────── */
function ProfileScreen() {
  const secs = [
    { icon:"user",  title:"Contact",           summary:"Aiden Howery · aiden@diage.app" },
    { icon:"maxim", title:"Jewelry Sizes",      summary:"Ring 7 · Bracelet 7\"" },
    { icon:"star",  title:"Style Preferences",  summary:"White Gold · Diamond, Sapphire" },
    { icon:"calendar",title:"Special Dates",    summary:"Birthday Apr 12 · Anniv Aug 3" },
  ];

  return (
    <>
      {/* Purple hero */}
      <div style={{ background:"linear-gradient(135deg,#4C1D95,#6D28D9)", padding:`${PV} ${PH}`, flexShrink:0 }}>
        <Row style={{ justifyContent:"space-between", marginBottom:"0.5vw" }}>
          <Txt s={TM} w={700} c="#fff">My Profile</Txt>
          <Row gap="0.3vw">
            <Icon d={IC.share}  size={8} color="rgba(255,255,255,0.8)" />
            <Icon d={IC.watch}  size={8} color="rgba(255,255,255,0.8)" />
          </Row>
        </Row>
        {/* Avatar row */}
        <Row gap="0.5vw" style={{ alignItems:"flex-start" }}>
          <div style={{ position:"relative", flexShrink:0 }}>
            <div style={{ width:"2.6vw", height:"2.6vw", borderRadius:"50%", background:"rgba(255,255,255,0.18)", display:"flex", alignItems:"center", justifyContent:"center", border:"1.5px solid rgba(255,255,255,0.3)" }}>
              <Txt s="0.7vw" w={700} c="#fff">AH</Txt>
            </div>
            <div style={{ position:"absolute", bottom:0, right:0, width:"0.9vw", height:"0.9vw", borderRadius:"50%", background:P, display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid #fff" }}>
              <Icon d={IC.camera} size={4} color="#fff" />
            </div>
          </div>
          <div style={{ flex:1 }}>
            <Txt s={TM} w={700} c="#fff">Aiden Howery</Txt>
            <Txt s={TS} c="rgba(255,255,255,0.75)" style={{ marginTop:"0.08vw" }}>aiden@diage.app</Txt>
            {/* Completion bar */}
            <Row gap="0.25vw" style={{ marginTop:"0.3vw" }}>
              <div style={{ flex:1, height:"0.3vw", background:"rgba(255,255,255,0.25)", borderRadius:"99px", overflow:"hidden" }}>
                <div style={{ width:"80%", height:"100%", background:"#fff", borderRadius:"99px" }} />
              </div>
              <Txt s={TXS} c="rgba(255,255,255,0.8)">80%</Txt>
            </Row>
          </div>
        </Row>
        {/* Share CTA */}
        <Row gap="0.25vw" style={{ marginTop:"0.45vw", background:"rgba(255,255,255,0.12)", borderRadius:R, padding:"0.3vw 0.5vw" }}>
          <Icon d={IC.share} size={6} color="#fff" />
          <Txt s={TS} c="#fff" style={{ flex:1 }}>Share with a store or friends &amp; family</Txt>
          <Icon d={IC.chevron} size={6} color="rgba(255,255,255,0.7)" />
        </Row>
      </div>

      {/* Accordions */}
      <div style={{ flex:1, overflow:"hidden", padding:`0.3vw 0` }}>
        {secs.map((sec, i) => (
          <div key={sec.title} style={{ margin:`0 ${PH} 0.22vw`, background:"#fff", border:`1px solid ${BORDER}`, borderRadius:R }}>
            <Row gap="0.35vw" style={{ padding:"0.45vw 0.5vw" }}>
              <div style={{ width:"1.4vw", height:"1.4vw", borderRadius:"0.35vw", background: i===0 ? P18 : "#F3F4F6", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon d={IC[sec.icon]} size={7} color={i===0 ? P : MUTED} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <Row style={{ justifyContent:"space-between" }}>
                  <Txt s={TM} w={600}>{sec.title}</Txt>
                  <Icon d={i===0 ? "M18 15l-6-6-6 6" : IC.chevron} size={7} color={P} />
                </Row>
                <Txt s={TS} c={MUTED} clip style={{ marginTop:"0.08vw" }}>{sec.summary}</Txt>
              </div>
            </Row>
            {/* First section expanded — show inline fields */}
            {i === 0 && (
              <div style={{ borderTop:`1px solid ${BORDER}` }}>
                {[
                  { icon:"user",     label:"Full name",     val:"Aiden Howery" },
                  { icon:"calendar", label:"Email",          val:"aiden@diage.app" },
                  { icon:"bell",     label:"Phone",          val:"(512) 555-0142" },
                ].map((f, fi, arr)=>(
                  <div key={f.label} style={{ padding:`0.3vw ${PH}`, borderBottom: fi < arr.length-1 ? `1px solid ${BORDER}` : "none" }}>
                    <Row gap="0.3vw">
                      <Icon d={IC[f.icon]} size={6} color={MUTED} />
                      <Txt s={TS} c={MUTED} style={{ width:"1.8vw", flexShrink:0 }}>{f.label}</Txt>
                      <Txt s={TS} c={FG} clip style={{ flex:1 }}>{f.val}</Txt>
                    </Row>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── screen: insurance report ──────────────────────────────────────── */
function InsuranceScreen() {
  return (
    <>
      {/* Nav header */}
      <div style={{ background:"#fff", padding:`${PV} ${PH}`, borderBottom:`1px solid ${BORDER}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Txt s={TM} w={600}>Insurance Summary</Txt>
        <Icon d={IC.share} size={8} color={P} />
      </div>

      <div style={{ flex:1, overflow:"hidden", padding:`0.45vw ${PH}`, display:"flex", flexDirection:"column", gap:"0.35vw" }}>
        {/* Hint banner */}
        <Row gap="0.28vw" style={{ background:`${P}0a`, border:`1px solid ${P}22`, borderRadius:R, padding:"0.35vw 0.4vw" }}>
          <Icon d={IC.info} size={7} color={P} />
          <Txt s={TS} c={MUTED} style={{ flex:1, whiteSpace:"normal", lineHeight:1.35 }}>Screenshot or share to send to your insurer</Txt>
        </Row>

        {/* Purple stats card */}
        <div style={{ background:P, borderRadius:R, padding:"0.6vw 0.6vw 0.5vw" }}>
          <Row gap="0.3vw" style={{ marginBottom:"0.25vw", justifyContent:"space-between" }}>
            <Row gap="0.22vw">
              <div style={{ width:"0.5vw", height:"0.5vw", background:"#fff", borderRadius:"1px", transform:"rotate(45deg)" }} />
              <Txt s={TM} w={700} c="#fff">DiaGe</Txt>
            </Row>
            <Txt s={TXS} c="rgba(255,255,255,0.6)">June 9, 2026</Txt>
          </Row>
          <Txt s="0.7vw" w={700} c="#fff" style={{ letterSpacing:"-0.02em", marginBottom:"0.35vw" }}>Insurance Summary</Txt>
          <Row gap="0.25vw">
            {[["8","Pieces"],["$87.4K","Est. Value"],["12","Documents"],["3","Repairs"]].map(([val,lbl])=>(
              <div key={lbl} style={{ flex:1, background:"rgba(255,255,255,0.15)", borderRadius:"0.4vw", padding:"0.3vw 0.15vw", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.1vw" }}>
                <Txt s="0.6vw" w={700} c="#fff">{val}</Txt>
                <Txt s={TXS} c="rgba(255,255,255,0.7)" style={{ textAlign:"center" }}>{lbl}</Txt>
              </div>
            ))}
          </Row>
        </div>

        {/* Piece card */}
        <div style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:R, overflow:"hidden" }}>
          {/* Card header */}
          <Row gap="0.35vw" style={{ padding:"0.4vw 0.45vw", borderBottom:`1px solid ${BORDER}` }}>
            <div style={{ width:"1.3vw", height:"1.3vw", borderRadius:"50%", background:P, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Txt s={TXS} w={700} c="#fff">1</Txt>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <Txt s={TM} w={600} clip>Tiffany Setting Ring</Txt>
              <Txt s={TS} c={MUTED}>Ring · Tiffany & Co. · Platinum</Txt>
            </div>
          </Row>
          {/* Purchase fields */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3vw", padding:"0.4vw 0.45vw" }}>
            {[["Retailer","Tiffany & Co."],["Purchase Date","March 15, 2021"],["Purchase Price","$12,500"],["Serial","TIF-2021-A4831"]].map(([lbl,val])=>(
              <div key={lbl} style={{ width:"47%" }}>
                <Txt s={TXS} w={600} c={MUTED} style={{ textTransform:"uppercase", letterSpacing:"0.04em" }}>{lbl}</Txt>
                <Txt s={TS} c={FG}>{val}</Txt>
              </div>
            ))}
          </div>
          {/* Warranty boxes */}
          <Row gap="0.3vw" style={{ padding:"0.35vw 0.45vw", borderTop:`1px solid ${BORDER}` }}>
            <div style={{ flex:1, background:"#FFFBF0", border:"1px solid #E5D9C0", borderRadius:"0.4vw", padding:"0.3vw 0.35vw", display:"flex", flexDirection:"column", gap:"0.15vw" }}>
              <Row gap="0.2vw">
                <Icon d={IC.shield} size={6} color={GOLD} />
                <Txt s={TXS} w={700} c="#92601A" style={{ textTransform:"uppercase", letterSpacing:"0.04em" }}>Gold / Metal</Txt>
              </Row>
              <Txt s={TM} w={700} c={GREEN}>Lifetime ∞</Txt>
              <Row gap="0.15vw">
                <Icon d={IC.hash} size={5} color="#92601A" />
                <Txt s={TXS} c="#92601A">TW-LTW-0924</Txt>
              </Row>
            </div>
            <div style={{ flex:1, background:"#F7F4FF", border:"1px solid #D8D0F0", borderRadius:"0.4vw", padding:"0.3vw 0.35vw", display:"flex", flexDirection:"column", gap:"0.15vw" }}>
              <Row gap="0.2vw">
                <Icon d={IC.hexagon} size={6} color="#7C3AED" />
                <Txt s={TXS} w={700} c={P} style={{ textTransform:"uppercase", letterSpacing:"0.04em" }}>Diamond Bond</Txt>
              </Row>
              <Row gap="0.15vw">
                <Icon d={IC.hash} size={5} color="#7C3AED" />
                <Txt s={TXS} c={P}>DB-2021-8834</Txt>
              </Row>
              <Txt s={TM} w={600} c={AMBER}>42 days · Jun 21</Txt>
            </div>
          </Row>
        </div>

        {/* Share btn */}
        <Row gap="0.3vw" style={{ background:P, borderRadius:R, padding:"0.38vw 0.5vw", justifyContent:"center" }}>
          <Icon d={IC.share} size={7} color="#fff" />
          <Txt s={TM} w={600} c="#fff">Share Full Report</Txt>
        </Row>
      </div>
    </>
  );
}

/* ─── slide ─────────────────────────────────────────────────────────── */
const SCREENS = [
  { component: <VaultScreen />,     label: "Jewelry Vault",       sub: "Every piece, warranty & serial" },
  { component: <WishlistScreen />,  label: "Wishlist",            sub: "Saved intent your team acts on" },
  { component: <RemindersScreen />, label: "Reminders",           sub: "Alerts before DB windows lapse" },
  { component: <ProfileScreen />,   label: "Customer Profile",    sub: "Sizes, dates & style preferences" },
  { component: <InsuranceScreen />, label: "Insurance Report",    sub: "On-demand, shareable to insurer" },
];

export default function S10AppScreenshots() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[5vw] pt-[5vh] pb-[5vh]">
        <p className="text-[1.0vw] font-bold tracking-[0.18em] uppercase text-[#5B21B6]">The live app</p>
        <h1 className="mt-[0.6vh] text-[2.2vw] font-bold text-[#111827] leading-[1.2]">
          Five screens. One customer relationship.
        </h1>

        {/* Phones row */}
        <div className="mt-[2.2vh] flex gap-[2.5vw] items-center justify-center flex-1">
          {SCREENS.map(({ component, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-[1.2vh]">
              <PhoneFrame>{component}</PhoneFrame>
              <div className="text-center">
                <p className="text-[1.0vw] font-bold text-[#111827]">{label}</p>
                <p className="text-[0.82vw] text-[#6B7280] mt-[0.15vh]">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-[2.5vh] left-[5vw] right-[5vw] flex justify-between items-center">
        <p className="text-[1.0vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
        <p className="text-[1.2vw] text-[#9CA3AF]">10 / 17</p>
      </div>
    </div>
  );
}
