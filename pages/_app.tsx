import { Analytics } from "@vercel/analytics/react";
import hex2rgba from "hex-to-rgba";
import Head from "next/head";
import { NextRouter } from "next/router";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import useSWR from "swr";
import Layout from "../components/Layout";
import { Error } from "../components/Layout/Error";
import { Loading } from "../components/Layout/Loading";
import { colors } from "../lib/colors";

// CSS files
import "../styles/globals.scss";

// Types
import { Property, Session } from "../types/session";

// Day.JS
import { Box, Button, createTheme, NoSsr, ThemeProvider } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AuthLoading } from "../components/Auth/AuthLoading";
import { useCustomTheme } from "../lib/useCustomTheme";
dayjs.extend(relativeTime);

/**
 * Main function, including layout and theme.
 * @param data User session data
 * @param Component Top-level page component
 * @param pageProps Page props
 * @param router Next.JS router
 * @returns JSX.Element
 */
function RenderWithLayout({
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
  const theme: "dark" | "light" =
    (typeof document !== "undefined" &&
      document.cookie.includes("dark=true")) ||
    data.user.darkMode
      ? "dark"
      : "light";
  const themeColor = data.user.color;

  global.user = data.user;
  global.themeColor = themeColor;

  useEffect(() => {
    if (data.user.darkMode) {
      document
        .querySelector(`meta[name="theme-color"]`)
        ?.setAttribute("content", "hsl(240, 11%, 10%)");
      document.cookie = "dark=true";
      document
        .querySelector(`link[rel="shortcut icon"]`)
        ?.setAttribute("href", "https://assets.dysperse.com/v6/dark.png");
    } else {
      document.cookie = "dark=false";
    }
  }, [data]);

  const userTheme = createTheme(
    useCustomTheme({
      darkMode: global.user.darkMode,
      themeColor: global.themeColor,
    })
  );

  // If theme is dark, add `.dark` class to body
  useEffect(() => {
    document.body.classList[global.user.darkMode ? "add" : "remove"]("dark");
  }, [theme]);

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

  global.property = selectedProperty;
  global.permission = selectedProperty.permission;

  // Used in `globals.scss`
  document.documentElement.style.setProperty(
    "--backdropTheme",
    global.user.darkMode
      ? "rgba(23, 23, 28, .4)"
      : hex2rgba(colors[themeColor ?? "brown"]["600"], 0.3)
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
                Click here if you&apos;re not being redirected
              </Button>
            )
          }
        </Box>
      </ThemeProvider>
    </>
  );
}

/**
 * Fetches user session data
 * @returns {any}
 */
function useUser(): {
  data: any;
  isLoading: boolean;
  isError: boolean;
  error: any;
} {
  const url = "/api/user";
  const { data, error } = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    error: error,
  };
}

/**
 * Function to check whether to add a layout or not
 * @param router Next.JS router
 * @param Component Top-level page component
 * @param pageProps Page props
 * @returns JSX.Element
 */
function RenderRoot({
  router,
  Component,
  pageProps,
}: {
  router: NextRouter;
  Component: typeof React.Component;
  pageProps: JSX.Element;
}) {
  const urlsToDisplayWithoutLayout = [
    "/share/[index]",
    "/invite/[id]",
    "/auth/reset-password/[id]",
    "/auth/reset-id",
    "/_offline",
    "/404",
    "/scan",
    "/signup",
    "/auth",
    "/auth/signup",
    "/canny-auth",
  ];
  const disableLayout =
    urlsToDisplayWithoutLayout.includes(router.pathname) ||
    router.pathname === "/canny-auth";

  const { data, isLoading, error, isError } = useUser();
  global.user = data;

  return disableLayout ? (
    <NoSsr>
      <Component {...pageProps} />
      <Toaster containerClassName="noDrag" />
    </NoSsr>
  ) : (
    <>
      <Analytics />
      {isLoading && <Loading />}
      {isError && <Error message={error} />}
      {!isLoading && !isError && !data.error && (
        <RenderWithLayout
          router={router}
          Component={Component}
          pageProps={pageProps}
          data={data}
        />
      )}
      {!isLoading && !isError && data.error && <AuthLoading />}
    </>
  );
}

export default RenderRoot;
