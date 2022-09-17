import Badge from "@mui/material/Badge";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import { colors } from "../../lib/colors";
import Icon from "@mui/material/Icon";
import Snackbar from "@mui/material/Snackbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import dayjs from "dayjs";
import hexToRgba from "hex-to-rgba";
import { useRouter } from "next/router";
import React from "react";

/**
 * Bottom navigation bar
 * @param {any} {maintenance}
 * @returns {any}
 */
export function BottomNav({ maintenance }: any) {
  const trigger = useScrollTrigger({
    threshold: 0,
    target: window ? window : undefined,
  });

  const styles = {
    "&:not(.Mui-selected)": {
      color:
        (global.theme === "dark" ? "#ccc" : colors[themeColor]["800"]) +
        "!important",
    },
    "&.Mui-selected": {
      color: global.theme === "dark" ? "#ccc" : colors[themeColor]["900"],
      fontWeight: "700",
      background: "transparent !important",
    },
    "&.Mui-selected .MuiIcon-root": {
      background:
        global.theme == "dark" ? "hsl(240, 11%, 30%)" : colors[themeColor][200],
    },
    "&.Mui-selected .MuiIcon-root::before": {
      background:
        global.theme === "dark"
          ? "rgba(150, 150, 150, .2)"
          : colors[themeColor][200],
      transform: "translateX(-50%)",
    },
    borderRadius: "15px",
    px: "0!important",

    maxHeight: { sm: "70px" },
    maxWidth: { xs: "25vw!important" },
    minWidth: { xs: "25vw!important" },
    width: { xs: "20vw!important" },
    mr: "-1px",
    "& span:not(.MuiIcon-root, .MuiTouchRipple-root, .MuiTouchRipple-root *)": {
      fontSize: "13px!important",
      maxWidth: "70px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    "& .MuiIcon-root": {
      fontSize: "23px",
      height: "33px",
      transition: "margin .3s!important",
      mb: trigger ? 0.6 : 0.3,
      mt: 0.1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent!important",
      textAlign: "center",
      position: "relative",
      width: "80%",
      maxWidth: "90px",
    },
    "& .MuiIcon-root::before": {
      content: '""',
      display: "block",
      borderRadius: "9999px",
      width: "80%",
      height: "100%",
      left: "50%",
      background: "transparent",
      transition: "transform .2s",
      transform: "translate(-50%) scaleX(.8)",
      position: "absolute",
      zIndex: "-1",
    },
    py: 0.5,
  };

  const router = useRouter();
  const [value, setValue] = React.useState<number>(0);

  React.useEffect(() => {
    const url = router.asPath;

    switch (url) {
      case "/dashboard":
        setValue(0);
        break;
      case "/trash":
      case "/items":
        setValue(1);
      case "/notes":
        setValue(2);
        break;
      case "/maintenance":
        setValue(3);
        break;
      default:
        if (router.asPath.includes("/rooms")) {
          setValue(1);
        } else {
          setValue(0);
        }
    }
  }, []);
  /**
   * Handles button click
   * @param {any} href
   * @returns {any}
   */
  const onLink = (href: any) => {
    router.push(href);
  };
  const matches = useMediaQuery("(max-height: 400px)");

  return (
    <>
      <Snackbar
        open={window && window.navigator.onLine === false}
        autoHideDuration={6000}
        onClose={() => {}}
        sx={{ mb: trigger ? 6.5 : 9, transition: "all .3s" }}
        message="You're offline. Please check your network connection."
      />
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          bottom: matches ? -100.1 : trigger ? -21 : 0,
          left: 0,
          transition: "bottom .3s",
          display: {
            xs: "block",
            md: "none",
          },
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          sx={{
            py: 0.5,
            px: "3px",
            height: "auto",
            alignItems: "center",
            backdropFilter: "blur(15px)",

            background:
              global.theme === "dark"
                ? "rgba(33,33,38,.7)"
                : hexToRgba(colors[themeColor][100], 0.9),

            ["@supports not (backdrop-filter: blur(15px))"]: {
              background: colors[themeColor][100],
            },
          }}
          // showLabels
          onChange={(event, newValue) => {
            router.events.on("routeChangeComplete", () => {
              setValue(newValue);
            });
            router.events.off("routeChangeComplete", () => {
              setValue(newValue);
            });
          }}
        >
          <BottomNavigationAction
            disableRipple
            sx={{
              ...styles,
            }}
            label="Home"
            onClick={() => onLink("/dashboard")}
            icon={
              <Icon
                baseClassName={
                  "material-symbols-" + (value == 0 ? "rounded" : "outlined")
                }
              >
                view_timeline
              </Icon>
            }
          />
          <BottomNavigationAction
            disableRipple
            sx={{
              ...styles,
            }}
            label="Items"
            onClick={() => onLink("/items")}
            icon={
              <Icon
                baseClassName={
                  "material-symbols-" + (value == 1 ? "rounded" : "outlined")
                }
              >
                category
              </Icon>
            }
          />
          <BottomNavigationAction
            disableRipple
            sx={{
              ...styles,
            }}
            label="Notes"
            onClick={() => onLink("/notes")}
            icon={
              <Icon
                baseClassName={
                  "material-symbols-" + (value == 2 ? "rounded" : "outlined")
                }
              >
                sticky_note_2
              </Icon>
            }
          />

          <BottomNavigationAction
            disableRipple
            sx={{
              ...styles,
            }}
            label={
              <span
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                Maintenance
              </span>
            }
            onClick={() => onLink("/maintenance")}
            icon={
              <Icon
                baseClassName={
                  "material-symbols-" + (value == 3 ? "rounded" : "outlined")
                }
                sx={{
                  overflow: "visible",
                }}
              >
                <Badge
                  component="div"
                  badgeContent={
                    maintenance
                      ? maintenance.filter((reminder) =>
                          dayjs(reminder.nextDue).isBefore(dayjs())
                        ).length
                      : 0
                  }
                  sx={{
                    "& .MuiBadge-badge": {
                      borderRadius: 2,
                      fontWeight: "400",
                    },
                  }}
                  color="error"
                >
                  handyman
                </Badge>
              </Icon>
            }
          />
        </BottomNavigation>
      </Box>
    </>
  );
}
