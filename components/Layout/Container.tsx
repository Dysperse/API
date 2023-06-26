import { useDarkMode } from "@/lib/client/useColor";
import { useCustomTheme } from "@/lib/client/useTheme";
import { Box, Button, ThemeProvider, createTheme } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect } from "react";
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
  const isDark = useDarkMode(data.user.darkMode);
  const themeColor = data.user.color;

  useEffect(() => {
    if (data.user.darkMode) {
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
      darkMode: isDark,
      themeColor: themeColor,
    })
  );

  // If theme is dark, add `.dark` class to body
  useEffect(() => {
    document.body.classList[isDark ? "add" : "remove"]("dark");
  }, [isDark]);

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

  const children = <Component {...pageProps} key={_router.asPath} />;

  return (
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
              onClick={() =>
                router.push(
                  router.query.next
                    ? `/onboarding?next=${router.query.next}`
                    : "/onboarding"
                )
              }
            >
              Tap if you&apos;re not being redirected
            </Button>
          )
        }
      </Box>
    </ThemeProvider>
  );
}
