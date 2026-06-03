export default function Slide04Product() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div
        className="absolute top-0 left-0 h-[0.6vh] w-full"
        style={{ background: "#5B21B6" }}
      />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <h1
          className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          DiaGe is a jewelry management app that keeps Signet customers engaged year-round
        </h1>
        <p className="mt-[1.5vh] text-[1.8vw] text-[#6B7280]">
          Three customer-facing capabilities
        </p>

        <div className="mt-[4.5vh] flex flex-col gap-[3.5vh] flex-1">
          <div className="flex gap-[3vw] items-start">
            <div className="flex-shrink-0 w-[11vw]">
              <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase" style={{ color: "#5B21B6" }}>
                Collection tracker
              </p>
            </div>
            <div className="h-[3.5vh] w-[1px] bg-[#D1D5DB] flex-shrink-0 mt-[0.2vh]" />
            <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
              Customers photograph and catalogue every piece they own, with warranty dates, purchase details, gemstone records, and attached documents stored in one place — across phone changes.
            </p>
          </div>

          <div className="flex gap-[3vw] items-start">
            <div className="flex-shrink-0 w-[11vw]">
              <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase" style={{ color: "#5B21B6" }}>
                Wishlist builder
              </p>
            </div>
            <div className="h-[3.5vh] w-[1px] bg-[#D1D5DB] flex-shrink-0 mt-[0.2vh]" />
            <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
              Customers save items from any retailer website with SKU, price, ring size, and priority — and share their wishlist directly with a preferred Signet store. Associates receive it before the customer arrives.
            </p>
          </div>

          <div className="flex gap-[3vw] items-start">
            <div className="flex-shrink-0 w-[11vw]">
              <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase" style={{ color: "#5B21B6" }}>
                Inspection reminders
              </p>
            </div>
            <div className="h-[3.5vh] w-[1px] bg-[#D1D5DB] flex-shrink-0 mt-[0.2vh]" />
            <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
              Automated push notifications 30 days before each Diamond Bond inspection window closes. Customers tap once to request an appointment at their preferred store — no call required.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">4 / 10</p>
        </div>
      </div>
    </div>
  );
}
