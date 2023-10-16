import { addHslAlpha } from "@/lib/client/addHslAlpha";


export const buttonStyles = (palette, condition: boolean) => ({
    cursor: { sm: "unset!important" },
    transition: "transform .1s !important",
    gap: 1.5,
    py: { xs: 1, sm: 0.8 },
    px: { xs: 2, sm: 1.5 },
    mr: 1,
    mb: { xs: 0.5, sm: 0.3 },
    width: "100%",
    fontSize: "15px",
    justifyContent: "flex-start",
    borderRadius: 4,
    "&:hover, &:focus": {
      background: {
        xs: "transparent!important",
        sm: addHslAlpha(palette[4], 0.5) + "!important",
      },
    },
    "&:active": {
      background: addHslAlpha(palette[4], 0.5) + "!important",
    },
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    ...(!condition
      ? {
          color: addHslAlpha(palette[12], 0.7),
          "&:hover": {
            background: addHslAlpha(palette[4], 0.5),
          },
        }
      : {
          color: palette[12],
          background: addHslAlpha(palette[6], 0.5),
          "&:hover, &:focus": {
            background: addHslAlpha(palette[7], 0.5),
          },
        }),
  });

export const taskStyles = (palette) => {
  return {
    divider: {
      mt: 1,
      mb: 2,
      width: { sm: "90%" },
      mx: "auto",
      opacity: 0.5,
    },
    subheading: {
      my: { xs: 1, sm: 1.5 },
      mt: { xs: 1, sm: 1 },
      textTransform: "uppercase",
      fontWeight: 700,
      opacity: 0.5,
      fontSize: "13px",
      px: 1.5,
      color: palette[12],
      userSelect: "none",
    },
    appBar: {
      position: "fixed",
      top: "10px",
      borderRadius: 999,
      left: "50%",
      width: "calc(100vw - 20px)",
      transform: "translateX(-50%)",
      mx: "auto",
      zIndex: 999,
      height: 55,
      px: 0,
      "& .MuiToolbar-root": {
        px: 1,
      },
      transition: "all .4s",
      border: 0,
      background: addHslAlpha(palette[2], 0.9),
    },
    menu: {
      transition: "transform .2s",
      "&:active": { transform: "scale(0.95)" },
      position: "fixed",
      bottom: {
        xs: "70px",
        sm: "30px",
      },
      left: "10px",
      zIndex: 9,
      background: addHslAlpha(palette[3], 0.9),
      backdropFilter: "blur(10px)",
      border: "1px solid",
      borderColor: addHslAlpha(palette[3], 0.5),
      fontWeight: "700",
      display: { sm: "none" },
      fontSize: "15px",
      color: palette[12],
    },
  };
};
