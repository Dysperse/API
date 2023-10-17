import { useMediaQuery } from "@mui/material";
import { useMemo } from "react";
import * as colors from "./themes";

/**
 * Returns a color palette.
 * @param base Base color from radix-ui/colors
 * @param dark True if dark mode
 * @returns Color palette
 */
export function useColor(
  base: keyof typeof colors,
  dark: boolean,
) {
  const getColorPalette = (isDark: boolean): Record<string, string> => {
    const paletteKey = isDark ? `${base}Dark` : base;
    const colorPalette = colors[paletteKey];
    const _colorPalette: Record<string, string> = {};

    for (const key in colorPalette) {
      if (key.includes(base)) {
        const index = parseInt(key.replace(base, ""));
        _colorPalette[index] = colorPalette[key];
      }
    }

    return _colorPalette;
  };

  return getColorPalette(dark);
}

/**
 * Returns true if system is dark, or if setting is dark.
 * @param setting Required. "light" | "dark" | "system"
 * @returns
 */
export function useDarkMode(setting: "light" | "dark" | "system"): boolean {
  const system = useMediaQuery("(prefers-color-scheme: dark)");

  return useMemo(() => {
    if (setting === "system") {
      return system;
    } else {
      return setting === "dark";
    }
  }, [setting, system]);
}
