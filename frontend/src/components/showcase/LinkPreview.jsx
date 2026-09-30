import { motion } from "motion/react";
import { useRef, useState } from "react";
const LinkPreview = () => {
  const buttonRef = useRef(null);
  const [pos, setPos] = useState({ x: 0 });
  const [hover, setHover] = useState(false);
  const buttonMove = (e) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    setPos({ x });
  };
  return (
    <div className="relative w-fit">
      <motion.button
        ref={buttonRef}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={buttonMove}
        className="bg-white active:scale-95 transition hover:text-neutral-900 text-taupe-800 hover:bg-neutral-50/52 px-6 py-2 text-sm font-medium cursor-pointer rounded-md ring-1 ring-neutral-100 border border-neutral-100"
      >
        Portfolio
      </motion.button>
      <motion.img
        src="/cover-image.png"
        alt="preview-image"
        initial={{
          opacity: 0,
          scale: 0.4,
        }}
        animate={{
          opacity: hover ? 1 : 0,
          scale: hover ? 1.5 : 0.8,
          filter: hover ? "blur(0px)" : "blur(1px)",
          y: hover ? 22 : 12,
          skewX: hover ? 0 : -2,
        }}
        transition={{
          duration: 0.2,
        }}
        className="absolute ring-1.5 ring-neutral-300 rounded-[1px] pointer-events-none"
        style={{
          left: pos.x,
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
};
export default LinkPreview;
