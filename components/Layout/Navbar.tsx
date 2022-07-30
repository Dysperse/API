import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import hexToRgba from "hex-to-rgba";
import React, { useEffect } from "react";
import { AppsMenu } from "./AppsMenu";
import { NotificationsMenu } from "./Notifications";
import { ProfileMenu } from "./Profile";
import { SearchPopup } from "./SearchPopup";
import { InviteButton } from "./InviteButton";

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
  const [syncedHouseName, setSyncedHouseName] = React.useState<string>("false");
  global.setSyncedHouseName = setSyncedHouseName;
  global.syncedHouseName = syncedHouseName;

  return (
    <ElevationScroll>
      <AppBar elevation={0} position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
            }}
            noWrap
          >
            {global.session.user.SyncToken == false ||
            !global.session.user.SyncToken ? (
              global.session.user.houseName || "Smartlist"
            ) : (
              <>
                {syncedHouseName === "false" ? (
                  <Skeleton
                    animation="wave"
                    width={200}
                    sx={{ maxWidth: "20vw" }}
                  />
                ) : (
                  <>{syncedHouseName}</>
                )}
              </>
            )}
            <InviteButton />
          </Typography>

          <NotificationsMenu>
            <Tooltip title="Notifications">
              {global.session ? (
                <IconButton
                  color="inherit"
                  disableRipple
                  edge="end"
                  size="large"
                  sx={{
                    transition: "none",
                    mr: 1,
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
                  <span className="material-symbols-rounded">inbox</span>
                </IconButton>
              ) : (
                <Skeleton
                  variant="circular"
                  width={40}
                  sx={{ mr: 0.9 }}
                  height={40}
                  animation="wave"
                />
              )}
            </Tooltip>
          </NotificationsMenu>
          <SearchPopup
            content={
              <Tooltip title="Jump to">
                <IconButton
                  color="inherit"
                  id="searchTrigger1"
                  disableRipple
                  edge="end"
                  size="large"
                  sx={{
                    transition: "none",
                    mr: 1,
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
                  <span className="material-symbols-rounded">
                    electric_bolt
                  </span>
                </IconButton>
              </Tooltip>
            }
          />
          <Box sx={{ display: { sm: "block", xs: "none" } }}>
            <AppsMenu />
          </Box>
          <ProfileMenu />
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}
