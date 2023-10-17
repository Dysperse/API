"use client";

export const authStyles = (palette) => ({
  footer: {
    display: "flex",
    position: { xs: "fixed", sm: "unset" },
    bottom: 0,
    zIndex: 99999,
    left: 0,
    py: { xs: 1, sm: 0 },
    background: palette[2],
    width: { xs: "100vw", sm: "auto" },
  },
  submit: {
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
    ml: "auto",
    mr: { xs: 1, sm: 0 },
    mt: { sm: 1 },
    gap: 1,
    textTransform: "none",
    transition: "none",
  },
  input: {
    color: "red",
    mb: 1.5,
    "& input": {
      color: palette[12] + " !important",
      "&::placeholder": {
        color: palette[11] + " !important",
      },
    },
    "& label": {
      color: palette[11] + " !important",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: palette[11] + " !important",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: palette[6],
      },
      "&:hover fieldset": {
        borderColor: palette[7],
      },
      "&.Mui-focused fieldset": {
        borderColor: palette[8],
      },
    },
  },
  container: {
    background: palette[2],
    color: palette[12],
    borderRadius: { sm: 5 },
    top: 0,
    left: 0,
    "&, & *": {},
    position: { xs: "fixed", sm: "unset" },
    mx: "auto",
    width: { xs: "100dvw", sm: "450px" },
    maxWidth: "100dvw",
    overflowY: "auto",
    p: { xs: 2, sm: 5 },
    mt: { sm: 5 },
    pt: { xs: 6, sm: 5 },
    height: { xs: "100dvh", sm: "auto" },
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
    color: palette[12],
    "&:hover": {
      color: palette[11],
    },
  },
});
