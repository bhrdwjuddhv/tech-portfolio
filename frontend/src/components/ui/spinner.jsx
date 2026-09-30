import { cn } from "@/lib/utils";
import { LoaderCircle } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
function Spinner({ className, ...props }) {
  const { strokeWidth, ...svgProps } = props;

  return (
    <HugeiconsIcon
      icon={LoaderCircle}
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...svgProps}
      strokeWidth={strokeWidth === undefined ? undefined : Number(strokeWidth)}
    />
  );
}

export { Spinner };
