import { loadFont } from "@remotion/fonts";
import { continueRender, delayRender, staticFile } from "remotion";

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

const handle = delayRender("Loading WebBraces brand fonts");

export const fontsReady: Promise<unknown> = Promise.all(
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
  .then((loaded) => {
    continueRender(handle);
    return loaded;
  })
  .catch((err: Error) => {
    throw new Error(
      `Could not load the WebBraces brand fonts. Check that public/fonts/ exists in this ` +
        `video project (copy it from videos/_template/). Original error: ${err.message}`,
    );
  });
