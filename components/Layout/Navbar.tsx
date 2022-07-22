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
import Popover from "@mui/material/Popover";
import Chip from "@mui/material/Chip";
import { Invitations } from "../Invitations";

function InviteButton() {
  const [isOwner, setIsOwner] = React.useState<boolean>(false);
  global.setIsOwner = setIsOwner;

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  let handleClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    handleClick = () => {};
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById("new_trigger")!.click();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div id="new_trigger" onClick={handleClick}></div>
      {!global.session.user.SyncToken && global.ownerLoaded && !isOwner && (
        <Invitations />
      )}

      <Box
        onClick={() => document.getElementById("syncTrigger")!.click()}
        sx={{
          display: "flex",
          userSelect: "none",
          cursor: "pointer",
          p: 1,
          ml: -1.4,
          borderRadius: 3,
          "&:hover": { background: "rgba(200,200,200,.2)" },
          "&:active": { background: "rgba(200,200,200,.3)" },
        }}
      >
        {global.session.user.SyncToken ? (
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "20px" }}
          >
            group
          </span>
        ) : (
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "20px" }}
          >
            {isOwner ? "location_away " : "lock"}
          </span>
        )}
      </Box>
      <Popover
        id={id}
        open={!isOwner && !global.session.user.SyncToken && open}
        anchorEl={anchorEl}
        onClose={handleClose}
        BackdropProps={{
          sx: {
            opacity: "0!important",
          },
        }}
        PaperProps={{
          sx: {
            background: "#f50057",
            maxWidth: "200px",
            overflowX: "unset",
            mt: 3.5,
            overflowY: "unset",
            "&:before": {
              content: '""',
              position: "absolute",
              marginRight: "-0.71em",
              top: -15,
              left: 20,
              width: 20,
              height: 20,
              backgroundColor: "#f50057",
              transform: "translate(-50%, 50%) rotate(-45deg)",
              clipPath:
                "polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))",
            },
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>
          <Chip
            label="New"
            sx={{
              height: "auto",
              px: 1,
              background: "rgba(255,255,255,.3)",
              mb: 0.5,
            }}
          />
          <br />
          Invite up to 5 people to your{" "}
          {global.session.user.studentMode === false ? "home" : "dorm"}
        </Typography>
      </Popover>
    </>
  );
}

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
  const [syncedHouseName, setSyncedHouseName] = React.useState<string>("false");
  global.setSyncedHouseName = setSyncedHouseName;

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
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
            noWrap
          >
            <InviteButton />
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
