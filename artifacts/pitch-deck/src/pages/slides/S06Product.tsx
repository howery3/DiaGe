export default function S06Product() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <h1
          className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          DiaGe is a jewelry management app that keeps customers engaged between purchases
        </h1>
        <p className="mt-[1.5vh] text-[1.8vw] text-[#6B7280]">
          Three capabilities, one reason to stay in the Signet ecosystem
        </p>

        <div className="mt-[4.5vh] flex flex-col gap-[3.5vh] flex-1">
          <div className="flex gap-[3vw] items-start">
            <div className="flex-shrink-0 w-[11vw]">
              <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">
                Collection tracker
              </p>
            </div>
            <div className="h-[4vh] w-[1px] bg-[#D1D5DB] flex-shrink-0 mt-[0.2vh]" />
            <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
              Customers photograph and catalog every piece they own, with warranty dates, gemstone details, and purchase records stored in one place, across phone changes. Their jewelry history lives in the app, not on a paper receipt in a drawer.
            </p>
          </div>

          <div className="flex gap-[3vw] items-start">
            <div className="flex-shrink-0 w-[11vw]">
              <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">
                Wishlist builder
              </p>
            </div>
            <div className="h-[4vh] w-[1px] bg-[#D1D5DB] flex-shrink-0 mt-[0.2vh]" />
            <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
              Customers save items from any retailer website and share their wishlist directly with a preferred Signet store. Associates receive full purchase context (item, price, ring size, priority) before the customer ever calls or walks in.
            </p>
          </div>

          <div className="flex gap-[3vw] items-start">
            <div className="flex-shrink-0 w-[11vw]">
              <p className="text-[1.2vw] font-bold tracking-[0.12em] uppercase text-[#5B21B6]">
                Inspection reminders
              </p>
            </div>
            <div className="h-[4vh] w-[1px] bg-[#D1D5DB] flex-shrink-0 mt-[0.2vh]" />
            <p className="text-[1.9vw] text-[#374151] leading-[1.45]">
              Automated push notifications 30 days before each Diamond Bond inspection window closes. Customers tap once to request an appointment at their preferred store. No call, no friction, no lapse.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">6 / 14</p>
        </div>
      </div>
    </div>
  );
}
