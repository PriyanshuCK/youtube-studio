/**
 * Turns the brand `.woff2` files into a TypeScript module of base64 data URIs.
 *
 * The `.woff2` files in `fonts/` are the source of truth; `src/theme/fonts.data.ts` is generated
 * and checked in so the package stays source-only (no build step for consumers).
 *
 * Run: bun run --filter @webbraces/design-system fonts:embed
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fontsDir = join(root, "fonts");
const out = join(root, "src", "theme", "fonts.data.ts");

const constantName = (file) =>
  file
    .replace(/\.woff2$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toUpperCase();

const files = (await readdir(fontsDir)).filter((f) => f.endsWith(".woff2")).sort();

const entries = await Promise.all(
  files.map(async (file) => {
    const base64 = (await readFile(join(fontsDir, file))).toString("base64");
    return { file, name: constantName(file), base64 };
  }),
);

const body = entries
  .map(
    ({ file, name, base64 }) =>
      `/** ${file} — ${(base64.length / 1024).toFixed(1)} KB as base64. */\n` +
      `export const ${name} =\n  "data:font/woff2;base64,${base64}";`,
  )
  .join("\n\n");

await writeFile(
  out,
  `/**
 * GENERATED FILE — do not edit by hand.
 *
 * The brand faces, inlined as base64 data URIs so they are part of the bundle rather than
 * something fetched at render time. Regenerate with:
 *
 *   bun run --filter @webbraces/design-system fonts:embed
 *
 * Source of truth: packages/design-system/fonts/*.woff2
 */

${body}
`,
);

const total = entries.reduce((sum, e) => sum + e.base64.length, 0);
console.log(
  `Embedded ${entries.length} faces (${(total / 1024).toFixed(1)} KB base64) → src/theme/fonts.data.ts`,
);
