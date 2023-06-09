import * as colors from "@radix-ui/colors";

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
