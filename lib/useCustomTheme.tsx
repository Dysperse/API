import { Grow } from "@mui/material";
import { experimental_sx as sx } from "@mui/material/styles";
import React from "react";
import { colors } from "./colors";

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return (
    <Grow
      in={props.open}
      ref={ref}
      {...props}
      easing="cubic-bezier(.17,.67,.2,1.29)"
    />
  );
});

export const toastStyles = {
  style: {
    borderRadius: 99999,
    paddingLeft: "15px",
    background: colors[global.themeColor ?? "brown"][700],
    color: colors[global.themeColor ?? "brown"][50],
  },
  iconTheme: {
    primary: colors[global.themeColor ?? "brown"][50],
    secondary: colors[global.themeColor ?? "brown"][700],
  },
};

export const useCustomTheme = ({ darkMode, themeColor }): any => {
  return {
    components: {
      MuiPaper: {
        defaultProps: { elevation: 0 },
      },
      MuiIcon: {
        defaultProps: {
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
              boxShadow: darkMode
                ? "0px 0px 0px 1.5px hsl(240,11%,50%) !important"
                : "0px 0px 0px 1.5px var(--themeDark) !important",
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
            background: `${colors[themeColor][!darkMode ? 800 : 50]}!important`,
            color: colors[themeColor][!darkMode ? 50 : 800],
            "&:hover": {
              background: `${colors[themeColor][darkMode ? 100 : 900]}`,
            },
            "&:disabled": {
              background: `${
                colors[themeColor][darkMode ? 100 : 200]
              }!important`,
              cursor: "not-allowed!important",
              opacity: 0.7,
              color: colors[themeColor][!darkMode ? 900 : 50],
            },
          },
          outlined: {
            color: `${colors[themeColor][darkMode ? 50 : 800]}!important`,
            "&:hover": {
              background: `${
                colors[themeColor][!darkMode ? 100 : 900]
              }!important`,
            },
          },
          text: {
            color: `${colors[themeColor][darkMode ? 50 : 700]}`,
          },

          root: {
            gap: "10px",
            transition: "none",
            borderRadius: "999px",
            paddingLeft: "30px",
            paddingRight: "30px",
            textTransform: "none",
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          autoComplete: "off",
          fullWidth: true,
        },
      },
      MuiMenu: {
        defaultProps: {
          transitionDuration: 50,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          transformOrigin: { vertical: "top", horizontal: "center" },

          disableEnforceFocus: true,
          disableAutoFocusItem: true,
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
              borderRadius: "10px",
              minWidth: 180,
              background: darkMode
                ? "hsl(240,11%,20%)"
                : colors[themeColor][50],
              color: darkMode
                ? colors[themeColor][200]
                : colors[themeColor][800],
              "& .MuiMenu-list": {
                padding: "3px",
              },
              "& .MuiMenuItem-root": {
                gap: 2,
                "&:focus-visible, &:hover": {
                  background: darkMode
                    ? "hsl(240,11%,30%)"
                    : colors[themeColor][100],
                  color: darkMode
                    ? colors[themeColor][100]
                    : colors[themeColor][900],
                  "& .MuiSvgIcon-root": {
                    color: darkMode
                      ? colors[themeColor][200]
                      : colors[themeColor][800],
                  },
                },
                padding: "10px 15px",
                minHeight: 0,
                borderRadius: "10px",
                marginBottom: "1px",
                "& .MuiSvgIcon-root": {
                  fontSize: 25,
                  color: colors[themeColor][700],
                  marginRight: 1.9,
                },
                "&:active": {
                  background: darkMode
                    ? colors[themeColor][700]
                    : colors[themeColor][200],
                },
              },
            },
          }),
        },
      },
      MuiDialog: {
        defaultProps: {
          TransitionComponent: Transition,
        },
        styleOverrides: {
          paper: {
            borderRadius: "28px",
            background: darkMode ? "hsl(240,11%,12%)" : colors[themeColor][50],
            boxShadow: "none!important",
            filter:
              "drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            ...(darkMode && {
              background: "hsl(240, 11%, 20%)",
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
            borderRadius: "20px 20px 0 0",
            maxWidth: "500px",
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
            background: darkMode
              ? "hsl(240, 11%, 15%)"
              : colors[themeColor][50],
          },
        },
      } as any,
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: "5px",
            fontSize: "14px",
            color: darkMode ? "hsl(240, 11%, 30%)" : colors[themeColor]["900"],
            background: darkMode
              ? "hsl(240, 11%, 90%)"
              : colors[themeColor]["100"],
            padding: "5px 13px",
            boxShadow:
              "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          },
        },
      },
    },
    transitions: {
      duration: {
        enteringScreen: 250,
        leavingScreen: 250,
      },
    },
    palette: {
      primary: {
        main: colors[themeColor][darkMode ? "A200" : "A700"],
      },
      mode: theme,
      ...(darkMode && {
        background: {
          default: "hsl(240, 11%, 10%)",
          paper: "hsl(240, 11%, 10%)",
        },
        text: {
          primary: "hsl(240, 11%, 90%)",
        },
      }),
    },
  };
};
