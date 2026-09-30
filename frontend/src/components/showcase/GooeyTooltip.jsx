import { motion } from "motion/react";
import { Plus, Upload } from "lucide-react";
import { useState, useRef } from "react";
export const SVG = () => {
  return (
    <svg className="absolute hidden h-0 w-0">
      <defs>
        <filter width="200%" height="200%" id="gooey-filter" x="-50%" y="-50%">
          {" "}
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0  0 20 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};

const NavItems = [
  { icon: Plus, tooltip: "Add to cart" },
  { label: "Share", icon: Upload, tooltip: "Copy link" },
  { label: "Projects", tooltip: "View Latests" },
];
const POP_TRANSITION = {
  duration: 0.7,
  type: "spring",
  bounce: 0.22,
};
const MOVE_TRANSITION = {
  duration: 0.2,
  type: "spring",
  bounce: 0.2,
};
const GooeyTooltip = () => {
  const [hoverIdx, setHoverIdx] = useState(null);
  const [isFresh, setIsFresh] = useState(true);
  const insideRef = useRef(false);
  const itemRefs = useRef([]);
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ x: 0 });
  const updatePosition = (idx) => {
    const item = itemRefs.current[idx];
    const container = containerRef.current;
    if (item && container) {
      const itemRect = item.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPos({ x: itemRect.left - containerRect.left + itemRect.width / 2 });
    }
  };
  const handleEnter = (idx) => {
    updatePosition(idx);
    setIsFresh(!insideRef.current); // fresh only if we weren't already inside
    insideRef.current = true;
    setHoverIdx(idx);
  };
  const handleLeaveGroup = () => {
    insideRef.current = false;
    setHoverIdx(null);
  };
  return (
    <>
      <SVG />
      <div
        ref={containerRef}
        style={{ filter: "url(#gooey-filter)" }}
        className="relative h-10 flex items-center gap-2 rounded-4xl"
        onMouseLeave={handleLeaveGroup}
      >
        <motion.div
          layout
          initial={{ scale: 0, opacity: 0, filter: "blur(1px)" }}
          animate={
            hoverIdx !== null
              ? {
                  scale: 1,
                  opacity: 1,
                  filter: "blur(0px)",
                  top: -45,
                  x: pos.x,
                }
              : { scale: 0, opacity: 0, filter: "blur(1px)", top: 0, x: pos.x }
          }
          transition={isFresh ? POP_TRANSITION : MOVE_TRANSITION}
          className="absolute z-0 -translate-x-1/2 whitespace-nowrap w-max py-1 px-4 bg-neutral-900 text-white rounded-md pointer-events-none"
        >
          {hoverIdx !== null ? NavItems[hoverIdx].tooltip : ""}
        </motion.div>

        {NavItems.map((nav, idx) => {
          const Icon = nav.icon;
          return (
            <div
              key={idx}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              onMouseEnter={() => handleEnter(idx)}
              className="relative flex items-center justify-center"
            >
              <motion.div className="relative gap-1 flex items-center justify-center z-10 p-3 bg-neutral-900 rounded-md text-white">
                {Icon && <Icon />} {nav.label}
              </motion.div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default GooeyTooltip;
