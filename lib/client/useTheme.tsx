import { Grow, Slide } from "@mui/material";
import React from "react";
import { colors } from "../colors";
import { addHslAlpha } from "./addHslAlpha";
import { useColor } from "./useColor";

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Grow in={props.open} ref={ref} {...props} />;
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
      timeout={250}
      easing="cubic-bezier(0.4, 0, 0.2, 1)"
    />
  );
});

export const toastStyles = {
  style: {
    borderRadius: "25px",
    paddingLeft: "15px",
    background: "var(--toast-bg)",
    backdropFilter: "blur(10px)",
    color: "var(--toast-text)",
  },
  iconTheme: {
    primary: "var(--toast-solid)",
    secondary: "var(--toast-text)",
  },
};

export const useCustomTheme = ({ darkMode, themeColor }): any => {
  const palette = useColor(themeColor, darkMode);

  return {
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: ({ theme }) =>
            theme.unstable_sx({
              "& .MuiSnackbarContent-root": {
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                background: addHslAlpha(palette[3], 0.5),
                backdropFilter: "blur(10px)",
                fontWeight: 700,
                borderRadius: 95,
                px: 3,
                color: palette[12],
                "& .MuiIcon-root": {
                  color: palette[12],
                },
              },
            }),
        },
      },
      MuiSwipeableDrawer: {
        defaultProps: {
          onOpen: () => {},
          disableSwipeToOpen: true,
          disableBackdropTransition: true,
          keepMounted: false,
          ModalProps: { keepMounted: false },
        },
      },

      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: ({ theme }) =>
            theme.unstable_sx({
              position: "sticky",
              top: 0,
              left: 0,
              zIndex: 999,
              background: addHslAlpha(palette[1], 0.9),
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid",
              borderColor: addHslAlpha(palette[3], 0.9),
              color: darkMode ? "#fff" : "#000",
            }),
        },
      },
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
              color: darkMode ? "#fff" : "#000",
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
              transition: "none",
              cursor: "default",
              "&:hover": {
                color: { sm: palette[8] },
                background: {
                  sm: addHslAlpha(palette[4], 0.3),
                },
              },
              "&:active": {
                background: addHslAlpha(palette[4], 0.6),
                color: { sm: palette[9] },
              },
              "&:focus-visible": {
                boxShadow: darkMode
                  ? "0px 0px 0px 1.5px #fff !important"
                  : "0px 0px 0px 1.5px #000 !important",
              },
              "&:disabled": {
                cursor: "not-allowed!important",
                opacity: 0.5,
                color: palette[10],
              },
            }),
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          contained: ({ theme }) =>
            theme.unstable_sx({
              boxShadow: "none!important",
              background: `${palette[4]}!important`,
              color: palette[11],
              "&:hover": {
                background: { sm: `${palette[5]}!important` },
              },
              "&:active": {
                background: {
                  xs: `${palette[5]}!important`,
                  sm: `${palette[6]}!important`,
                },
              },
              "&:disabled": {
                cursor: "not-allowed!important",
                opacity: 0.5,
                color: palette[11],
              },
            }),
          outlined: ({ theme }) =>
            theme.unstable_sx({
              color: `${palette[12]}!important`,
              borderColor: palette[4],
              "&:hover": {
                borderColor: palette[3],
                background: palette[3],
              },
            }),

          text: {
            color: palette[11],
          },

          root: ({ theme }) =>
            theme.unstable_sx({
              gap: "10px",
              transition: "none!important",
              cursor: "default",
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
          autoComplete: "no",
          fullWidth: true,
          InputProps: {
            autoComplete: "no",
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgorund: addHslAlpha(palette[5], 0.4),
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
                  "&.Mui-disabled .MuiSwitch-thumb": {
                    color: !darkMode ? "hsl(240,11%,90%)" : colors.grey[600],
                  },
                },
                "&.Mui-focusVisible .MuiSwitch-thumb": {
                  color: "#33cf4d",
                  border: "6px solid #fff",
                },
                "&.Mui-disabled .MuiSwitch-thumb": {
                  color: !darkMode ? "hsl(240,11%,70%)" : colors.grey[600],
                },
                "&.Mui-disabled + .MuiSwitch-track": {
                  opacity: darkMode ? 0.3 : 1,
                },
              },
              "& .MuiSwitch-thumb": {
                boxSizing: "border-box",
                width: 22,
                height: 22,
              },
              "& .MuiSwitch-track": {
                borderRadius: 26 / 2,
                backgroundColor: !darkMode ? "#E9E9EA" : palette[3],
                opacity: 1,
                transition: "all .5s",
              },
            }),
        },
      },
      MuiModal: { defaultProps: { keepMounted: false } },
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
                color: palette[11],
                border: "1px solid",
                background: palette[2],
                borderColor: palette[3],
                "& .MuiMenu-list": {
                  p: 0.5,
                },
                "& .MuiMenuItem-root": {
                  gap: 2,
                  "&:focus-visible, &:hover": {
                    background: palette[3],
                    "& .MuiSvgIcon-root": {
                      color: palette[12],
                    },
                  },
                  px: 2,
                  borderRadius: "10px",
                  py: 1,
                  minHeight: 0,
                  cursor: "default",
                  "& .MuiSvgIcon-root": {
                    fontSize: 25,
                    background: palette[9],
                    marginRight: 1.9,
                  },
                  "&:active": {
                    background: palette[3],
                  },
                },
              },
            }),
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: ({ theme }) =>
            theme.unstable_sx({
              gap: 2,
            }),
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) =>
            theme.unstable_sx({
              borderRadius: 4,
              gap: 2,
              transition: "none",
              userSelect: "none",
              "&:hover": {
                cursor: "default",
                background: { sm: palette[2] },
              },
            }),
        },
      },
      MuiDialog: {
        defaultProps: {
          TransitionComponent: Transition,
          keepMounted: false,
        },
        styleOverrides: {
          paper: {
            borderRadius: "28px",
            border: "1px solid " + palette[2],
            background: palette[1],
            boxShadow: "none!important",
            filter:
              "drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) =>
            theme.unstable_sx({
              cursor: "default",
              boxShadow: "none!important",
              background: palette[3],
              borderColor: palette[4],
              "&:hover": {
                background: { sm: palette[4] + "!important" },
                borderColor: { sm: palette[5] },
              },
              "&:active": {
                background: palette[5],
                borderColor: palette[6],
              },
            }),
        },
      },
      MuiDrawer: {
        defaultProps: {
          elevation: 0,
          ModalProps: { keepMounted: false },
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
            height: "100dvh!important",
            overflow: "hidden!important",
          },
          paper: {
            boxShadow: "none !important",
            filter:
              "drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))",
            background: darkMode ? palette[1] : "#fff",
          },
        },
      },
      MuiTooltip: {
        defaultProps: {
          enterDelay: 0,
          arrow: true,
          disableInteractive: true,
        },
        styleOverrides: {
          tooltip: ({ theme }) =>
            theme.unstable_sx({
              "& .MuiTooltip-arrow::before": {
                background: palette[11],
              },
              borderRadius: "5px",
              fontSize: "14px",
              color: palette[3],
              background: palette[11],
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
        main: palette[9],
      },
      secondary: {
        main: "#fff",
      },
      mode: darkMode ? "dark" : "light",
      background: {
        default: palette[1],
        paper: palette[1],
      },
      text: {
        primary: palette[12],
      },
    },
  };
};
