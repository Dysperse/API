import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import Icon from "@mui/material/Icon";
import hexToRgba from "hex-to-rgba";
import { useRouter } from "next/router";
import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { Offline, Online } from "react-detect-offline";
import Snackbar from "@mui/material/Snackbar";

export function BottomNav() {
  const trigger = useScrollTrigger();

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
    maxWidth: { xs: "25vw!important", sm: "65px!important" },
    minWidth: { xs: "25vw!important", sm: "65px!important" },
    width: { xs: "20vw!important", sm: "65px!important" },
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
  let v: any = router.asPath;
  switch (router.asPath) {
    case "/dashboard":
      v = 0;
      break;
    case "/finances":
      v = 1;
      break;
    case "/save-the-planet":
      v = 3;
      break;
    case "/trash":
    case "/items":
      v = 1;
      break;
    default:
      if (router.asPath.includes("/rooms")) {
        v = 1;
      } else {
        v = 0;
      }
  }
  const [value, setValue] = React.useState(v);

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
          bottom: matches ? -101 : trigger ? -20 : 0,
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
                ? "rgba(23,23,28,.7)"
                : hexToRgba(colors[themeColor][100], 0.7),

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
            sx={{
              ...styles,
            }}
            label="Finances"
            onClick={() => onLink("/finances")}
            icon={
              <Icon
                baseClassName={
                  "material-symbols-" + (value == 2 ? "rounded" : "outlined")
                }
              >
                local_mall
              </Icon>
            }
          />

          <BottomNavigationAction
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
                Sustainability
              </span>
            }
            onClick={() => onLink("/save-the-planet")}
            icon={
              <Icon
                baseClassName={
                  "material-symbols-" + (value == 3 ? "rounded" : "outlined")
                }
              >
                eco
              </Icon>
            }
          />
        </BottomNavigation>
      </Box>
    </>
  );
}
