"use client";

import { addHslAlpha } from "@/lib/client/addHslAlpha";

export const authStyles = (palette) => ({
  footer: {
    display: "flex",
    position: { xs: "fixed", sm: "unset" },
    bottom: 0,
    zIndex: 99999,
    left: 0,
    p: { xs: 1, sm: 0 },
    width: { xs: "100vw", sm: "auto" },
  },
  heading: {
    mt: { xs: -10, sm: 0 },
    color: palette[11],
  },
  subheading: {
    mb: 2,
    color: palette[11],
    opacity: 0.9,
  },
  submit: {
    width: { xs: "100%", sm: "auto" },
    backdropFilter: "blur(2px)",
    background: palette[3],
    color: palette[12],
    "&:hover": {
      background: palette[4],
      color: palette[11],
    },
    "&:active": {
      background: palette[5] + "!important",
      color: palette[11],
    },
    "&:disabled": {
      opacity: 0.5,
    },
    borderRadius: 3,
    ml: { sm: "auto" },
    gap: 1,
    textTransform: "none",
    transition: "none",
  },
  input: {
    color: "red",
    mb: 1.5,
    "& input": {
      px: 3,
      color: palette[12] + " !important",
      "&::placeholder": {
        color: palette[11] + " !important",
      },
    },
    "& label": {
      pl: 1,
      color: palette[11] + " !important",
      opacity: 0.6,
    },
    "& label.Mui-focused": {
      color: "white",
      opacity: 1,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: palette[11] + " !important",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        background: addHslAlpha(palette[4], 0.6),
        borderColor: "transparent",
        borderRadius: 5,
      },
      "&:hover fieldset": {
        borderColor: { xs: "transparent", sm: palette[6] },
      },
      "&:active fieldset": {
        borderColor: { xs: palette[6] },
      },
      "&.Mui-focused fieldset": {
        borderColor: palette[7],
        background: "transparent",
      },
    },
  },
  container: {
    border: { sm: "2px solid" },
    background: addHslAlpha(palette[1], 0.2),
    backdropFilter: { sm: "blur(3px)" },
    borderColor: { sm: palette[6] },
    color: palette[12],
    borderRadius: { sm: 5 },
    top: 0,
    left: 0,
    position: { xs: "fixed", sm: "unset" },
    mx: "auto",
    width: { xs: "100dvw", sm: "450px" },
    maxWidth: "100dvw",
    overflowY: "auto",
    p: { xs: 2, sm: 5 },
    pt: { xs: 6, sm: 5 },
    height: { xs: "100dvh", sm: "auto" },
    mt: { sm: "auto" },
  },
  link: {
    textTransform: "none",
    mt: 1.5,
    py: 0,
    px: 1,
    float: "right",
    textAlign: "center",
    mx: "auto",
    transition: "none",
    color: palette[11],
    "&:hover": {
      color: palette[11],
    },
  },
});
