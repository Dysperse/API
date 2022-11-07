import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import NoSsr from "@mui/material/NoSsr";
import {
  createTheme,
  experimental_sx as sx,
  ThemeProvider,
} from "@mui/material/styles";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import hex2rgba from "hex-to-rgba";
import Head from "next/head";
import { NextRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import useSWR from "swr";
import Layout from "../components/Layout";
import { Error } from "../components/Layout/Error";
import { Loading } from "../components/Layout/Loading";
import { colors } from "../lib/colors";
import "../styles/globals.scss";
import "../styles/search.scss";
import { Property, Session } from "../types/session";
dayjs.extend(relativeTime);

/**
 * Main function, including layout and theme.
 * @param data User session data
 * @param Component Top-level page component
 * @param pageProps Page props
 * @param router Next.JS router
 * @returns JSX.Element
 */
function Render({
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
  const [theme, setTheme] = useState<"dark" | "light">(
    data.user.darkMode ? "dark" : "light"
  );
  const [themeColor, setThemeColor] = useState(data.user.color);
  const [loadingButton, setLoadingButton] = useState(false);

  const [itemLimitReached, setItemLimitReached] = useState(true);
  global.itemLimitReached = itemLimitReached;
  global.setItemLimitReached = setItemLimitReached;

  if (data.user.darkMode) {
    document
      .querySelector(`meta[name="theme-color"]`)
      ?.setAttribute("content", "hsl(240, 11%, 10%)");
  }

  global.user = data.user;
  global.theme = theme;
  global.themeColor = themeColor;
  global.setTheme = setTheme;
  global.setThemeColor = setThemeColor;

  useEffect(() => {
    if (data.user.darkMode) {
      document
        .querySelector(`meta[name="theme-color"]`)
        ?.setAttribute("content", "hsl(240, 11%, 10%)");
    }
  }, [data]);

  const userTheme = createTheme({
    components: {
      MuiPaper: {
        defaultProps: { elevation: 0 },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiMenu: {
        defaultProps: {
          BackdropProps: {
            sx: {
              opacity: "0!important",
            },
          },
        },
        styleOverrides: {
          root: sx({
            transition: "all .2s",
            "& .MuiPaper-root": {
              mt: 1,
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              ml: -1,
              borderRadius: "15px",
              minWidth: 180,
              background: global.user.darkMode
                ? colors[global.themeColor][900]
                : colors[global.themeColor][50],

              color: global.user.darkMode
                ? colors[global.themeColor][200]
                : colors[global.themeColor][800],
              "& .MuiMenu-list": {
                padding: "4px",
              },
              "& .MuiMenuItem-root": {
                "&:hover": {
                  background: global.user.darkMode
                    ? colors[global.themeColor][800]
                    : colors[global.themeColor][100],
                  color: global.user.darkMode
                    ? colors[global.themeColor][100]
                    : colors[global.themeColor][900],
                  "& .MuiSvgIcon-root": {
                    color: global.user.darkMode
                      ? colors[global.themeColor][200]
                      : colors[global.themeColor][800],
                  },
                },
                padding: "10px 15px",
                borderRadius: "15px",
                marginBottom: "1px",

                "& .MuiSvgIcon-root": {
                  fontSize: 25,
                  color: colors[global.themeColor][700],
                  marginRight: 1.9,
                },
                "&:active": {
                  background: global.user.darkMode
                    ? colors[global.themeColor][700]
                    : colors[global.themeColor][200],
                },
              },
            },
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 30%)",
            }),
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: "20px",
            fontSize: "14px",
            color: global.user.darkMode
              ? "hsl(240, 11%, 30%)"
              : colors[themeColor]["50"],
            background: global.user.darkMode
              ? "hsl(240, 11%, 90%)"
              : colors[themeColor]["900"],
            paddingLeft: "13px",
            paddingRight: "13px",
            paddingTop: "5px",
            paddingBottom: "5px",
          },
        },
      },
    },
    palette: {
      primary: {
        main: colors[themeColor][global.user.darkMode ? "A200" : "800"],
      },
      mode: theme,
      ...(theme === "dark" && {
        background: {
          default: "hsl(240, 11%, 10%)",
          paper: "hsl(240, 11%, 10%)",
        },
        text: {
          primary: "hsl(240, 11%, 90%)",
        },
      }),
    },
  });

  if (data.user.properties.length === 0) {
    return (
      <Box>
        You do not have any properties. You shouldn&apos;t be seeing this error.
        Please contact support.
      </Box>
    );
  }

  // find active property in the array of properties
  const selectedProperty =
    data.user.properties.find((property: Property) => property.selected) ||
    data.user.properties[0];

  global.property = selectedProperty;

  localStorage.setItem("propertyId", selectedProperty.propertyId);
  localStorage.setItem("accessToken", selectedProperty.accessToken);

  // set CSS variable to <html>
  document.documentElement.style.setProperty(
    "--theme",
    hex2rgba(colors[themeColor ?? "brown"]["100"], 0.5)
  );
  document.documentElement.style.setProperty(
    "--bgtheme",
    hex2rgba(colors[themeColor ?? "brown"]["50"], 0.8)
  );
  document.documentElement.style.setProperty("--bg", colors[themeColor][900]);

  return (
    <>
      <Head>
        <title>Carbon: Next-gen personal home inventory</title>
      </Head>
      <ThemeProvider theme={userTheme}>
        <Box>
          <Toaster />
          {window.location.pathname == "/onboarding" ? (
            <Component {...pageProps} />
          ) : data.user.onboardingComplete ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <LoadingButton
              ref={(i) => i && i.click()}
              loading={loadingButton}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => {
                setLoadingButton(true);
                router.push("/onboarding");
              }}
            >
              Click here if you&apos;re not being redirected
            </LoadingButton>
          )}
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
} {
  const url = "/api/user";
  const { data, error } = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

/**
 * Function to check whether to add a layout or not
 * @param router Next.JS router
 * @param Component Top-level page component
 * @param pageProps Page props
 * @returns JSX.Element
 */
function RenderApp({
  router,
  Component,
  pageProps,
}: {
  Component: typeof React.Component;
  pageProps: JSX.Element;
  router: NextRouter;
}) {
  const urlsToDisplayWithoutLayout = [
    "/share/[index]",
    "/invite/[id]",
    "/auth/reset-password/[id]",
    "/scan",
    "/signup",
    "/auth",
    "/canny-auth",
  ];
  const disableLayout =
    urlsToDisplayWithoutLayout.includes(router.pathname) ||
    router.pathname === "/canny-auth";

  const { data, isLoading, isError } = useUser();

  global.user = data;

  return disableLayout ? (
    <NoSsr>
      <Component {...pageProps} />
      <Toaster />
    </NoSsr>
  ) : (
    <>
      {isLoading && <Loading />}
      {isError && <Error />}
      {!isLoading && !isError && !data.error && (
        <Render
          router={router}
          Component={Component}
          pageProps={pageProps}
          data={data}
        />
      )}
      {!isLoading && !isError && !data.user && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress
            disableShrink
            ref={(i: any) => i && i.click()}
            onClick={() => {
              router.push("/auth");
            }}
          />
        </Box>
      )}
    </>
  );
}

/**
 * NoSsr wrapper to prevent server-side rendering
 * @param router Next.JS router
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
}): JSX.Element {
  return (
    <RenderApp router={router} Component={Component} pageProps={pageProps} />
  );
}

export default RenderRoot;
