import { Link } from "react-router";
import { about, links } from "@/data/site";
import { HugeiconsIcon } from "@hugeicons/react";
import { FaMediumM } from "react-icons/fa";
import {
  NewTwitterIcon,
  CalendarsIcon,
  Linkedin02Icon,
  GithubIcon,
  Sent02Icon,
} from "@hugeicons/core-free-icons";
const About = () => {
  return (
    <div className="w-full">
      <div className="relative mx-auto w-full max-w-2xl flex-wrap mt-3 ">
        <h1 className="text-neutral-700 leading-5.5 sm:text-md  md:text-md">
          {about.intro}
        </h1>

        <div className="mt-2 text-neutral-700 leading-5.5 sm:text-md md:text-md">
          <p>
            {about.studioText}{" "}
            
          </p>
        </div>
        <p className="text-neutral-700 leading-5.5 sm:text-md  md:text-md">
          {about.highlight}
        </p>
        <div className="flex flex-wrap gap-2 mt-3.5">
          {/* {links.calLink && (
            <button
              aria-label="quick-chat"
              data-cal-namespace={links.calNamespace}
              data-cal-link={links.calLink}
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              className=" px-4 w-fit flex items-center active:scale-96 transition-all cursor-pointer justify-center gap-1.5 bg-zinc-900 dark:text-neutral-300 text-white text-[12px] font-medium py-2 rounded-md"
            >
              <HugeiconsIcon icon={CalendarsIcon} className="w-3.5 h-3.5" />
              Book a Meet
            </button>
          )}
          <Link to="/get-in-touch" className="flex-grow sm:flex-grow-0">
            <span className="grow sm:grow-0 px-4 flex items-center cursor-pointer justify-center gap-1.5  -700 dark:bg dark:-neutral-900 text-neutral-800   border-neutral-100 border group hover:text-blue-600 hover:bg-blue-50/10 active:scale-96 transition-all  text-[12px] font-medium py-2 rounded-md">
              <HugeiconsIcon
                icon={Sent02Icon}
                className="w-3.5 h-3.5 group-hover:text-blue-600 transition-all"
              />
              Send Message
            </span>
          </Link> */}
          <div className="flex  flex-grow items-center sm:flex-grow-0 gap-2">
            {" "}
            <a target="_blank" href={links.github} className="flex-1">
              <span className="w-full dark:bg-neutral-800  -900 cursor-pointer flex px-2 items-center justify-center gap-1.5 bg-white    -zinc-200 text-zinc-600 text-[12px] font-medium py-2 hover:bg-neutral-100  rounded-[10px]">
                <HugeiconsIcon size={18} icon={GithubIcon} />
              </span>
            </a>
            <a target="_blank" href={links.x} className="flex-1">
              <span
                aria-label="x-btn"
                className="w-full dark:bg-neutral-800  cursor-pointer hover:bg-neutral-100 flex px-2 items-center justify-center gap-1.5 bg-white     text-zinc-600 text-[12px] font-medium py-2 rounded-[10px]"
              >
                <HugeiconsIcon size={18} icon={NewTwitterIcon} />
              </span>
            </a>
            <a target="_blank" href={links.linkedin} className="flex-1">
              <span className="w-full dark:bg-neutral-800 hover:bg-neutral-100  cursor-pointer flex px-2 items-center justify-center gap-1.5 bg-white    -zinc-200 text-zinc-600 text-[12px] font-medium py-2 rounded-[10px]">
                <HugeiconsIcon size={18} icon={Linkedin02Icon} />
              </span>
            </a>
            <a target="_blank" href={links.medium} className="flex-1">
              <span
                aria-label="medium-btn"
                className="w-full dark:bg-neutral-800 hover:bg-neutral-100 cursor-pointer flex px-2 items-center justify-center gap-1.5 bg-white text-zinc-600 text-[12px] font-medium py-2 rounded-[10px]"
              >
                <FaMediumM size={17} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
