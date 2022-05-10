import React, { useState } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import "../styles/global.css";
import useFetch from "react-fetch-hook";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LoginPrompt from "../components/LoginPrompt";
import * as colors from "@mui/material/colors";
import Box from "@mui/material/Box";

function Render({ data, Component, pageProps }: any) {
  global.session = data;
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [themeColor, setThemeColor] = useState<
    "red" | "green" | "blue" | "pink" | "purple" | "orange" | "teal" | "cyan"
  >(data.user.theme);
  global.theme = theme;
  global.setTheme = setTheme;
  global.themeColor = themeColor;
  global.setThemeColor = setThemeColor;

  const AppTheme = createTheme({
    components: {
      MuiPaper: {
        defaultProps: { elevation: 0 }
      }
    },
    palette: {
      primary: {
        main: colors[themeColor]["A700"]
      },
      mode: theme,
      ...(theme === "light"
        ? {}
        : {
            background: {
              default: "hsl(240, 11%, 10%)",
              paper: "hsl(240, 11%, 10%)"
            },
            text: {
              primary: "hsl(240, 11%, 90%)"
            }
          })
    }
  });

  return (
    <>
      <ThemeProvider theme={AppTheme}>
        <Box
          sx={{
            "& *::selection": {
              color: "#fff!important",
              background: colors[themeColor]["A700"] + "!important"
            }
          }}
        >
          {global.session && global.session.user ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : global.session ? (
            <LoginPrompt />
          ) : (
            ""
          )}
        </Box>
      </ThemeProvider>
    </>
  );
}

function SmartlistApp({ Component, pageProps }: any): JSX.Element {
  const { isLoading, data } = useFetch("/api/user", {
    method: "POST"
  });
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-180x180.png"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#fff" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@350;600;700;900&display=swap"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://fonts.sandbox.google.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@40,500,1,200"
        />
        <link href="/manifest.webmanifest" rel="manifest" />
        <link
          href="https://i.ibb.co/2snZjPZ/48x48-modified-1.png"
          rel="shortcut icon"
        />
        <title>Smartlist</title>
      </Head>
      {!isLoading && (
        <Render Component={Component} pageProps={pageProps} data={data} />
      )}
    </>
  );
}

export default SmartlistApp;
