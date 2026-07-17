import { useVideoConfig } from "remotion";

/** Duration tokens are authored in milliseconds; the timeline runs in frames. */
export const msToFrames = (ms: number, fps: number) => (ms / 1000) * fps;
export const secToFrames = (sec: number, fps: number) => sec * fps;

/**
 * Parse a narration beat marker as written in the script (`"1:24"`, `"0:20"`, `"12"`) into
 * seconds. Scenes are blocked to the voiceover first, then eased — so timings live in the
 * script's own notation rather than in frame counts nobody can check against the script.
 */
export const parseTimecode = (tc: string | number): number => {
  if (typeof tc === "number") return tc;
  const parts = tc.split(":").map(Number);
  if (parts.some((p) => Number.isNaN(p))) {
    throw new Error(`Invalid timecode: ${tc}`);
  }
  return parts.reduce((acc, p) => acc * 60 + p, 0);
};

/** Frame-space helpers bound to the current composition's fps. */
export const useTiming = () => {
  const { fps } = useVideoConfig();
  return {
    fps,
    /** Milliseconds → frames. Use with the `duration` tokens. */
    ms: (value: number) => msToFrames(value, fps),
    /** Seconds → frames. */
    sec: (value: number) => secToFrames(value, fps),
    /** Script timecode (`"1:24"`) → frames. */
    at: (timecode: string | number) => secToFrames(parseTimecode(timecode), fps),
  };
};
