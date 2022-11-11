"use client";
import { colors } from "../../lib/colors";
import hex2rgba from "hex-to-rgba";
import React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

// Import Day.JS libraries
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import dynamic from "next/dynamic";

// const PWAPrompt: any = dynamic(() => import("react-ios-pwa-prompt"), {
//   ssr: false,
// });

import {
  createTheme,
  experimental_sx as sx,
  ThemeProvider,
} from "@mui/material/styles";

import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottomNav";

export function ClientLayout({ user, property, children }) {
  global.user = user;
  global.property = property;
  global.themeColor = user.color;
  global.theme = user.darkMode;
  // alert(user.darkMode);

  const theme = colors[user.color];

  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--theme",
      hex2rgba(theme[100], 0.5)
    );
    document.documentElement.style.setProperty(
      "--bgtheme",
      hex2rgba(theme[600], 0.3)
    );
    document.documentElement.style.setProperty("--bg", theme[900]);
  });

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
      mode: global.user.darkMode ? "dark" : "light",
      ...(global.user.darkMode && {
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

  return (
    <ThemeProvider theme={userTheme}>
      <Box
        sx={{
          display: "flex",
        }}
      >
        {/* <PWAPrompt
          copyBody="Add Carbon to your home screen to have easy access, recieve push notifications, and more!"
          copyTitle="Add Carbon to your home screen!"
        /> */}
        <Navbar />
        <Box
          sx={{
            width: { md: "90px" },
            flexShrink: { md: 0 },
          }}
        >
          <Sidebar />
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 90,
            p: 0,
            width: {
              sm: `calc(100% - 65px)`,
              md: `calc(100% - 90px)`,
            },
          }}
        >
          <Toolbar sx={{ mb: { sm: 2 } }} />
          <Box
            sx={{
              pt: { xs: 1.8, sm: 2 },
            }}
          >
            {children}
            <Toolbar />
          </Box>
          <BottomNav />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
