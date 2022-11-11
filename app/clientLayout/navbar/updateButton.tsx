import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { colors } from "../../../lib/colors";

export function UpdateButton() {
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
