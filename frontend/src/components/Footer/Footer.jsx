import { useRef, useState } from "react";
import { motion } from "motion/react";


const Footer = ({ cn = "" }) => {
  const [isHovering, setisHovering] = useState(false);
  const div = useRef(null);

  return (
    <div
      className={`max-w-2xl relative gap-3 flex justify-between items-center  w-full mx-auto    ${cn ? `${cn}` : "relative"}`}
    >
      <div>
        <p className="text-xs font-mono text-neutral-900 dark:text-neutral-300 ">
          Uddhav Bhardwaj {new Date().getFullYear()}
        </p>
        <p className="text-xs font-mono text-neutral-900 dark:text-neutral-300 ">
          Built with Chai & ❤
        </p>
      </div>
    </div>
  );
};

export default Footer;
