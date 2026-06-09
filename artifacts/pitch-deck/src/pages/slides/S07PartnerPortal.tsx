export default function S07PartnerPortal() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <h1
          className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          Associates receive verified purchase intent before the customer walks in
        </h1>
        <p className="mt-[1.5vh] text-[1.8vw] text-[#6B7280]">
          The DiaGe Partner Portal · three live signal types
        </p>

        <div className="mt-[4vh] flex flex-col gap-[2.8vh] flex-1">
          <div className="flex gap-[2.5vw] items-start">
            <div className="flex-shrink-0 rounded-sm px-[0.8vw] py-[0.4vh]" style={{ background: "#F3F0FF", minWidth: "0.6vw" }}>
              <div className="w-[0.5vw] h-[3.5vh] rounded-full bg-[#5B21B6]" />
            </div>
            <div>
              <p className="text-[2vw] font-bold text-[#111827]">Wishlist leads</p>
              <p className="mt-[0.5vh] text-[1.85vw] text-[#374151] leading-[1.45]">
                Customers who shared a specific item with the store. Associates see the product, estimated value, and days since the wishlist was saved, before the customer calls or walks in.
              </p>
            </div>
          </div>

          <div className="flex gap-[2.5vw] items-start">
            <div className="flex-shrink-0 rounded-sm px-[0.8vw] py-[0.4vh]" style={{ background: "#F3F0FF", minWidth: "0.6vw" }}>
              <div className="w-[0.5vw] h-[3.5vh] rounded-full bg-[#5B21B6]" />
            </div>
            <div>
              <p className="text-[2vw] font-bold text-[#111827]">Appointment requests</p>
              <p className="mt-[0.5vh] text-[1.85vw] text-[#374151] leading-[1.45]">
                Customers who booked through the app, with full wishlist context and a pre-formatted associate prep brief generated automatically. The associate arrives prepared.
              </p>
            </div>
          </div>

          <div className="flex gap-[2.5vw] items-start">
            <div className="flex-shrink-0 rounded-sm px-[0.8vw] py-[0.4vh]" style={{ background: "#F3F0FF", minWidth: "0.6vw" }}>
              <div className="w-[0.5vw] h-[3.5vh] rounded-full bg-[#5B21B6]" />
            </div>
            <div>
              <p className="text-[2vw] font-bold text-[#111827]">Diamond Bond alerts</p>
              <p className="mt-[0.5vh] text-[1.85vw] text-[#374151] leading-[1.45]">
                Customers with overdue inspections. One-click outreach message templates let associates reschedule before the plan lapses, turning a compliance risk into a booked visit.
              </p>
            </div>
          </div>

          <p className="text-[1.6vw] text-[#6B7280] mt-[1vh]">
            All signals are customer-initiated. DiaGe does not scrape, infer, or cold-contact.
          </p>
        </div>

        <div className="flex justify-between items-end mt-auto pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">7 / 17</p>
        </div>
      </div>
    </div>
  );
}
