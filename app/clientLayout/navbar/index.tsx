"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { Offline } from "react-detect-offline";
import Settings from "../../../components/Settings/index";
import { colors } from "../../../lib/colors";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { usePathname } from "next/navigation";
import React from "react";
import { AppsMenu } from "./apps";
import { InviteButton } from "./housePopup/dropdown";
import { JumpTo } from "./jumpTo";
import { UpdateButton } from "./updateButton";
import { Changelog } from "./changelog";

// import { SearchPopup } from "./Search";
export function Navbar() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  const pathname = usePathname();
  const styles = {
    borderRadius: 94,
    mr: 1,
    ml: 0.6,
    color: {
      xs: "#606060",
    },
    transition: "all .2s",
    "&:active": {
      opacity: 0.5,
      transform: "scale(0.95)",
      transition: "none",
    },
  };

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        zIndex: 999,
        boxShadow: trigger
          ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          : "none",
        color: {
          xs: global.user.darkMode
            ? "white"
            : pathname === "/tidy"
            ? colors[themeColor][100]
            : "black",
          sm: global.user.darkMode ? "white" : "black",
        },
        pr: 0.4,
        py: {
          sm: 1,
          xs: 0.9,
        },
        transition: "box-shadow .2s",
        background: {
          xs: global.user.darkMode
            ? "rgba(0,0,0,0)"
            : pathname === "/tidy"
            ? colors[themeColor][800]
            : "rgba(255,255,255,.8)",
          sm: global.user.darkMode
            ? "rgba(0,0,0,0)"
            : trigger
            ? "rgba(245,245,245,.8)"
            : "rgba(255,255,255,.8)",
        },
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar>
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
          <JumpTo />
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
                  mr: 0.6,
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
                <span className="material-symbols-outlined">offline_bolt</span>
              </IconButton>
            </Tooltip>
          </Offline>
        </Box>
        <Changelog styles={styles} />
        <Box sx={{ display: { xs: "none", sm: "unset" }, mr: { sm: -0.8 } }}>
          <AppsMenu />
        </Box>
        <Box sx={{ display: { xs: "none", sm: "unset" }, mr: { sm: -0.8 } }}>
          <Tooltip title="Support">
            <IconButton
              sx={{ ...styles, mr: 0 }}
              color="inherit"
              disableRipple
              onClick={() => window.open("https://smartlist.tech/support")}
            >
              <span className="material-symbols-outlined">help</span>
            </IconButton>
          </Tooltip>
        </Box>
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
                sx={{
                  ...styles,
                  p: 0,
                }}
              >
                <span className="material-symbols-outlined">settings</span>
              </IconButton>
            </Tooltip>
          </Settings>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
