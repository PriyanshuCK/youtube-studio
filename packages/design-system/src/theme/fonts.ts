import { loadFont } from "@remotion/fonts";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

/**
 * The three brand faces (design doc §2), loaded from the consuming video project's
 * `public/fonts/`. The design system cannot ship the files itself — `staticFile()` resolves
 * against the video project — so `videos/_template/public/fonts/` carries them and every
 * video copied from the template inherits them.
 *
 * JetBrains Mono is the variable file, declared across its full `wght` axis so 400 and 700
 * both render truly rather than being faux-bolded by the browser.
 */
const faces = [
  { family: "Clash Display", file: "ClashDisplay-600.woff2", weight: "600" },
  { family: "Satoshi", file: "Satoshi-400.woff2", weight: "400" },
  { family: "Satoshi", file: "Satoshi-500.woff2", weight: "500" },
  { family: "JetBrains Mono", file: "JetBrainsMono-Variable.woff2", weight: "100 800" },
] as const;

/**
 * Memoised on `globalThis` rather than in module scope, via `Symbol.for` so the key survives
 * however many times this module is instantiated.
 *
 * The bundle contains this module exactly once, but the *runtime* can evaluate it more than
 * once: the Studio's dev bundle re-executes modules on hot reload, and each evaluation used to
 * open its own `delayRender()` handle. Module scope is not a singleton here; the global registry
 * is. A plain `let` at module scope would be re-initialised alongside the handle it guards.
 */
const CACHE = Symbol.for("webbraces.fontsReady");

type FontCache = Record<symbol, Promise<void> | undefined>;

const load = (): Promise<void> => {
  const scope = globalThis as unknown as FontCache;

  const inFlight = scope[CACHE];
  if (inFlight) return inFlight;

  const handle = delayRender("Loading WebBraces brand fonts");

  const promise = Promise.all(
    faces.map(({ family, file, weight }) =>
      loadFont({
        family,
        url: staticFile(`fonts/${file}`),
        weight,
        format: "woff2",
        display: "block",
      }),
    ),
  )
    .then(() => {
      continueRender(handle);
    })
    .catch((err: Error) => {
      // cancelRender, never `throw`.
      //
      // Throwing here leaves the handle open, so Remotion's only symptom is "a delayRender()
      // was called but not cleared" ~28s later — an error that names the wrong problem, buries
      // the real one, and costs half a minute to even see. cancelRender fails the render now,
      // with the reason.
      cancelRender(
        new Error(
          `Could not load the WebBraces brand fonts. Check that public/fonts/ exists in this ` +
            `video project (copy it from videos/_template/). Original error: ${err.message}`,
        ),
      );
    });

  scope[CACHE] = promise;
  return promise;
};

export const fontsReady: Promise<void> = load();
