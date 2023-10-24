"use client";

export const swipeablePageStyles = (palette, direction) => ({
  position: "sticky",
  top: "0px",
  mt: "calc(calc(var(--navbar-height) * -1) - 8px)",
  height: "100dvh",
  maxWidth: "100dvw",
  display: "flex",
  alignItems: "center",
  gap: 2,
  zIndex: -1,
  color: palette[9],
  // [direction === "left" ? "borderRight" : "borderLeft"]: `2px solid`,
  borderColor: palette[3],
  justifyContent: "center",
  "& .MuiIcon-root": {
    fontSize: "40px!important",
    fontVariationSettings:
      '"FILL" 0, "wght" 200, "GRAD" 0, "opsz" 40!important',
  },
});
