import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import BoringAvatar from "boring-avatars";
import { useRouter } from "next/router";
import { colors } from "../../lib/colors";
import Settings from "../Settings/index";
import { AppsMenu } from "./AppsMenu";
import { InviteButton } from "./InviteButton";
import { SearchPopup } from "./Search";
import { Offline } from "react-detect-offline";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { useApi } from "../../hooks/useApi";
import { ErrorHandler } from "../error";
import hexToRgba from "hex-to-rgba";
import dayjs from "dayjs";
import { useStatusBar } from "../../hooks/useStatusBar";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";

function Changelog({ styles }: { styles: any }) {
  const [open, setOpen] = useState(false);
  useStatusBar(open);
  const { error, data } = useApi("property/inbox");

  return (
    <>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        anchor="bottom"
        PaperProps={{
          elevation: 0,
          sx: {
            mx: "auto",
            borderRadius: "20px 20px 0px 0px",
            maxWidth: "500px",
            background: colors[themeColor]["50"],
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "sticky",
            top: 0,
            left: 0,
            p: 4,
            pb: 2,
            zIndex: 9,
            width: "100%",
            background: hexToRgba(colors[themeColor]["50"], 0.9),
          }}
        >
          <Typography
            variant="h5"
            className="font-secondary"
            gutterBottom
            sx={{ flexGrow: 1 }}
          >
            Changelog
          </Typography>
          <IconButton
            color="inherit"
            size="large"
            onClick={() => setOpen(false)}
            sx={{
              color: colors[themeColor]["900"],
            }}
          >
            <span className="material-symbols-rounded">expand_more</span>
          </IconButton>
        </Box>
        <Box
          sx={{
            p: 4,
            pt: 0,
            maxHeight: "50vh",
            overflowY: "scroll",
          }}
        >
          {error && (
            <ErrorHandler error="An error occurred while trying to fetch your inbox" />
          )}
          {!data && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {data &&
            data.map((item) => (
              <Box
                sx={{
                  p: 3,
                  mb: 2,
                  background: colors[themeColor][100],
                  borderRadius: 5,
                }}
              >
                <Typography gutterBottom>
                  <b>{item.who === global.user.name ? "You" : item.who}</b>{" "}
                  {item.what}
                </Typography>
                <Typography variant="body2">
                  {dayjs(item.when).fromNow()}
                </Typography>
              </Box>
            ))}
          {data && data.length === 0 && (
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                background: colors[themeColor][100],
                p: 3,
                borderRadius: 5,
              }}
            >
              No recent activity
            </Typography>
          )}
        </Box>
      </SwipeableDrawer>
      <Tooltip title="Changelog">
        <IconButton
          sx={{ ...styles, ml: { xs: 0, sm: 1 }, mr: { xs: 2, sm: 1 } }}
          color="inherit"
          disableRipple
          onClick={() => setOpen(true)}
        >
          <span className="material-symbols-rounded">inbox</span>
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
    mr: 1,
    ml: 0.6,
    color: {
      xs: "#606060",
    },
    transition: "all .2s",
    "&:hover": {
      color: "#000",
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
            ? "rgba(0,0,0,0)"
            : router.asPath === "/tidy"
            ? colors[themeColor][800]
            : "rgba(255,255,255,.8)",
          sm: global.user.darkMode ? "rgba(0,0,0,0)" : "rgba(255,255,255,.9)",
        },
        borderBottom:
          router.asPath === "/tidy"
            ? "1px solid rgba(200,200,200,.1)"
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
