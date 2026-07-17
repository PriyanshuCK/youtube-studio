import { loadFont } from "@remotion/fonts";
import {
  CLASH_DISPLAY_600,
  JET_BRAINS_MONO_VARIABLE,
  SATOSHI_400,
  SATOSHI_500,
} from "./fonts.data";

/**
 * The three brand faces (design doc §2), embedded in the bundle as data URIs.
 *
 * They used to be fetched from each video's `public/fonts/` via `staticFile()`. Inlining them
 * means there is no request to make, nothing to 404, and no per-video copy of the binaries to
 * keep in sync — the design system owns the faces, which is what "source of truth" should have
 * meant all along. The cost is ~127 KB of base64 in the bundle, which is not a real cost.
 *
 * JetBrains Mono is the variable file, declared across its full `wght` axis so 400 and 700 both
 * render truly rather than being faux-bolded by the browser.
 *
 * `format` is passed explicitly because a data URI has no extension for `loadFont` to sniff.
 */
const faces = [
  { family: "Clash Display", data: CLASH_DISPLAY_600, weight: "600" },
  { family: "Satoshi", data: SATOSHI_400, weight: "400" },
  { family: "Satoshi", data: SATOSHI_500, weight: "500" },
  { family: "JetBrains Mono", data: JET_BRAINS_MONO_VARIABLE, weight: "100 800" },
] as const;

/**
 * Memoised on `globalThis` via `Symbol.for`, not in module scope.
 *
 * The bundle contains this module once, but the runtime can evaluate it more than once — the
 * Studio's dev bundle re-executes modules on hot reload. Module scope is not a singleton here;
 * the global registry is.
 */
const CACHE = Symbol.for("webbraces.fontsReady");

type FontCache = Record<symbol, Promise<void> | undefined>;

/**
 * Note what this deliberately does NOT do: open a `delayRender()` handle.
 *
 * `loadFont()` already opens and clears one per face, and `cancelRender()`s if a face fails —
 * so the render already waits, and already reports the truth. Wrapping it in a second handle
 * added no guarantee and one more thing to leak, which is exactly what it did: on hot reload the
 * wrapper's handle went uncleared and every render died 28 seconds later complaining about a
 * `delayRender()` that was never the problem.
 */
const load = (): Promise<void> => {
  const scope = globalThis as unknown as FontCache;

  const inFlight = scope[CACHE];
  if (inFlight) return inFlight;

  const promise = Promise.all(
    faces.map(({ family, data, weight }) =>
      loadFont({ family, url: data, weight, format: "woff2", display: "block" }),
    ),
  ).then(() => undefined);

  scope[CACHE] = promise;
  return promise;
};

export const fontsReady: Promise<void> = load();
