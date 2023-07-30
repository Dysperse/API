import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  ListItem,
  ListItemText,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import Layout from ".";

const base64ToUint8Array = (base64) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
/**
 * Top-level component for the notification settings page.
 */
export default function Notifications() {
  const { data, url, error } = useApi("user/settings/notifications");

  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [registration, setRegistration] = useState<any>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window as any).workbox !== undefined
    ) {
      // run only in browser
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (
            sub &&
            !(
              (sub as any).expirationTime &&
              Date.now() > (sub as any).expirationTime - 5 * 60 * 1000
            )
          ) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        });
        setRegistration(reg);
      });
    }
  }, []);

  const subscribeButtonOnClick = async (event) => {
    event.preventDefault();
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(
        process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      ),
    });
    setSubscription(sub);
    setIsSubscribed(true);
    updateSettings(session, "notificationSubscription", JSON.stringify(sub));
  };
  const session = useSession();

  const unsubscribeButtonOnClick = async (event) => {
    event.preventDefault();
    await subscription.unsubscribe();
    updateSettings(session, "notificationSubscription", "");
    setSubscription(null);
    setIsSubscribed(false);
  };

  const sendNotificationButtonOnClick = async (event) => {
    event.preventDefault();

    fetchRawApi(session, "/user/settings/notifications/test", {
      subscription: session.user.notificationSubscription,
    });
  };

  const isInPwa = useMediaQuery(
    "(display-mode: standalone), (display-mode: window-controls-overlay)",
  );

  const handleNotificationChange = async (name, value) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        await fetchRawApi(session, "user/settings/notifications/edit", {
          name: name,
          value: value,
        });
        await mutate(url);
        resolve("");
      } catch (error: any) {
        reject(error.message);
      }
    });

    toast.promise(
      promise,
      {
        loading: "Saving...",
        success: "Saved!",
        error: "Failed to save",
      },
      toastStyles,
    );
  };

  const enabledOnAnotherDevice =
    (!isSubscribed && session.user.notificationSubscription) ||
    session.user.notificationSubscription !== JSON.stringify(subscription);

  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  return (
    <Layout>
      {isInPwa || process.env.NODE_ENV === "development" ? (
        data ? (
          <Box sx={{ mb: 3 }}>
            <ListItem
              sx={{
                background: palette[3],
                borderRadius: 3,
                mb: 2,
              }}
            >
              <ListItemText
                primary="Enable notifications"
                secondary={
                  <>
                    <span
                      style={{
                        display: "block",
                      }}
                    >
                      Receive push notifications on one device
                    </span>
                    <Button
                      onClick={sendNotificationButtonOnClick}
                      disabled={
                        !isSubscribed && !session.user.notificationSubscription
                      }
                      variant="outlined"
                      size="small"
                      sx={{
                        mt: 1,
                        boxShadow: 0,
                      }}
                    >
                      Send test notification
                    </Button>
                  </>
                }
              />
              <button
                style={{ display: "none" }}
                id="enable-notifications"
                onClick={(event) => subscribeButtonOnClick(event)}
              />
              {enabledOnAnotherDevice ? (
                <ConfirmationModal
                  title="Recieve notifications on this device?"
                  question="If you've enabled notifications on another device, enabling them here will disable them on the other device."
                  callback={() =>
                    document.getElementById("enable-notifications")?.click()
                  }
                >
                  <Button variant="contained">Enable</Button>
                </ConfirmationModal>
              ) : (
                <Switch
                  checked={isSubscribed}
                  disabled={enabledOnAnotherDevice}
                  onClick={(event) => {
                    if (isSubscribed) {
                      unsubscribeButtonOnClick(event);
                    } else {
                      subscribeButtonOnClick(event);
                    }
                  }}
                />
              )}
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Account activity"
                secondary="Recieve a notification when suspicious or new activity is detected on your account"
              />
              <Switch disabled checked />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Coach"
                secondary="Get reminders to work on your daily routines"
              />
              <Switch
                checked={data.dailyRoutineNudge}
                onClick={(e: any) =>
                  handleNotificationChange(
                    "dailyRoutineNudge",
                    e.target.checked,
                  )
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Daily check-in"
                secondary="Recieve daily reminders to check-in on how you're feeling"
              />
              <Switch
                checked={data.dailyCheckInNudge}
                onClick={(e: any) =>
                  handleNotificationChange(
                    "dailyCheckInNudge",
                    e.target.checked,
                  )
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <>
                    To-do updates{" "}
                    <Chip
                      size="small"
                      label="Coming soon"
                      sx={{ fontWeight: 700, ml: 1 }}
                    />
                  </>
                }
                secondary="Recieve notifiations when you set due dates to tasks"
              />
              <Switch
                disabled
                checked={data.todoListUpdates}
                onClick={(e: any) =>
                  handleNotificationChange("todoListUpdates", e.target.checked)
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <>
                    Low item count reminders{" "}
                    <Chip
                      size="small"
                      label="Coming soon"
                      sx={{ fontWeight: 700, ml: 1 }}
                    />
                  </>
                }
                secondary="Recieve a notification when you have less than 5 items in your inventory"
              />
              <Switch
                disabled
                checked={false}
                onClick={(e: any) =>
                  handleNotificationChange("lowItemCount", e.target.checked)
                }
              />
            </ListItem>
          </Box>
        ) : error ? (
          <ErrorHandler
            callback={() => mutate(url)}
            error="An error occured while trying to fetch your notification settings"
          />
        ) : (
          <Box
            sx={{
              my: 10,
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={30} />
            <Typography
              sx={{
                textAlign: "center",
                px: 3,
              }}
            >
              <b>Loading your preferences...</b>
              <br />
              Keep in mind that this feature is still in beta, and you might
              encounter issues
            </Typography>
          </Box>
        )
      ) : (
        <Alert sx={{ mb: 3 }} severity="info">
          Use the Dysperse PWA to enable notifications for Android, Desktop, and
          Chrome OS
          <Button
            variant="contained"
            fullWidth
            href="//my.dysperse.com"
            target="_blank"
            sx={{
              mt: 2,
              borderRadius: 9999,
            }}
          >
            Open
          </Button>
        </Alert>
      )}
    </Layout>
  );
}
