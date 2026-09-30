import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/motion-primitives/accordion";
import { Link } from "react-router";

function formatPeriod(start, end, isCurrent) {
  return `${start} – ${isCurrent ? "Present" : end}`;
}

const WorkExperience = ({ experience }) => {
  return (
    <div className="flex w-full flex-col gap-3">
      {experience.map((job) =>
        job.positions.map((pos) => {
          const { duration } = pos;
          const range = formatPeriod(
            pos.employmentPeriod.start,
            pos.employmentPeriod.end,
            job.isCurrentEmployer,
          );

          return (
            <Accordion
              key={pos.id}
              className="w-full focus-within:ring-1 ring-blue-500/20 overflow-hidden rounded-xl  border  border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950"
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              variants={{
                expanded: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
            >
              <AccordionItem value={pos.id} className="group">
                <AccordionTrigger className="w-full px-3 py-3 sm:px-4 flex flex-row items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Company Logo */}
                    <div className="w-9 h-9 rounded-lg    -zinc-200 dark: -zinc-800 overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 shrink-0">
                      <img
                        loading="lazy"
                        src={job.companyLogo}
                        alt={`${job.companyName} logo`}
                        className="object-contain w-6 h-6 sm:w-7 sm:h-7"
                      />
                    </div>

                    {/* Role & Company Details */}
                    <div className="text-left min-w-0 flex-1 flex flex-col">
                      <Link
                        target="_blank"
                        to={job.companyWebsite}
                        className="hover:underline decoration-zinc-400 underline-offset-2 block w-fit"
                      >
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-none truncate">
                          {job.companyName}
                        </p>
                      </Link>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 truncate">
                          {pos.title}
                        </span>
                        <span className="text-[10px] text-zinc-300 dark:text-zinc-700">
                          •
                        </span>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-500 font-medium shrink-0">
                          {duration}
                        </span>
                      </div>

                      {/* Mobile-only Date Range */}
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-0.5 sm:hidden shrink-0">
                        {range}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Date Range & Chevron */}
                  <div className="flex items-center gap-3 shrink-0 sm:ml-4">
                    <span className="hidden sm:inline text-[11px] font-medium text-zinc-400 dark:text-zinc-500 tabular-nums">
                      {range}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="px-4 pb-4 pt-1 sm:pl-12">
                    <ul className="space-y-2 list-none">
                      {pos.description
                        .split("\n")
                        .map((line) => line.replace(/^- /, "").trim())
                        .filter(Boolean)
                        .map((line, i) => (
                          <li
                            key={i}
                            className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed flex gap-2"
                          >
                            <span className="text-zinc-300 dark:text-zinc-700 mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-current" />
                            {line}
                          </li>
                        ))}
                    </ul>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-5">
                      {pos.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400    -zinc-200/50 dark: -zinc-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        }),
      )}
    </div>
  );
};

export default WorkExperience;
