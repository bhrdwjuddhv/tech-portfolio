import { AnimatePresence, motion } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const AnimatedNumber = () => {
  const [count, setCount] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleAdd = () => {
    setDirection(1);
    setCount((prev) => prev + 1);
  };

  const handleMinus = () => {
    setDirection(-1);
    setCount((prev) => prev - 1);
  };

  return (
    <div className="bg-neutral-100 border border-neutral-100 items-center px-2 py-1 gap-2 justify-center rounded-lg flex">
      <button
        disabled={count <= 0}
        className="p-2 border disabled:opacity-50 border-neutral-50 text-neutral-800 bg-white active:bg-neutral-50 ring-1 ring-blue-50 rounded-md"
        onClick={handleMinus}
      >
        <Minus size={18} />
      </button>

      {/* Number */}
      <div className="relative w-6 h-6 overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={count}
            custom={direction}
            initial={{
              y: direction * 25,
              opacity: 0,
              filter: "blur(2px)",
            }}
            animate={{
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
            }}
            exit={{
              y: direction * -25,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
              damping: 5,
              stiffness: 80,
            }}
            className="absolute"
          >
            {count}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        className="p-2 border border-neutral-50 text-neutral-800 bg-white active:bg-neutral-50 ring-1 ring-blue-50 rounded-md"
        onClick={handleAdd}
      >
        <Plus size={18} />
      </button>
    </div>
  );
};

export default AnimatedNumber;
