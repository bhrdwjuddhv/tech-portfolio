import { skills, certifications } from "@/data/skills";
import Badge from "@/components/Global/Badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons";

const Stack = () => {
  return (
    <div className=" -b w-full  -900  ">
      <div className="max-w-2xl  gap-3 flex flex-col w-full mx-auto mt-3">
        <div>
          <p className="text-md text-neutral-500 font-mono   uppercase">
            Skills
          </p>
        </div>
        <div className="flex justify-baseline flex-wrap  gap-2">
          {skills.map((item, index) => (
            <Badge key={index} name={item.name} icon={item.icon} />
          ))}
        </div>
        {certifications.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-2">
            <p className="text-md text-neutral-500 font-mono uppercase">
              Certifications
            </p>
            {certifications.map((c) => (
              <div
                key={c.name}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5"
              >
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {c.name}
                  <span className="text-neutral-400"> · {c.issuer}</span>
                </p>
                {c.credential && (
                  <a
                    href={c.credential}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Show credential for ${c.name} (opens in a new tab)`}
                    className="group inline-flex items-center gap-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:hover:border-neutral-600 dark:hover:text-neutral-100"
                  >
                    <HugeiconsIcon
                      icon={CheckmarkBadge01Icon}
                      size={14}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                    Show credential
                    <HugeiconsIcon
                      icon={ArrowUpRight01Icon}
                      size={13}
                      className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                    />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Stack;
