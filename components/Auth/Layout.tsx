import { useUser } from "@/lib/client/session";
import { useColor } from "@/lib/client/useColor";
import { Logo } from "@/pages";
import { Box, useMediaQuery } from "@mui/material";
import Head from "next/head";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export const AuthBranding = ({ mobile = false }: any) => (
  <Box
    sx={{
      display: { xs: "inline-flex", sm: mobile ? "none" : "inline-flex" },
      color: "#000",
      [`@media (prefers-color-scheme: dark)`]: {
        color: "#fff",
        "& img": {
          filter: "invert(1)",
        },
      },
      alignItems: "center",
      gap: 2.5,
      userSelect: "none",
      mx: mobile ? 0 : 4,
      pr: 2,
      borderRadius: 4,
      mt: mobile ? -2 : 4,
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:active": {
        transform: "scale(0.95)",
        transitionDuration: "0s",
      },
    }}
    onClick={() => window.open("//dysperse.com")}
  >
    <Logo intensity={6} />
  </Box>
);

export const authStyles = (palette) => ({
  footer: {
    display: "flex",
    position: { xs: "fixed", sm: "unset" },
    bottom: 0,
    zIndex: 99999,
    left: 0,
    py: { xs: 1, sm: 0 },
    background: palette[3],
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
    background: palette[3],
    color: palette[12],
    borderRadius: { sm: 5 },
    top: 0,
    left: 0,
    "&, & *": {},
    position: { xs: "fixed", sm: "unset" },
    mx: "auto",
    maxWidth: "100vw",
    overflowY: "auto",
    width: { xs: "100vw", sm: "450px" },
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

/**
 * Layout for the app, including navbar, sidenav, etc
 * @param children Children
 * @returns JSX.Element
 */
export function Layout({ children }): JSX.Element {
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const palette = useColor("violet", isDark);
  const { data, isLoading, isError } = useUser();

  useEffect(() => {
    if (typeof window !== "undefined") {
      //  if (data && !isLoading && !isError) window.location.href = "/";
    }
  }, [data, isLoading, isError]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        sx={{
          background: palette[2],
          position: "fixed",
          top: 0,
          left: 0,
          overflow: "scroll",
          width: "100%",
          height: "100%",
        }}
      >
        <Toaster />
        <AuthBranding />
        {children}
      </Box>
    </>
  );
}
