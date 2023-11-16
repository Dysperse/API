"use client";

export const swipeablePageStyles = (palette, direction) => ({
  position: "sticky",
  top: 0,
  left: 0,
  height: "100dvh",
  width: "100dvw",
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  flexDirection: "column",
  gap: 2,
  zIndex: 1,
  color: palette[9],
  borderRadius: 5,
  background: palette[2],
  borderColor: palette[3],
  pb: "calc(var(--navbar-height) + 20px)",
  justifyContent: "center",
  "& .MuiIcon-root": {
    fontSize: "40px!important",
    transition: "all .4s",
    fontVariationSettings:
      '"FILL" 0, "wght" 200, "GRAD" 0, "opsz" 40!important',
    "&.filled": {
      fontVariationSettings:
        '"FILL" 1, "wght" 200, "GRAD" 0, "opsz" 40!important',
    },
  },
});
