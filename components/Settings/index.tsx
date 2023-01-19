import {
  Avatar,
  Box,
  Icon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { ConfirmationModal } from "../ConfirmationModal";
import { Puller } from "../Puller";
import AccountSettings from "./AccountSettings";
import AppearanceSettings from "./AppearanceSettings";
import Notifications from "./Notifications";
import TwoFactorAuth from "./TwoFactorAuth";

/**
 * Top-level component for the settings page.
 * @param content content
 * @param icon Icon
 * @param primary Settings option heading
 * @param secondary Secondary text for the settings option
 */
function SettingsMenu({
  content,
  icon,
  primary,
  secondary,
}: {
  content: React.ReactNode;
  icon: React.ReactNode;
  primary: string | React.ReactNode;
  secondary: string | React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  useStatusBar(open);
  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      <ListItem
        button
        onClick={() => setOpen(true)}
        sx={{
          transiton: { sm: "none!important" },
          "& *": { transiton: { sm: "none!important" } },
          borderRadius: 4,
          mb: 0.5,
          "&:hover": {
            background: global.user.darkMode
              ? "hsl(240,11%,25%)"
              : colors[themeColor][100],
            "& .MuiAvatar-root": {
              background: global.user.darkMode
                ? "hsl(240,11%,35%)"
                : colors[themeColor][200],
            },
          },
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              color: global.user.darkMode ? "#fff" : "#000",
              borderRadius: 4,
              background: global.user.darkMode
                ? "hsl(240,11%,30%)"
                : colors[themeColor][100],
            }}
          >
            <Icon className="outlined">{icon}</Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography sx={{ fontWeight: "600" }}>{primary}</Typography>
          }
          secondary={secondary}
        />
      </ListItem>
      <SwipeableDrawer
        open={open}
        swipeAreaWidth={0}
        anchor="bottom"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: {
              sm: "50vw",
            },
            maxWidth: "650px",
            overflow: "scroll",
            maxHeight: "95vh",

            mx: "auto",
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
      >
        <Box sx={{ maxHeight: "95vh", overflow: "scroll" }}>
          <Puller />

          <Box sx={{ px: 5 }}>
            <Typography
              sx={{
                flex: 1,
                fontWeight: "900",
                mt: 5,
                mb: 3,
              }}
              variant="h5"
              component="div"
            >
              {primary}
            </Typography>
            {content}
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

/**
 * Swttings drawer component
 * @param {any} {children} - Children to add in trigger component
 * @returns {any}
 */
export default function FullScreenDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState<boolean>(false);

  /**
   * Open the settings drawer
   * @returns {any}
   */
  const handleClickOpen = () => {
    setOpen(true);
  };

  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });
  useStatusBar(open);

  useHotkeys("ctrl+,", (e) => {
    e.preventDefault();
    document.getElementById("settingsTrigger")?.click();
  });

  return (
    <div>
      <Box id="settingsTrigger" onClick={handleClickOpen}>
        {children}
      </Box>

      <SwipeableDrawer
        anchor="bottom"
        disableSwipeToOpen
        onOpen={handleClickOpen}
        PaperProps={{
          sx: {
            maxHeight: "95vh",
            maxWidth: "600px",
          },
        }}
        open={open}
        onClose={handleClose}
      >
        <Box sx={{ height: "auto", overflow: "scroll" }}>
          <Puller />
          <Box sx={{ px: 5 }}>
            <Typography
              sx={{
                flex: 1,
                fontWeight: "900",
                mb: 1,
                mt: 3,
              }}
              variant="h5"
              component="div"
            >
              Account
            </Typography>
            <Typography
              sx={{ flex: 1, fontWeight: "400", mb: 1 }}
              component="div"
            >
              {global.user.name} &bull; {global.user.email}
            </Typography>
          </Box>

          <List sx={{ p: 2, "& *": { transition: "none!important" } }}>
            <SettingsMenu
              content={<AppearanceSettings />}
              icon="palette"
              primary="Appearance"
              secondary={`Current theme: ${global.theme}`}
            />
            <SettingsMenu
              content={<TwoFactorAuth />}
              icon="verified_user"
              primary="Two factor authentication"
              secondary={
                <>
                  {global.property.role === "owner" &&
                  global.user.twoFactorSecret &&
                  global.user.twoFactorSecret === "false" ? (
                    <span style={{ color: colors.red[600] }}>
                      Your account is at greater risk because 2-factor auth
                      isn&rsquo;t enabled!
                      <br />
                    </span>
                  ) : (
                    ""
                  )}
                  2FA is currently{" "}
                  {global.user.twoFactorSecret &&
                  global.user.twoFactorSecret !== "false"
                    ? "enabled"
                    : "disabled"}
                </>
              }
            />
            <SettingsMenu
              content={<AccountSettings />}
              icon="person"
              primary="Account"
              secondary={
                <>
                  {global.user.name} &bull; {global.user.email}
                </>
              }
            />
            <SettingsMenu
              content={<Notifications />}
              icon="notifications"
              primary="Notifications"
              secondary={
                <>
                  If an item&apos;s quantity is {global.user.notificationMin} or
                  less
                </>
              }
            />
            <ConfirmationModal
              title="Sign out"
              question="Are you sure you want to sign out?"
              buttonText="Sign out"
              callback={() =>
                fetch("/api/logout").then(() => mutate("/api/user"))
              }
            >
              <ListItem
                button
                sx={{
                  transiton: "none!important",
                  "& *": { transiton: "none!important" },
                  borderRadius: 4,
                  "&:hover": {
                    background: global.user.darkMode
                      ? "hsl(240,11%,25%)"
                      : colors[themeColor][200],
                  },
                  "& .MuiAvatar-root": {
                    background: global.user.darkMode
                      ? "hsl(240,11%,35%)"
                      : colors[themeColor][200],
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      color: global.user.darkMode ? "#fff" : "#000",
                      background:
                        colors[themeColor][global.user.darkMode ? 900 : 100],
                      borderRadius: 4,
                    }}
                  >
                    <Icon>logout</Icon>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: "600" }}>Sign out</Typography>
                  }
                  secondary="Sign out of Dysperse and its related apps"
                />
              </ListItem>
            </ConfirmationModal>
          </List>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
