import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Link01Icon } from "@hugeicons/core-free-icons";
import { Link } from "react-router";

const ProjectCard = ({
  name,
  type,
  slug,
  description,
  isActive,
  bgImage,
  projectImage,
  stack,
  link,
}) => {
  const active = isActive;

  return (
    <div className="w-full  justify-between  flex flex-col items-start group dark:bg-[#09090B] cursor-pointer   transition-all duration-200">
      {/* Thumbnail */}
      <div className="relative h-36 w-full dark:bg-neutral-900 bg-neutral-50  rounded-xl    -800   overflow-hidden ">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-background opacity-50" />
        <div className="absolute opacity-0 translate-y-5 scale-70 group-hover:scale-100 group-hover:blur-none  group-hover:opacity-100 group-hover:translate-y-0  transition duration-200 top-0 right-0 inset-0">
          <img
            loading="lazy"
            src={bgImage}
            alt={"Background1"}
            className="object-cover"
          />
        </div>
        <div className="absolute overflow-hidden transition duration-500 bg-gray-50 rounded-md bottom-0 translate-y-14 group-hover:translate-y-5 w-[75%]     -neutral-300 h-30 left-1/2 -translate-x-1/2">
          <img
            loading="lazy"
            src={projectImage}
            alt="fyyped"
            className="object-cover"
          />
        </div>
        {/* Animated label */}
        <span className="absolute top-2.5 dark:text-neutral-300 dark:group-hover:text-neutral-200 left-2.5 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300 text-xs text-neutral-500 group-hover:text-neutral-800 group-hover:bg-white group-hover:dark:bg-neutral-900    -transparent group-hover:  group-hover: -700 rounded-md group-hover:px-2.5 py-1 whitespace-nowrap">
          {type}
        </span>
      </div>

      {/* Body */}
      <div className="px-2 pt-3.5 pb-4 w-full">
        <div className="flex items-center justify-between mb-1">
          <div className="flex  items-center gap-3">
            {" "}
            <p className="text-lg relative  items-center flex gap-2 font-semibold text-neutral-900 dark:text-neutral-100">
              {name}
              <span className="h-0.5 left-0.4 bottom-0.5 w-0 transition-all duration-700  group-hover:w-full absolute  bg-neutral-500" />
            </p>
            {isActive ? (
              <Link target="_blank" to={link}>
                <HugeiconsIcon
                  icon={Link01Icon}
                  size={16}
                  className="text-neutral-600 hover:text-blue-500 transition duration-200 scale-0 group-hover:scale-100"
                />
              </Link>
            ) : null}
          </div>
          <span
            className={`text-[11px] flex items-center gap-1 justify-center  rounded-full ${isActive ? " text-emerald-700  dark:text-emerald-400" : "text-orange-500"}`}
          >
            <div className="w-3 h-3 relative">
              <div
                className={`w-3 h-3 animate-ping rounded-full  ${isActive ? "bg-green-300" : "bg-orange-200"}`}
              ></div>{" "}
              <div
                className={`absolute w-2 h-2 -translate-y-1/2 left-1/2 top-1/2 ${isActive ? "bg-green-500 " : "bg-orange-400"} rounded-full   -translate-x-1/2`}
              />
            </div>
            {active ? "Live" : "Building.."}
          </span>
        </div>
        <p className="text-xs text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition  mb-1">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2  w-full">
        <div className="flex ">
          {stack.length > 4 ? (
            <>
              {stack.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full  -2  -white  -900 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-medium text-neutral-500"
                  style={{ marginLeft: i === 0 ? 0 : -6 }}
                >
                  {item.icon}
                </div>
              ))}
              <div
                className="w-6 h-6 rounded-full  -2  -white  -900 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-medium text-neutral-500"
                style={{ marginLeft: -6 }}
              >
                +{stack.length - 4}
              </div>
            </>
          ) : (
            <>
              {stack.map((item, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full  -2  -white  -900 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-medium text-neutral-500"
                  style={{ marginLeft: i === 0 ? 0 : -6 }}
                >
                  {item.icon}
                </div>
              ))}
            </>
          )}
        </div>
        <Link to={`/projects/${slug}`}>
          <button
            aria-label="view-project-btn"
            className="flex group cursor-pointer items-center   gap-1 text-xs text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition duration-200 group/btn"
          >
            View Project
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="size-0 scale-0  group-hover:scale-100  group-hover:size-4 transition "
            />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
