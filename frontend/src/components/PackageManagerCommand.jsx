import {
  CodeIcon,
  NpmIcon,
  PackageIcon,
  TerminalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import CopyButton from "@/components/CopyBtn";

const managers = ["pnpm", "yarn", "npm", "bun"];
const addVerb = { pnpm: "add", yarn: "add", npm: "install", bun: "add" };
const managerIcons = {
  pnpm: PackageIcon,
  yarn: TerminalIcon,
  npm: NpmIcon,
  bun: CodeIcon,
};

export default function PackageManagerCommand({ deps = "motion" }) {
  const [selected, setSelected] = useState("pnpm");

  const command = `${selected} ${addVerb[selected]} ${deps}`;

  return (
    <div className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-100 p-0.5 shadow-sm">
      <div className="flex items-center justify-between rounded-xl px-2 py-2">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          {managers.map((pkgManager) => {
            const icon = managerIcons[pkgManager];
            const isActive = selected === pkgManager;
            return (
              <button
                key={pkgManager}
                type="button"
                onClick={() => setSelected(pkgManager)}
                className={[
                  "relative flex items-center gap-1 rounded-md px-1.5 py-1 text-sm transition-colors",
                  isActive
                    ? "font-medium text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-700",
                ].join(" ")}
                aria-label={pkgManager}
              >
                <HugeiconsIcon
                  icon={icon}
                  size={15}
                  className={isActive ? "text-neutral-900" : "text-neutral-500"}
                />
                <span>{pkgManager}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-neutral-900" />
                )}
              </button>
            );
          })}
        </div>

        <CopyButton code={command} />
      </div>

      <div className="mx-[2px] mb-[2px] mt-1 rounded-xl border border-neutral-200 bg-white px-3 py-3 font-mono text-sm text-neutral-700">
        {command}
      </div>
    </div>
  );
}
