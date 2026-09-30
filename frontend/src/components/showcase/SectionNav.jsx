import { useEffect, useState } from "react";
import { motion } from "motion/react";
const sections = [
  { id: "home", label: "Home" },
  { id: "Conributions", label: "Conributions" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];
const MacosNavbar = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [activeSection, setActiveSection] = useState("Home");
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollableHeight = documentHeight - viewportHeight;

      if (scrollableHeight <= 0) {
        setScrollPercentage(0);
        return;
      }

      const percentage = Math.round((scrollY / scrollableHeight) * 100);

      setScrollPercentage(Math.min(100, Math.max(0, percentage)));
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    // Detect active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute("data-label") || "");
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    sections.forEach(({ id, label }) => {
      const section = document.getElementById(id);

      if (section) {
        section.setAttribute("data-label", label);
        observer.observe(section);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      observer.disconnect();
    };
  }, []);

  const radius = 10;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      layout
      transition={{
        layout: {
          type: "spring",
          stiffness: 400,
          damping: 30,
        },
      }}
      className=" z-50 flex py-2.5  ring-2 ring-neutral-700   w-fit  items-center justify-center gap-1 rounded-2xl bg-neutral-900 px-3.5   text-white"
    >
      <motion.div
        className="grid h-8 w-8 shrink-0 cursor-pointer relative place-items-center rounded-full bg-[#151515]"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      >
        <svg className="inset-0 h-full w-full   rotate-270" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r={radius}
            fill="none"
            stroke="#333"
            strokeWidth="3"
          />
          <motion.circle
            cx="16"
            cy="16"
            r={radius}
            fill="none"
            stroke="#1683ff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{
              strokeDashoffset:
                circumference - (circumference * scrollPercentage) / 100,
            }}
            transition={{
              duration: 0.15,
              ease: "linear",
            }}
          />
        </svg>
      </motion.div>

      <motion.p
        key={activeSection}
        initial={{ opacity: 0, y: 5, filter: "blur(3px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -5, filter: "blur(3px)" }}
        transition={{
          duration: 0.2,
          type: "spring",
          damping: 15,
          stiffness: 120,
        }}
      >
        {activeSection}
      </motion.p>
    </motion.div>
  );
};
export default MacosNavbar;
