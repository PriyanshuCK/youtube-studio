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
 * Loads the brand faces once per page. Safe to call from any number of components.
 *
 * Note what this is NOT: a module-scope side effect. It used to run on import, which meant
 * `loadFont()` opened its `delayRender()` handles whenever the *bundle was evaluated* — including
 * in pages that were not rendering a frame at all. A handle created there belongs to no React
 * render and nothing is obliged to clear it; the Studio's render died 28s later naming a font
 * that had, in fact, already loaded fine in the preview.
 *
 * `<Theme>` calls this from the component lifecycle instead, where the handle is tied to an
 * actual render. Everything here is now lazy on purpose — importing this module does nothing.
 */
export const loadBrandFonts = (): Promise<void> => {
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
