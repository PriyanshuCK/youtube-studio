import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
/** Every WebBraces video is 1920×1080 @ 30fps. */
Config.setConcurrency(null);
