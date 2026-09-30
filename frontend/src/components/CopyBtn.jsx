import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Copy01FreeIcons, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;

    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <AnimatePresence initial={false}>
      <motion.button
        key={Math.random()}
        initial={{
          scale: 0.8,
          filter: "blur(2px)",
        }}
        animate={{
          scale: 1,
          filter: "blur(0px)",
        }}
        onClick={handleCopy}
        className="hover:bg-white text-neutral-700 rounded-md p-1.5 transition-all"
        aria-label="Copy code"
      >
        <HugeiconsIcon icon={copied ? Tick02Icon : Copy01FreeIcons} size={18} />
      </motion.button>
    </AnimatePresence>
  );
}
