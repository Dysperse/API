import { Box, Button, createTheme, ThemeProvider } from "@mui/material";
import Head from "next/head";
import { NextRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  AccountStorageState,
  modifyAccountStorageHook,
} from "../../lib/client/useAccountStorage";
import { modifySessionHook } from "../../lib/client/useSession";
import { useCustomTheme } from "../../lib/client/useTheme";
import { colors } from "../../lib/colors";
import { Layout } from "../../pages/_app";
import { Property, Session } from "../../types/session";

/**
 * Main function, including layout and theme.
 * @param data User session data
 * @param Component Top-level page component
 * @param pageProps Page props
 * @param router Next.JS router
 * @returns JSX.Element
 */
export function RenderWithLayout({
  data,
  Component,
  pageProps,
  router,
}: {
  data: Session;
  Component: typeof React.Component;
  pageProps: JSX.Element;
  router: NextRouter;
}) {
  const theme: "dark" | "light" = data
    ? data.user.darkMode
      ? "dark"
      : "light"
    : window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  const themeColor = data.user.color;

  const [isReached, setIsReached]: any =
    useState<AccountStorageState>("loading");

  modifyAccountStorageHook(() => ({ isReached, setIsReached }));

  useEffect(() => {
    if (data.user.darkMode) {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", "hsl(240, 11%, 10%)");
      document
        .querySelector('link[rel="shortcut icon"]')
        ?.setAttribute(
          "href",
          "https://assets.dysperse.com/v6/dark-rounded.png"
        );
    }
  }, [data]);

  const userTheme = createTheme(
    useCustomTheme({
      darkMode: data.user.darkMode,
      themeColor: themeColor,
    })
  );

  // If theme is dark, add `.dark` class to body
  useEffect(() => {
    document.body.classList[data.user.darkMode ? "add" : "remove"]("dark");
  }, [theme, data.user.darkMode]);

  // Return an error if user doesn't have any properties attached to their account
  if (data.user.properties.length === 0) {
    return (
      <Box>
        Hmmm.... You find yourself in a strange place. You don&apos;t have
        access to any groups, or there are none in your account. Please contact
        support if this problem persists.
      </Box>
    );
  }

  // find active property in the array of properties
  const selectedProperty =
    data.user.properties.find((property: Property) => property.selected) ||
    data.user.properties[0];

  modifySessionHook(() => ({
    user: data.user,
    property: selectedProperty,
    permission: selectedProperty.permission,
    themeColor,
  }));

  // Used in `globals.scss`
  document.documentElement.style.setProperty(
    "--backdropTheme",
    data.user.darkMode ? "rgba(23, 23, 28, .4)" : "rgba(255,255,255,.3)"
  );
  document.documentElement.style.setProperty(
    "--themeDark",
    colors[themeColor ?? "brown"][900]
  );

  const children = <Component {...pageProps} />;

  return (
    <>
      <Head>
        <title>Dysperse</title>
      </Head>
      <ThemeProvider theme={userTheme}>
        <Box>
          <Toaster containerClassName="noDrag" />
          {
            // If the path is onboarding, show the onboarding page.
            window.location.pathname === "/onboarding" ? (
              children
            ) : data.user.onboardingComplete ? (
              // If the onboarding process is complete, show the app.
              <Layout>{children}</Layout>
            ) : (
              // If the onboarding process is not complete, redirect to the onboarding page.
              <Button
                ref={(i) => i && i.click()}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => {
                  router.push("/onboarding");
                }}
              >
                Tap if you&apos;re not being redirected
              </Button>
            )
          }
        </Box>
      </ThemeProvider>
    </>
  );
}
