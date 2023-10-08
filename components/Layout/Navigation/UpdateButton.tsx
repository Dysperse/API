import { addHslAlpha } from "@/lib/client/addHslAlpha";
import PWAInstallerPrompt from "@/lib/client/installer";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  CardActionArea,
  CircularProgress,
  Icon,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export function UpdateButton() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [userWantsToUpdate, setUserWantsToUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScreen, setShowScreen] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window as any).workbox !== undefined
    ) {
      const wb = (window as any).workbox;
      // add event listeners to handle any of PWA lifecycle event
      // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
      // wb.addEventListener("installed", (event) => {
      // });

      // wb.addEventListener("controlling", (event) => {
      // });

      // wb.addEventListener("activated", (event) => {
      // });

      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
      // NOTE: MUST set skipWaiting to false in next.config.js pwa object
      // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
      const promptNewVersionAvailable = () => {
        // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
        // You may want to customize the UI prompt accordingly.
        setShowScreen(true);
        wb.addEventListener("controlling", () => {
          window.location.reload();
        });

        // Send a message to the waiting service worker, instructing it to activate.
        wb.messageSkipWaiting();
      };

      wb.addEventListener("waiting", promptNewVersionAvailable);

      // ISSUE - this is not working as expected, why?
      // I could only make message event listenser work when I manually add this listenser into sw.js file
      wb.addEventListener("message", (event) => {});

      /*
      wb.addEventListener('redundant', event => {
      })

      wb.addEventListener('externalinstalled', event => {
      })

      wb.addEventListener('externalactivated', event => {
      })
      */

      // never forget to call register as auto register is turned off in next.config.js
      wb.register();
    }
  }, [userWantsToUpdate]);

  const [button, setButton] = useState(true);

  const handleUpdate = () => {
    setUserWantsToUpdate(true);
    setLoading(true);
  };

  const handleReload = () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });
    window.location.reload();
  };

  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [showSnackbar, setShowSnackbar] = useState(false);

  return (
    <>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000000000000}
        onClick={() => {
          setShowSnackbar(false);
          setShowScreen(true);
        }}
        onClose={() => null}
        sx={{ mb: { xs: 7, sm: 2 }, transition: "all .3s" }}
        message={
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CircularProgress size={20} />
            <Box>
              <Typography>Updating Dysperse...</Typography>
              <Typography sx={{ mt: -0.2 }} variant="body2">
                App will reload once finished
              </Typography>
            </Box>
          </Box>
        }
      />
      <Backdrop sx={{ zIndex: 9999999 }} open={showScreen}>
        <Box
          sx={{
            borderRadius: 5,
            background: addHslAlpha(palette[2], 0.9),
            p: 3,
            maxWidth: "calc(100% - 30px)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Typography variant="h3" className="font-heading">
              Update required
            </Typography>
            <IconButton
              sx={{ ml: "auto", background: addHslAlpha(palette[3], 0.5) }}
              onClick={() => {
                setShowScreen(false);
                setShowSnackbar(true);
              }}
            >
              <Icon>expand_more</Icon>
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Your version of Dysperse is out of date. If this is taking too long,
            try hard refreshing the page (cmd + shift + r)
          </Typography>
          <Box sx={{ display: "flex", mt: 2, gap: 2 }}>
            <LoadingButton variant="outlined" onClick={handleReload}>
              <Icon>refresh</Icon>
            </LoadingButton>
            <LoadingButton
              loading
              variant="contained"
              sx={{ ml: "auto" }}
              fullWidth
            >
              Installing...
            </LoadingButton>
          </Box>
        </Box>
      </Backdrop>
      <PWAInstallerPrompt
        render={({ onClick }) => (
          <Snackbar
            onClick={onClick}
            open={button}
            autoHideDuration={6000}
            onClose={() => null}
            sx={{ mb: { xs: 7, sm: 2 }, transition: "all .3s" }}
            message="Tap to install Dysperse"
            action={
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setButton(false);
                }}
                color="inherit"
              >
                <Icon>close</Icon>
              </IconButton>
            }
          />
        )}
      />

      <Snackbar
        onClick={handleUpdate}
        open={updateAvailable}
        // open={true}
        autoHideDuration={6000}
        onClose={() => null}
        sx={{ mb: { xs: 7, sm: 2 }, transition: "all .3s" }}
        message={
          <CardActionArea sx={{ fontWeight: 700 }}>
            A new version of Dysperse is available. Tap to download
          </CardActionArea>
        }
        action={
          loading ? (
            <CircularProgress size={24} sx={{ color: "inherit", my: 1 }} />
          ) : (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setUpdateAvailable(false);
              }}
            >
              <Icon>close</Icon>
            </IconButton>
          )
        }
      />
    </>
  );
}
