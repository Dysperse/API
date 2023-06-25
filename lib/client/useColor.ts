import { useMediaQuery } from "@mui/material";
import * as colors from "@radix-ui/colors";

/**
 * Returns a color palette.
 * @param base Base color from radix-ui/colors
 * @param dark True if dark mode
 * @returns Color palette
 */
export function useColor(base: keyof typeof colors, dark: boolean) {
  const colorPalette = colors[dark ? `${base}Dark` : base];
  const _colorPalette = {};

  for (const key in colorPalette) {
    if (key.includes(base)) {
      const index = parseInt(key.replace(base, ""));
      _colorPalette[index] = colorPalette[key];
    }
  }

  return _colorPalette;
}

/**
 * Returns true if system is dark, or if setting is dark.
 * @param setting Required. "light" | "dark" | "system"
 * @returns
 */
export function useDarkMode(setting: "light" | "dark" | "system"): boolean {
  const system = useMediaQuery("(prefers-color-scheme: dark)");

  if (setting === "system") {
    return system;
  } else {
    return setting === "dark";
  }
}
