"use client";
import { experimental_sx as sx } from "@mui/material/styles";
import Layout from "../components/Layout";
import { colors } from "../lib/colors";
import { Property } from "../types/session";

// CSS files
import "../styles/globals.scss";

// Types

// Day.JS
import { createTheme, NoSsr, ThemeProvider } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function ClientLayout({ children, session }) {
  const theme = session.user.darkMode ? "dark" : "light";
  const themeColor = session.user.color;

  global.session = session;
  global.user = session.user;
  global.theme = theme;
  global.themeColor = themeColor;

  //   Property shit

  const selectedProperty =
    session.user.properties.find((property: Property) => property.selected) ||
    session.user.properties[0];

  global.property = selectedProperty;
  global.permission = selectedProperty.permission;

  const userTheme = createTheme({
    components: {
      MuiPaper: {
        defaultProps: { elevation: 0 },
      },
      MuiIcon: {
        defaultProps: {
          // Replace the `material-icons` default value.
          baseClassName: "material-symbols-rounded",
        },
        variants: [
          {
            props: {
              className: "outlined",
            },
            style: {
              fontVariationSettings:
                '"FILL" 0, "wght" 350, "GRAD" 0, "opsz" 40!important',
            },
          },
        ],
      },
      MuiIconButton: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: sx({
            "&:focus-visible": {
              boxShadow: "0px 0px 0px 2px var(--themeDark) !important",
            },
          }),
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          contained: {
            boxShadow: "none!important",
            background:
              colors[themeColor][global.theme !== "dark" ? "800" : "50"] +
              "!important",
            color: colors[themeColor][global.theme !== "dark" ? "50" : "800"],
          },
          root: {
            "&.Mui-disabled": {
              background: "#eeeeee!important",
            },
            gap: "10px",
            transition: "none",
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
                gap: 2,
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
                minHeight: 0,
                borderRadius: "15px",
                marginBottom: "1px",

                "& .MuiSvgIcon-root": {
                  fontSize: 25,
                  color: colors[global.themeColor][700],
                  marginRight: 1.9,
                },
                "&:focus": {
                  background: "transparent!important",
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
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "28px",
            background: colors[global.themeColor][50],
            boxShadow: "none!important",
            filter:
              "drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))",
          },
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
      MuiDrawer: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          paperAnchorBottom: {
            bottom: "0vh!important",
            margin: "auto",
          },
          root: {
            height: "100vh!important",
            overflow: "hidden!important",
          },
          paper: {
            boxShadow: "none !important",
            filter:
              "drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))",
            background: global.user.darkMode
              ? "hsl(240, 11%, 15%)"
              : colors[global.themeColor][50],
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: "5px",
            fontSize: "14px",
            color: global.user.darkMode
              ? "hsl(240, 11%, 30%)"
              : colors[themeColor]["900"],
            background: global.user.darkMode
              ? "hsl(240, 11%, 90%)"
              : colors[themeColor]["100"],
            paddingLeft: "13px",
            paddingRight: "13px",
            paddingTop: "5px",
            paddingBottom: "5px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    palette: {
      primary: {
        main: colors[themeColor][global.user.darkMode ? "A200" : "A700"],
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
  return (
    <ThemeProvider theme={userTheme}>
      <NoSsr>
        <Layout>
          <p>bruh wtf</p>
        </Layout>
      </NoSsr>
    </ThemeProvider>
  );
}
