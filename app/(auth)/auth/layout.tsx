import { useUser } from "@/lib/client/session";
import { useColor } from "@/lib/client/useColor";
import { Box, useMediaQuery } from "@mui/material";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { AuthBranding } from "./branding";

/**
 * Layout for the app, including navbar, sidenav, etc
 * @param children Children
 * @returns JSX.Element
 */
export default function Layout({ children }): JSX.Element {
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const palette = useColor("violet", isDark);
  const { data, isLoading, isError } = useUser();

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        sx={{
          background: palette[1],
          position: "fixed",
          top: 0,
          left: 0,
          overflow: "scroll",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Toaster />
        <AuthBranding />
        {children}
      </Box>
    </>
  );
}
