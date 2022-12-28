import { useRouter } from "next/router";
import { Offline } from "react-detect-offline";
import { colors } from "../../lib/colors";
import Settings from "../Settings/index";
import { AppsMenu } from "./AppsMenu";
import { InviteButton } from "./InviteButton";
import { SearchPopup } from "./Search";

import {
  AppBar,
  Box,
  CssBaseline,
  Icon,
  IconButton,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { Achievements } from "./Achievements";
import { UpdateButton } from "./UpdateButton";

/**
 * Navbar component for layout
 * @returns {any}
 */
export function Navbar(): JSX.Element {
  const router = useRouter();
  const styles = {
    borderRadius: 94,
    p: 0.8,
    m: 0,
    color: global.user.darkMode ? "hsl(240,11%,90%)" : "#606060",
    transition: "opacity .2s",
    "&:hover": {
      background: "rgba(200,200,200,.3)",
      color: global.user.darkMode ? "hsl(240,11%,100%)" : "#000",
    },
    "&:active": {
      background: "rgba(200,200,200,.5)",
      transition: "none",
    },
  };

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        zIndex: 999,
        color: {
          xs: global.user.darkMode
            ? "white"
            : router.asPath === "/tidy"
            ? colors[themeColor][100]
            : "black",
          sm: global.user.darkMode ? "white" : "black",
        },
        pr: 0.4,
        height: "70px",
        transition: "box-shadow .2s",
        background: {
          xs: global.user.darkMode
            ? "rgba(23, 23, 28, .8)"
            : router.asPath === "/tidy"
            ? colors[themeColor][800]
            : "rgba(255,255,255,.8)",
          sm: global.user.darkMode
            ? "rgba(23, 23, 28, .8)"
            : "rgba(255,255,255,.9)",
        },
        borderBottom: global.user.darkMode
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(200,200,200,.5)",
        backdropFilter: "blur(10px)",
      }}
    >
      <CssBaseline />
      <Toolbar sx={{ height: "100%", gap: 1 }}>
        <Box
          sx={{
            flexGrow: { xs: 1, sm: "unset" },
          }}
        >
          <InviteButton />
        </Box>
        <Box
          sx={{
            mx: { sm: "auto" },
          }}
        >
          <SearchPopup />
        </Box>
        <Box sx={{ display: { xs: "none", sm: "unset" }, mr: { sm: 0.8 } }}>
          <UpdateButton />
        </Box>
        <Box sx={{ display: { xs: "none", sm: "unset" }, mr: { sm: 0.8 } }}>
          <Offline>
            <Tooltip title="You're offline">
              <IconButton
                color="inherit"
                disableRipple
                sx={{
                  p: 0,
                  mr: { xs: 0.2, sm: 0.6 },
                  color: global.user.darkMode
                    ? "hsl(240, 11%, 90%)"
                    : "#606060",
                  "&:hover": {
                    background: "rgba(200,200,200,.3)",
                    color: global.user.darkMode ? "hsl(240, 11%, 95%)" : "#000",
                  },
                  "&:focus-within": {
                    background: `${
                      global.user.darkMode
                        ? colors[themeColor]["900"]
                        : colors[themeColor]["50"]
                    }!important`,
                    color: global.user.darkMode ? "hsl(240, 11%, 95%)" : "#000",
                  },
                  transition: "all .2s",
                  "&:active": {
                    opacity: 0.5,
                    transform: "scale(0.95)",
                    transition: "none",
                  },
                }}
              >
                <Icon className="outlined">offline_bolt</Icon>
              </IconButton>
            </Tooltip>
          </Offline>
        </Box>
        <Achievements styles={styles} />
        <AppsMenu styles={styles} />
        <Tooltip title="Support">
          <IconButton
            sx={{ ...styles, display: { xs: "none", sm: "inline-flex" } }}
            color="inherit"
            disabled={!window.navigator.onLine}
            disableRipple
            onClick={() => window.open("https://smartlist.tech/support")}
          >
            <Icon className="outlined">help</Icon>
          </IconButton>
        </Tooltip>
        <Box sx={{ display: { sm: "none" } }}>
          <Settings>
            <Tooltip
              title="Settings"
              placement="bottom-start"
              PopperProps={{
                sx: { pointerEvents: "none" },
              }}
            >
              <IconButton
                color="inherit"
                disableRipple
                disabled={!window.navigator.onLine}
                sx={styles}
              >
                <Icon className="outlined">account_circle</Icon>
              </IconButton>
            </Tooltip>
          </Settings>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
