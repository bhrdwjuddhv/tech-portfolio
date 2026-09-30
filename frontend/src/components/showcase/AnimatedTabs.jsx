import { useState } from "react";
const tabs = ["All", "Discounted", "Free"];
import { motion } from "motion/react";
export default function AnimatedTab() {
  const [selected, setSelected] = useState(tabs[0]);
  const [hoveredTab, setHoveredTab] = useState(null);
  return (
    <div className="bg-white flex  p-1 max-w-xs w-full relative rounded-2xl border border-neutral-200">
      {tabs.map((tab) => {
        const isHovered = hoveredTab === tab;
        const isSelected = selected === tab;

        return (
          <div
            key={tab}
            className="relative flex-1"
            onMouseEnter={() => setHoveredTab(tab)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {(isHovered || isSelected) && (
              <motion.div
                layoutId="tab-background"
                className="absolute inset-0 rounded-2xl bg-neutral-100"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 70,
                }}
              />
            )}

            <button
              className={`relative z-10 w-full font-medium ${isSelected ? "text-neutral-950" : "text-neutral-500"} ${isHovered ? "text-neutral-800" : "text-neutral-500"} rounded-2xl py-3`}
              onClick={() => setSelected(tab)}
            >
              {tab}
            </button>
          </div>
        );
      })}
    </div>
  );
}
