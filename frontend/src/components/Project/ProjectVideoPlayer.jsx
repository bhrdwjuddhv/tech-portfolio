import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function ProjectVideoPlayer({ src }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-xs">
          <Spinner className="size-6 text-neutral-500 animate-spin" />
        </div>
      )}
      {src ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          src={src}
          onCanPlay={() => setIsLoading(false)}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-xs text-neutral-400 font-mono">
          No video available
        </div>
      )}
    </div>
  );
}
