export const addHslAlpha = (hsl: string, alpha: number) =>
  hsl.replace(")", ", 0.5)").replace("hsl", "hsla");
