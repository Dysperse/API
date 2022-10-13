import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import BoringAvatar from "boring-avatars";
import { useRouter } from "next/router";
import { colors } from "../../lib/colors";
import Settings from "../Settings/index";
import { AppsMenu } from "./AppsMenu";
import { InviteButton } from "./InviteButton";
import { SearchPopup } from "./Search";
import { Offline } from "react-detect-offline";
import { useState, useEffect } from "react";

function UpdateButton() {
  const [button, setButton] = useState(null);
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
          mr: -0.5,
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

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        transition: "background .1s",
        color: {
          xs: global.user.darkMode
            ? "white"
            : router.asPath === "/tidy"
            ? colors[themeColor][100]
            : "black",
          sm: global.user.darkMode ? "white" : "black",
        },
        pr: 0.4,
        py: {
          sm: 1,
          xs: 0.9,
        },
        background: {
          xs: global.user.darkMode
            ? "rgba(0,0,0,0)"
            : router.asPath === "/tidy"
            ? colors[themeColor][800]
            : "rgba(255,255,255,.8)",
          sm: global.user.darkMode ? "rgba(0,0,0,0)" : "rgba(255,255,255,.8)",
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
        <Box sx={{ display: { xs: "none", sm: "unset" }, mr: { sm: 0.8 } }}>
          <AppsMenu />
        </Box>
        <Settings>
          <Tooltip
            title={global.user.email}
            placement="bottom-start"
            PopperProps={{
              sx: { pointerEvents: "none" },
            }}
          >
            <IconButton
              color="inherit"
              disableRipple
              sx={{
                p: 0,
                ml: 0.6,
                color: global.user.darkMode ? "hsl(240, 11%, 90%)" : "#606060",
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
              <BoringAvatar
                size={35}
                name={global.user.name}
                variant="beam"
                colors={["#801245", "#F4F4DD", "#DCDBAF", "#5D5C49", "#3D3D34"]}
              />
            </IconButton>
          </Tooltip>
        </Settings>
      </Toolbar>
    </AppBar>
  );
}
