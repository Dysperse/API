"use client";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { useNotificationSubscription } from "@/components/Layout/NotificationsPrompt";
import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  ListItem,
  ListItemText,
  Switch,
} from "@mui/material";
import toast from "react-hot-toast";
import useSWR from "swr";
import { base64ToUint8Array } from "./base64ToUint8Array";

/**
 * Top-level component for the notification settings page.
 */
export default function Notifications() {
  const { data, mutate, error } = useSWR(["user/settings/notifications"]);
  const { setSession } = useSession();

  const {
    subscription,
    isSubscribed,
    registration,
    setSubscription,
    setIsSubscribed,
  } = useNotificationSubscription();

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
      setSession,
    }).then(() => {
      fetchRawApi(session, "/user/settings/notifications/test", {
        params: { subscription: JSON.stringify(sub) },
      });
    });
  };
  const { session } = useSession();

  const unsubscribeButtonOnClick = async (event) => {
    event.preventDefault();
    await subscription?.unsubscribe();
    updateSettings(["notificationSubscription", ""], { session, setSession });
    setSubscription(null);
    setIsSubscribed(false);
  };

  const sendNotificationButtonOnClick = async (event) => {
    event.preventDefault();
    fetchRawApi(session, "/user/settings/notifications/test", {
      params: {
        subscription: session.user.notificationSubscription,
      },
    });
  };

  const handleNotificationChange = async (name, value) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        await fetchRawApi(session, "user/settings/notifications", {
          method: "PUT",
          params: {
            name: name,
            value: value,
          },
        });
        await mutate();
        resolve("");
      } catch (error: any) {
        reject(error.message);
      }
    });

    toast.promise(promise, {
      loading: "Saving...",
      success: "Saved!",
      error: "Failed to save",
    });
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
      key: "boardUpdates",
      comingSoon: false,
      disabled: false,
      enabled: null,
      primary: "Boards",
      secondary: "Updating/deleting a column, etc.",
    },
    {
      key: "followerUpdates",
      comingSoon: false,
      disabled: false,
      enabled: null,
      primary: "Friend requests",
      secondary: "",
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
    <>
      {data ? (
        <Box sx={{ mb: 3 }}>
          <ListItem disableGutters>
            <ListItemText
              primary="Status updates"
              secondary="Notify others when I change my status"
            />
            <Switch
              checked={data.notifyFriendsForStatusUpdates}
              onClick={(e: any) =>
                handleNotificationChange(
                  "notifyFriendsForStatusUpdates",
                  e.target.checked
                )
              }
            />
          </ListItem>
          <Divider sx={{ my: 4 }} />
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
            <ListItem key={setting.key} disableGutters>
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
            height: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      )}
    </>
  );
}
