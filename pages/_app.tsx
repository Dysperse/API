import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import NoSsr from "@mui/material/NoSsr";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import hex2rgba from "hex-to-rgba";
import Head from "next/head";
import Script from "next/script";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import useSWR from "swr";
import Layout from "../components/Layout";
import LoginPrompt from "../components/LoginPrompt";
import "../styles/globals.scss";
import "../styles/search.scss";
dayjs.extend(relativeTime);

function Render({
  data,
  Component,
  pageProps,
}: {
  data: any;
  Component: any;
  pageProps: any;
}) {
  global.user = data.user;
  const [theme, setTheme] = useState<"dark" | "light">(
    data.user.darkMode ? "dark" : "light"
  );
  const [themeColor, setThemeColor] = useState(data.user.color);

  global.theme = theme;
  global.themeColor = themeColor;

  global.setTheme = setTheme;
  global.setThemeColor = setThemeColor;

  if (data.user.darkMode) {
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute("content", "hsl(240, 11%, 10%)");
  }

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
      MuiChip: {
        styleOverrides: {
          root: {
            ...(global.theme === "dark" && {
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
            background:
              global.theme === "dark"
                ? "hsl(240, 11%, 30%)"
                : colors[themeColor]["A100"],
            color:
              global.theme === "dark"
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
        main: colors[themeColor][global.theme === "dark" ? "A200" : "800"],
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

  // find active property in the array of properties
  const selectedProperty =
    data.user.properties.find((property: any) => property.selected) ||
    data.user.properties[0];

  global.property = selectedProperty;

  // set CSS variable to <html>
  document.documentElement.style.setProperty(
    "--theme",
    hex2rgba(colors[themeColor]["700"], 0.15)
  );
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,user-scalable=no"
        />
        <title>Carbon: Your new home organizer</title>
      </Head>
      <ThemeProvider theme={userTheme}>
        <Box
          sx={{
            "& *::selection": {
              color: "#fff!important",
              background: colors[themeColor]["A700"] + "!important",
            },
          }}
        >
          <Toaster />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Box>
      </ThemeProvider>
    </>
  );
}

function useUser() {
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

function RenderApp({ router, Component, pageProps }: any) {
  const { data, isLoading, isError } = useUser();

  return (
    <>
      {router.pathname === "/share/[index]" ||
      router.pathname === "/scan" ||
      router.pathname === "/canny-auth" ||
      router.pathname === "/onboarding" ? (
        <>
          <RenderComponent
            Component={Component}
            data={data}
            pageProps={pageProps}
          />
        </>
      ) : (
        <>
          {/* {isLoading && <>Loading...</>} */}
          {!isLoading &&
            !isError &&
            (data.user ? (
              <>
                {data.user.onboarding ? (
                  <>
                    <button
                      style={{ opacity: 0.4, border: 0, borderRadius: 3 }}
                      ref={(e) => e && e.click()}
                      onClick={() => {
                        router.push("/onboarding");
                      }}
                    >
                      Not redirecting? Click here
                    </button>
                  </>
                ) : (
                  <Render
                    Component={Component}
                    pageProps={pageProps}
                    data={data}
                  />
                )}
              </>
            ) : isError ? (
              <>An error occured</>
            ) : (
              <LoginPrompt />
            ))}
        </>
      )}
    </>
  );
}
function SmartlistApp({ router, Component, pageProps }: any): JSX.Element {
  return (
    <>
      {/* <Offline> */}
      {/* <OfflineBox /> */}
      {/* </Offline> */}
      <NoSsr>
        <RenderApp
          router={router}
          Component={Component}
          pageProps={pageProps}
        />
      </NoSsr>
      <Script src="/prevent-navigate-history.js"></Script>
    </>
  );
}

function RenderComponent({
  Component,
  pageProps,
  data,
}: {
  Component: any;
  pageProps: any;
  data: any;
}) {
  global.user = data;

  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}

export default SmartlistApp;
