import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
const GooeySearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const buttonVariants = {
    collapsed: {
      width: 115,
      marginLeft: 0,
    },
    expanded: {
      width: 180,
      marginLeft: 50,
    },
  };
  const iconBubbleVariants = {
    collapsed: {
      scale: 0,
      opacity: 0,
      filter: "blur(4px)",
    },
    expanded: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
      setIsExpanded(true);
    } else {
      setSearchText("");
    }
  }, [isExpanded]);
  return (
    <>
      <SVG />
      <div
        style={{
          filter: "url(#gooey-filter)",
        }}
        className="relative flex h-10 items-center justify-center"
      >
        <motion.div
          variants={buttonVariants}
          initial="collapsed"
          transition={TRANSITION}
          animate={isExpanded ? "expanded" : "collapsed"}
          className="h-10 flex items-center justify-center "
        >
          <button className="h-10 w-full cursor-pointer items-center justify-center flex gap-2  rounded-full bg-black text-white font-normal px-4 ">
            {!isExpanded && <Search className="size-4" />}
            <motion.input
              layoutId="input"
              onClick={() => setIsExpanded(true)}
              ref={inputRef}
              onBlur={() => !searchText && setIsExpanded(false)}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search..."
              type="text"
              className="h-full w-full bg-transparent placeholder:font-light placeholder:text-white/50 outline-none"
            />
          </button>
        </motion.div>
        <motion.div
          layoutId="svg"
          variants={iconBubbleVariants}
          initial="collapsed"
          transition={TRANSITION}
          animate={isExpanded ? "expanded" : "collapsed"}
          className="absolute text-white rounded-4xl  top-1/2 left-0 size-10 bg-black -translate-y-1/2 items-center justify-center flex"
        >
          <Search className="size-4 " />
        </motion.div>
      </div>
    </>
  );
};
export default GooeySearch;
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
export const TRANSITION = {
  duration: 0.7,
  type: "spring",
  bounce: 0.22,
};
