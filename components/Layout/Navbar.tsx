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

function ElevationScroll(props: any) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });
  useEffect(() => {
    if (document) {
      //alert(trigger?"+":"-")
      document
        .querySelector(`meta[name="theme-color"]`)!
        .setAttribute(
          "content",
          trigger ? colors[global.themeColor]["100"] : "#fff"
        );
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

export function Navbar({ handleDrawerToggle }: any): JSX.Element {
  return (
    <ElevationScroll>
      <AppBar elevation={0} position="fixed">
        <Toolbar>
          {/* <Tooltip title="Menu" placement="bottom-start">
            {global.session ? (
              <IconButton
                color="inherit"
                aria-label="open drawer."
                disableRipple
                edge="start"
                size="large"
                onClick={() => handleDrawerToggle(true)}
                sx={{
                  transition: "none",
                  mr: 2,
                  display: { md: "none" },
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
                <span className="material-symbols-rounded">menu</span>
              </IconButton>
            ) : (
              <Skeleton
                sx={{ mr: 2 }}
                variant="circular"
                width={40}
                height={40}
                animation="wave"
              />
            )}
          </Tooltip> */}

          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "600",
              ml: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
            noWrap
          >
            {global.session.user.SyncToken && (
              <span
                className="material-symbols-rounded"
                style={{ fontSize: "20px" }}
              >
                group
              </span>
            )}{" "}
            {global.session ? (
              global.session.user.houseName || "Smartlist"
            ) : (
              <Skeleton
                animation="wave"
                width={200}
                sx={{ maxWidth: "20vw" }}
              />
            )}
          </Typography>
          <SearchPopup
            content={
              <Tooltip title="Jump to">
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
                          global.theme === "dark"
                            ? "hsl(240, 11%, 95%)"
                            : "#000",
                      },
                      "&:focus-within": {
                        background:
                          (global.theme === "dark"
                            ? colors[themeColor]["900"]
                            : colors[themeColor]["50"]) + "!important",
                        color:
                          global.theme === "dark"
                            ? "hsl(240, 11%, 95%)"
                            : "#000",
                      },
                    }}
                  >
                    <span className="material-symbols-rounded">
                      electric_bolt
                    </span>
                  </IconButton>
                ) : (
                  <Skeleton
                    sx={{ mr: 2 }}
                    variant="circular"
                    width={40}
                    height={40}
                    animation="wave"
                  />
                )}
              </Tooltip>
            }
          />
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
          <Box sx={{ display: { sm: "block", xs: "none" } }}>
            <AppsMenu />
          </Box>
          <ProfileMenu />
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}
