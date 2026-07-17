import { Config } from "@remotion/cli/config";
// Deliberately a relative path, not "@webbraces/design-system": the CLI evaluates this file in
// its own Node process, outside the workspace, where the package name does not resolve. The
// relative path gets bundled, so the tokens stay the single source of truth either way.
import { delivery } from "../../packages/design-system/src/tokens/spacing";

/**
 * WebBraces delivery format: 3840×2160 @ 60fps.
 *
 * The composition is 1920×1080 (see the `layout` tokens); `setScale(2)` renders it at twice the
 * density, which is a real 4K master because every pixel we ship is vector — DOM text, SVG,
 * borders. Studio previews at 1080p, which keeps scrubbing fast; only the render is 4K.
 *
 * Every video inherits this by copying this folder. Change it here and in the `delivery` tokens,
 * not per video.
 */
Config.setScale(delivery.scale);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(null);
/** Flat colour and text — banding shows long before compression artefacts do. */
Config.setCrf(delivery.crf);
Config.setPixelFormat("yuv420p");
