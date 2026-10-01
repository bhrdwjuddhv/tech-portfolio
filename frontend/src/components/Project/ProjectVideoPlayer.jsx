import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

// Autoplaying, muted demo loop. Falls back to a placeholder when there's no video
// or the file can't be loaded (e.g. the path is set but the .mp4 isn't added yet).
export default function ProjectVideoPlayer({ src, poster }) {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const failed = !src || status === "error";

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      {failed ? (
        <div className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
          Demo video coming soon
        </div>
      ) : (
        <>
          {status === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-xs">
              <Spinner className="size-6 text-neutral-500 animate-spin" />
            </div>
          )}
          <video
            autoPlay
            muted
            loop
            playsInline
            src={src}
            poster={poster}
            onCanPlay={() => setStatus("ready")}
            onWaiting={() => setStatus("loading")}
            onPlaying={() => setStatus("ready")}
            onError={() => setStatus("error")}
            className="w-full h-full object-cover"
          />
        </>
      )}
    </div>
  );
}
