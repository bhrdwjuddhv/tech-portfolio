import MagneticCard from "./MagneticCard";
const BentoCard = () => {
  return (
    <MagneticCard
      intensity={14}
      maxTilt={6}
      className="bg-[#b9dca2] scale-60 rounded-[24px] p-6 sm:p-7 flex flex-col justify-between shadow-[0_10px_30px_-10px_rgba(185,220,162,0.3)] group transition-shadow duration-300 hover:shadow-2xl min-h-[300px] cursor-pointer"
    >
      {/* Floating Metric Card */}
      <div
        className="bg-[#181d22] text-white rounded-2xl p-4 shadow-[0_12px_28px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:scale-101"
        style={{ transform: "translateZ(35px)" }}
      >
        <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
          <span>Efficiency Gain</span>
          <span className="text-emerald-400 font-mono font-semibold">
            +820%
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-white">
          $142,850
        </div>
        <div className="text-[10px] text-neutral-400 mt-2 flex items-center justify-between pt-2 border-t border-neutral-800">
          <span>Labor hours saved</span>
          <span className="text-white font-medium">3,420 hrs</span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-5" style={{ transform: "translateZ(25px)" }}>
        <h3 className="font-sans text-2xl sm:text-3xl text-[#1e4210] font-semibold tracking-tight">
          Operations ROI
        </h3>
        <p className="text-[#2b5917] text-xs sm:text-[13px] mt-1.5 leading-relaxed font-normal">
          Turn manual operational bottlenecks into measurable revenue gains and
          real cost savings.
        </p>
      </div>
    </MagneticCard>
  );
};

export default BentoCard;
