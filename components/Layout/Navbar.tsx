import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import hexToRgba from "hex-to-rgba";
import React, { useEffect } from "react";
import { AppsMenu } from "./AppsMenu";
import { InviteButton } from "./InviteButton";
import { SearchPopup } from "./SearchPopup";
import { ProfileMenu } from "../Layout/Profile";

function ElevationScroll(props: any) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });
  useEffect(() => {
    if (document) {
      document
        .querySelector(`meta[name="theme-color"]`)!
        .setAttribute("content", trigger ? colors[themeColor]["100"] : "#fff");
    }
  });
  return React.cloneElement(children, {
    sx: trigger
      ? {
          color: global.theme === "dark" ? "white" : "black",
          py: {
            sm: 1,
            xs: 0.9,
          },
          pr: 0.4,
          backdropFilter: "blur(20px)",
          background:
            global.theme === "dark"
              ? "rgba(57, 57, 71, .7)"
              : hexToRgba(colors[global.themeColor]["100"], 0.7),

          ["@supports not (backdrop-filter: blur(20px))"]: {
            background: colors[themeColor][100],
          },
        }
      : {
          color: global.theme === "dark" ? "white" : "black",
          pr: 0.4,
          py: {
            sm: 1,
            xs: 0.9,
          },
          // transition: "all .2s",
          background:
            global.theme === "dark" ? "rgba(0,0,0,0)" : "rgba(255,255,255,.5)",
          backdropFilter: "blur(10px)",
        },
  });
}

export function Navbar(): JSX.Element {
  return (
    <ElevationScroll>
      <AppBar elevation={0} position="fixed">
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            <InviteButton />
          </Box>
          <SearchPopup
            content={
              <Tooltip title="Jump to">
                <IconButton
                  color="inherit"
                  id="searchTrigger1"
                  disableRipple
                  sx={{
                    mr: 1,
                    transition: "none",
                    color:
                      global.theme === "dark"
                        ? "hsl(240, 11%, 90%)"
                        : "#606060",
                    "&:hover": {
                      background: "rgba(200,200,200,.3)",
                      color:
                        global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
                    },
                    "&:focus-within": {
                      background:
                        (global.theme === "dark"
                          ? colors[themeColor]["900"]
                          : colors[themeColor]["50"]) + "!important",
                      color:
                        global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
                    },
                  }}
                >
                  <span className="material-symbols-rounded">search</span>
                </IconButton>
              </Tooltip>
            }
          />
          <Box sx={{ display: { xs: "none", sm: "unset" } }}>
            <AppsMenu />
          </Box>
          <ProfileMenu>
            <Tooltip title="My account">
              <IconButton
                color="inherit"
                disableRipple
                sx={{
                  transition: "none",
                  color:
                    global.theme === "dark" ? "hsl(240, 11%, 90%)" : "#606060",
                  "&:hover": {
                    background: "rgba(200,200,200,.3)",
                    color:
                      global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
                  },
                  "&:focus-within": {
                    background:
                      (global.theme === "dark"
                        ? colors[themeColor]["900"]
                        : colors[themeColor]["50"]) + "!important",
                    color:
                      global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
                  },
                }}
              >
                <span className="material-symbols-rounded">account_circle</span>
              </IconButton>
            </Tooltip>
          </ProfileMenu>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}
