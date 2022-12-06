import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Offline } from "react-detect-offline";
import { colors } from "../../lib/colors";
import Settings from "../Settings/index";
import { AppsMenu } from "./AppsMenu";
import { InviteButton } from "./InviteButton";
import { SearchPopup } from "./Search";

function Achievements({ styles }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        BackdropProps={{
          sx: {
            backdropFilter: "grayscale(100%) blur(2px) !important",
          },
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            maxWidth: "700px",
            width: "100%",
            m: "20px",
            maxHeight: "calc(100vh - 40px)",
            borderRadius: 5,
          },
        }}
      >
        <AppBar
          elevation={0}
          position="static"
          sx={{
            zIndex: 1,
            background: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,0))",
          }}
        >
          <Toolbar className="flex" sx={{ height: "70px" }}>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-rounded">close</span>
            </IconButton>
            <Typography sx={{ mx: "auto", fontWeight: "600" }}>
              Achievements
            </Typography>
            <IconButton
              color="inherit"
              disableRipple
              sx={{ opacity: 0, pointerEvents: "none" }}
            >
              <span className="material-symbols-rounded">more_horiz</span>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            mt: "-70px",
          }}
        >
          <picture>
            <img
              src="https://i.ibb.co/XtqjrvZ/nature-gradients-illustration-tubikarts-4x.webp"
              width="100%"
            />
          </picture>
        </Box>
        <Box
          sx={{
            p: 5,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 1,
              textDecoration: "underline",
              fontWeight: "600",
            }}
          >
            Achievements coming soon!
          </Typography>
          <Typography variant="h6">
            Earn badges by being productive &amp; brag about it to your friends!
          </Typography>
        </Box>
      </SwipeableDrawer>
      <Tooltip title="Achievements">
        <IconButton
          color="inherit"
          disableRipple
          onClick={() => {
            setOpen(true);
          }}
          sx={{ ...styles, ml: { xs: 0, sm: 1 }, mr: { xs: 2, sm: 0.5 } }}
        >
          <span className="material-symbols-outlined">workspace_premium</span>
        </IconButton>
      </Tooltip>
    </>
  );
}

function UpdateButton() {
  const [button, setButton] = useState(false);
  // This hook only run once in browser after the component is rendered for the first time.
  // It has same effect as the old componentDidMount lifecycle callback.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      // add event listeners to handle any of PWA lifecycle event
      // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
      wb.addEventListener("installed", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      wb.addEventListener("controlling", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      wb.addEventListener("activated", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
      // NOTE: MUST set skipWaiting to false in next.config.js pwa object
      // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
      const promptNewVersionAvailable = (event) => {
        setButton(true);
        wb.addEventListener("controlling", (event) => {
          window.location.reload();
        });

        // Send a message to the waiting service worker, instructing it to activate.
      };

      wb.addEventListener("waiting", promptNewVersionAvailable);

      // ISSUE - this is not working as expected, why?
      // I could only make message event listenser work when I manually add this listenser into sw.js file
      wb.addEventListener("message", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      /*
      wb.addEventListener('redundant', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })
      wb.addEventListener('externalinstalled', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })
      wb.addEventListener('externalactivated', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })
      */

      // never forget to call register as auto register is turned off in next.config.js
      wb.register();
    }
  }, []);

  return button ? (
    <Tooltip title="A newer version of this app is available. Click to download">
      <IconButton
        color="inherit"
        disableRipple
        onClick={() => window.location.reload()}
        sx={{
          mr: -1,
          color: global.user.darkMode
            ? "hsl(240, 11%, 90%)"
            : colors.green[700],
          transition: "none !important",
        }}
      >
        <span className="material-symbols-rounded">download</span>
      </IconButton>
    </Tooltip>
  ) : (
    <></>
  );
}

/**
 * Navbar component for layout
 * @returns {any}
 */
export function Navbar(): JSX.Element {
  const router = useRouter();
  const styles = {
    borderRadius: 94,
    p: 0.5,
    m: 0,
    color: global.theme === "dark" ? "hsl(240,11%,90%)" : "#606060",
    transition: "all .2s",
    "&:hover": {
      color: global.theme === "dark" ? "hsl(240,11%,100%)" : "#000",
    },
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
        borderBottom:
          global.theme === "dark"
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(200,200,200,.5)",
        backdropFilter: "blur(10px)",
      }}
    >
      <CssBaseline />
      <Toolbar sx={{ height: "100%" }}>
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
                <span className="material-symbols-outlined">offline_bolt</span>
              </IconButton>
            </Tooltip>
          </Offline>
        </Box>
        <Achievements styles={styles} />
        <Box sx={{ display: { xs: "none", sm: "unset" }, mr: { sm: -2 } }}>
          <AppsMenu />
        </Box>
        {/* <Box sx={{ display: { xs: "none", sm: "unset" }, mr: { sm: -0.8 } }}>
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
        </Box> */}
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
                }}
              >
                <span className="material-symbols-outlined">
                  account_circle
                </span>
              </IconButton>
            </Tooltip>
          </Settings>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
