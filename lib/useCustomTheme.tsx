import { Grow, Slide } from "@mui/material";
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

const DrawerTransition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return (
    <Slide
      in={props.open}
      ref={ref}
      {...props}
      easing="cubic-bezier(0.4, 0, 0.2, 1)"
    />
  );
});

export const toastStyles = {
  style: {
    borderRadius: "25px",
    paddingLeft: "15px",
    background: `hsla(240,11%,20%, 0.9)`,
    backdropFilter: "blur(10px)",
    color: `hsl(240,11%,90%)`,
  },
  iconTheme: {
    primary: `hsl(240,11%,90%)`,
    secondary: `hsl(240,11%,30%)`,
  },
};

export const useCustomTheme = ({ darkMode, themeColor }): any => {
  return {
    components: {
      MuiPaper: {
        defaultProps: { elevation: 0 },
      },
      MuiCircularProgress: {
        defaultProps: {
          disableShrink: true,
          thickness: 8,
          size: 24,
        },
        styleOverrides: {
          root: ({ theme }) =>
            theme.unstable_sx({
              animationDuration: ".5s",
              color: global.user.darkMode ? "#fff" : "#000",
              "& .MuiCircularProgress-circle": {
                // strokeLinecap: "round",
              },
            }),
        },
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
          root: ({ theme }) =>
            theme.unstable_sx({
              cursor: "unset",
              transition: "none",
              "&:hover": {
                color: darkMode ? "#fff" : "#000",
                background: {
                  sm: `${
                    darkMode ? "hsla(240,11%,25%, 0.2)" : "rgba(0,0,0,0.05)"
                  }`,
                },
              },
              "&:active": {
                background: `${
                  darkMode ? "hsla(240,11%,25%, 0.3)" : "rgba(0,0,0,0.1)"
                }`,
              },
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
            background: `${
              darkMode ? "hsl(240,11%,20%)" : colors[themeColor][100]
            }!important`,
            color: colors[themeColor][darkMode ? 50 : 900],
            "&:hover": {
              background: `${
                darkMode ? "hsl(240,11%,30%)" : colors[themeColor]["A100"]
              }!important`,
            },
            "&:disabled": {
              cursor: "not-allowed!important",
              opacity: 0.5,
              color: colors[themeColor][!darkMode ? 900 : 50],
            },
          },
          outlined: {
            color: `${colors[themeColor][darkMode ? 50 : 800]}!important`,
            borderColor:
              (!darkMode ? colors[themeColor][100] : "hsla(240,11%,80%,.5)") +
              "!important",
            "&:hover": {
              background: `${
                darkMode ? "hsl(240,11%,30%)" : colors[themeColor][50]
              }!important`,
              borderColor:
                (!darkMode ? colors[themeColor][100] : "hsla(240,11%,85%,.8)") +
                "!important",
            },
          },
          text: {
            color: `${colors[themeColor][darkMode ? 50 : 700]}`,
          },

          root: ({ theme }) =>
            theme.unstable_sx({
              gap: "10px",
              transition: "none!important",
              cursor: "unset",
              borderRadius: "999px",
              px: "30px",
              "&.MuiButton-sizeSmall": {
                px: "10px !important",
              },
              userSelect: "none",
              textTransform: "none",
            }),
        },
      },
      MuiTextField: {
        defaultProps: {
          autoComplete: "off",
          fullWidth: true,
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            ...(darkMode && {
              background: "hsla(240,11%,40%,0.4)",
            }),
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: ({ theme }) =>
            theme.unstable_sx({
              alignItems: "center",
              borderRadius: 5,
            }),
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: ({ theme }) =>
            theme.unstable_sx({
              width: 42,
              height: 26,
              padding: 0,
              "& .MuiSwitch-switchBase": {
                padding: 0,
                margin: "2px",
                transitionDuration: "300ms",
                "&.Mui-checked": {
                  transform: "translateX(16px)",
                  color: "#fff",
                  "& + .MuiSwitch-track": {
                    backgroundColor: darkMode ? "#2ECA45" : "#65C466",
                    opacity: 1,
                    border: 0,
                  },
                  "&.Mui-disabled + .MuiSwitch-track": {
                    opacity: 0.5,
                  },
                },
                "&.Mui-focusVisible .MuiSwitch-thumb": {
                  color: "#33cf4d",
                  border: "6px solid #fff",
                },
                "&.Mui-disabled .MuiSwitch-thumb": {
                  color: !darkMode ? "hsl(240,11%,10%)" : colors.grey[600],
                },
                "&.Mui-disabled + .MuiSwitch-track": {
                  opacity: !darkMode ? 0.7 : 0.3,
                },
              },
              "& .MuiSwitch-thumb": {
                boxSizing: "border-box",
                width: 22,
                height: 22,
              },
              "& .MuiSwitch-track": {
                borderRadius: 26 / 2,
                backgroundColor: !darkMode ? "#E9E9EA" : "hsl(240,11%,30%)",
                opacity: 1,
                transition: "all .5s",
              },
            }),
        },
      },
      MuiMenu: {
        defaultProps: {
          transitionDuration: 200,
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
          root: ({ theme }) =>
            theme.unstable_sx({
              transition: "all .2s",
              "& .MuiPaper-root": {
                mt: 1,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                ml: -1,
                borderRadius: "10px",
                minWidth: 180,
                color: darkMode ? colors[themeColor][200] : "#505050",
                border: "1px solid",
                background: darkMode
                  ? "hsl(240,11%,14%)!important"
                  : "#fff!important",
                borderColor: darkMode
                  ? "hsl(240,11%,20%)!important"
                  : "#eee!important",
                "& .MuiMenu-list": {
                  padding: "3px",
                },
                "& .MuiMenuItem-root": {
                  cursor: "unset",
                  gap: 2,
                  "&:focus-visible, &:hover": {
                    background: darkMode
                      ? "hsl(240,11%,30%)"
                      : "rgba(200,200,200,.3)",
                    color: darkMode ? colors[themeColor][100] : "#000",
                    "& .MuiSvgIcon-root": {
                      color: darkMode
                        ? colors[themeColor][200]
                        : colors[themeColor][800],
                    },
                  },
                  padding: "8.5px 12px",
                  minHeight: 0,
                  borderRadius: "10px",
                  marginBottom: "1px",
                  "& .MuiSvgIcon-root": {
                    fontSize: 25,
                    color: colors[themeColor][700],
                    marginRight: 1.9,
                  },
                  "&:active": {
                    background: darkMode ? "hsl(240,11%,35%)" : "#eee",
                  },
                },
              },
            }),
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) =>
            theme.unstable_sx({
              cursor: "unset!important",
              borderRadius: 4,
              userSelect: "none",
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
            border:
              "1px solid " +
              (darkMode ? "hsl(240,11%,20%)" : "rgba(200,200,200,.3)"),
            background: darkMode ? "hsl(240,11%,17%)" : "#fff",
            boxShadow: "none!important",
            filter:
              "drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            boxShadow: "none!important",
            ...(darkMode && {
              background: "hsla(240, 11%, 70%, .2)",
            }),
          },
        },
      },
      MuiDrawer: {
        defaultProps: {
          elevation: 0,
          TransitionComponent: DrawerTransition,
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
            background: darkMode ? "hsl(240, 11%, 15%)" : "#fff",
          },
        },
      } as any,
      MuiTooltip: {
        defaultProps: {
          enterDelay: 0,
          arrow: true,
        },
        styleOverrides: {
          tooltip: ({ theme }) =>
            theme.unstable_sx({
              "& .MuiTooltip-arrow::before": {
                background: darkMode
                  ? "hsl(240, 11%, 90%)"
                  : colors[themeColor]["100"],
              },
              borderRadius: "5px",
              fontSize: "14px",
              color: darkMode
                ? "hsl(240, 11%, 30%)"
                : colors[themeColor]["900"],
              background: darkMode
                ? "hsl(240, 11%, 90%)"
                : colors[themeColor]["100"],
              padding: "6px 14px",
              boxShadow:
                "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            }),
        },
      },
    },
    transitions: {
      duration: {
        enteringScreen: 300,
        leavingScreen: 300,
      },
    },
    MuiSwitch: {
      defaultProps: {
        focusVisibleClassName: ".Mui-focusVisible",
        disableRipple: true,
      },
      styleOverrides: {
        root: ({ theme }) =>
          theme.unstable_sx({
            width: 42,
            height: 26,
            padding: 0,
            "& .MuiSwitch-switchBase": {
              padding: 0,
              transitionDuration: "300ms",
              margin: "2px",
              "&.Mui-checked": {
                transform: "translateX(16px)",
                color: "#fff",
              },
              "&.Mui-focusVisible .MuiSwitch-thumb": {
                color: "#33cf4d",
                border: "6px solid #fff",
              },
              "&.Mui-disabled .MuiSwitch-thumb": {
                color: darkMode ? "hsl(240,11%,75%)" : colors.grey[600],
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                opacity: darkMode ? 0.7 : 0.3,
                ...(darkMode && {
                  background: "hsl(240,11%,15%)",
                }),
              },
            },
            "& .MuiSwitch-thumb": {
              boxSizing: "border-box",
              width: 22,
              height: 22,
            },
            "& .MuiSwitch-track": {
              borderRadius: 26 / 2,
              backgroundColor: !darkMode ? "#E9E9EA" : "#39393D",
              opacity: 1,
            },
          }),
      },
    },
    palette: {
      primary: {
        main: colors[themeColor][darkMode ? "A200" : "A700"],
      },
      mode: darkMode ? "dark" : "light",
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
