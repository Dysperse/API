import {
  AccountStorageState,
  modifyAccountStorageHook,
} from "@/lib/client/useAccountStorage";
import { modifySessionHook } from "@/lib/client/useSession";
import { useCustomTheme } from "@/lib/client/useTheme";
import { Box, Button, ThemeProvider, createTheme } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Layout } from "../../pages/_app";

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
  data: any;
  Component: typeof React.Component;
  pageProps: JSX.Element;
  router: NextRouter;
}) {
  const _router = useRouter();

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
  if (data.properties.length === 0) {
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
    data.properties.find((property: any) => property.selected) ||
    data.properties[0];

  modifySessionHook(() => ({
    ...data,
    property: selectedProperty,
    permission: selectedProperty.permission,
    themeColor,
  }));

  const children = <Component {...pageProps} key={_router.asPath} />;

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
              <AnimatePresence
                mode="wait"
                initial={false}
                onExitComplete={() => window.scrollTo(0, 0)}
              >
                <Layout
                  key={
                    _router.asPath.includes("/tasks")
                      ? "/tasks"
                      : _router.asPath.includes("/settings")
                      ? "/settings"
                      : _router.asPath
                  }
                >
                  {children}
                </Layout>
              </AnimatePresence>
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
                onClick={() => router.push("/onboarding")}
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
