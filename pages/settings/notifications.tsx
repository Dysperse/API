import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import {
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
import useSWR from "swr";
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
  const { data, mutate, error } = useSWR(["user/settings/notifications"]);

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
        process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
      ),
    });
    setSubscription(sub);
    setIsSubscribed(true);
    updateSettings(["notificationSubscription", JSON.stringify(sub)], {
      session,
    });
  };
  const session = useSession();

  const unsubscribeButtonOnClick = async (event) => {
    event.preventDefault();
    await subscription.unsubscribe();
    updateSettings(["notificationSubscription", ""], { session });
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
    "(display-mode: standalone), (display-mode: window-controls-overlay)"
  );

  const handleNotificationChange = async (name, value) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        await fetchRawApi(session, "user/settings/notifications/edit", {
          name: name,
          value: value,
        });
        await mutate();
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
      toastStyles
    );
  };

  const enabledOnAnotherDevice =
    (!isSubscribed && session.user.notificationSubscription) ||
    session.user.notificationSubscription !== JSON.stringify(subscription);

  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const notificationSettings = [
    {
      key: "accountUpdates",
      comingSoon: false,
      disabled: true,
      enabled: true,
      primary: "Account",
      secondary: "Recieve security notifications",
    },
    {
      key: "dailyRoutineNudge",
      comingSoon: false,
      disabled: false,
      enabled: null,
      primary: "Coach",
      secondary: "Get reminders to work on your goals",
    },
    {
      key: "todoListUpdates",
      comingSoon: false,
      disabled: false,
      enabled: null,
      primary: "Tasks",
      secondary: "Recieve notifiations when you set due dates to tasks",
    },
    {
      key: "statusUpdates",
      comingSoon: false,
      disabled: false,
      enabled: null,
      primary: "Status updates",
      secondary: "Get notified when your friends set their status",
    },
    {
      key: "followerUpdates",
      comingSoon: true,
      disabled: false,
      enabled: null,
      primary: "Follows",
      secondary: "Get notified when someone follows you",
    },
    {
      key: "lowItemCount",
      comingSoon: true,
      disabled: false,
      enabled: null,
      primary: "Low item count reminders",
      secondary:
        "Recieve a notification when you have less than 5 items in your inventory",
    },
  ];

  return (
    <Layout>
      {data ? (
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
          {/* Map through the notification settings */}
          {notificationSettings.map((setting) => (
            <ListItem key={setting.key}>
              <ListItemText
                primary={
                  <>
                    {setting.primary}
                    {setting.comingSoon && (
                      <Chip
                        size="small"
                        label="Coming soon"
                        sx={{ fontWeight: 700, ml: 1 }}
                      />
                    )}
                  </>
                }
                secondary={setting.secondary}
              />
              <Switch
                disabled={setting.comingSoon || setting.disabled}
                checked={setting.enabled || data[setting.key]}
                onClick={(e: any) =>
                  handleNotificationChange(setting.key, e.target.checked)
                }
              />
            </ListItem>
          ))}
        </Box>
      ) : error ? (
        <ErrorHandler
          callback={() => mutate()}
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
      )}
    </Layout>
  );
}
