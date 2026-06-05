export default function S03CustomersSilent() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] font-body">
      <div className="absolute top-0 left-0 h-[0.6vh] w-full bg-[#5B21B6]" />

      <div className="relative z-10 flex flex-col h-full px-[8vw] pt-[7vh] pb-[6vh]">
        <h1
          className="text-[2.6vw] font-bold text-[#111827] leading-[1.2]"
          style={{ textWrap: "balance" }}
        >
          Jewelry customers go silent after the sale — Signet has no channel to reach them
        </h1>

        <div className="mt-[5vh] flex flex-col gap-[3.2vh] flex-1">
          <div className="flex gap-[2vw] items-start">
            <div className="flex-shrink-0 w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] mt-[0.9vh]" style={{ minWidth: "0.4vw" }} />
            <p className="text-[2vw] text-[#111827] leading-[1.45]">
              The average jewelry customer visits a store{" "}
              <span className="font-bold">once every 2–3 years</span>{" "}
              — there is no purchase frequency to lean on
            </p>
          </div>
          <div className="flex gap-[2vw] items-start">
            <div className="flex-shrink-0 w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] mt-[0.9vh]" style={{ minWidth: "0.4vw" }} />
            <p className="text-[2vw] text-[#111827] leading-[1.45]">
              No app, no push notification, no touchpoint between transactions — when customers are ready to buy again, they research independently and may not return to Signet
            </p>
          </div>
          <div className="flex gap-[2vw] items-start">
            <div className="flex-shrink-0 w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] mt-[0.9vh]" style={{ minWidth: "0.4vw" }} />
            <p className="text-[2vw] text-[#111827] leading-[1.45]">
              Diamond Bond plans lapse silently when customers forget the 6-month inspection requirement — associates only find out when the customer arrives to file a replacement claim
            </p>
          </div>
          <div className="flex gap-[2vw] items-start">
            <div className="flex-shrink-0 w-[0.4vw] h-[0.4vw] rounded-full bg-[#5B21B6] mt-[0.9vh]" style={{ minWidth: "0.4vw" }} />
            <p className="text-[2vw] text-[#111827] leading-[1.45]">
              Without a digital relationship, Signet cannot see purchase intent, cannot prevent plan lapses, and cannot identify the customers most likely to buy right now
            </p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto pt-[2vh] border-t border-[#E5E7EB]">
          <p className="text-[1.3vw] text-[#9CA3AF]">DiaGe · Confidential · June 2026</p>
          <p className="text-[1.3vw] text-[#9CA3AF]">3 / 13</p>
        </div>
      </div>
    </div>
  );
}
