import {
  Avatar,
  Box,
  Chip,
  Icon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { ConfirmationModal } from "../ConfirmationModal";
import { Puller } from "../Puller";
import AccountSettings from "./AccountSettings";
import AppearanceSettings from "./AppearanceSettings";
import LoginActivity from "./LoginActivity";
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
  disabled = false,
}: {
  content: React.ReactNode;
  icon: React.ReactNode;
  primary: string | React.ReactNode;
  secondary: string | React.ReactNode;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);
  useStatusBar(open, 2);
  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      <ListItemButton
        disableRipple
        disabled={disabled}
        onClick={() => setOpen(true)}
        sx={{
          transiton: { sm: "none!important" },
          "& *": { transiton: { sm: "none!important" } },
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
      </ListItemButton>
      <SwipeableDrawer
        open={open}
        anchor="bottom"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: {
              sm: "50vw",
            },
            maxWidth: "650px",
            overflow: "scroll",
            maxHeight: "93vh",

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
 * Settings drawer component
 * @param {any} {children} - Children to add in trigger component
 * @returns {any}
 */
export default function FullScreenDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() =>
    open ? neutralizeBack(() => setOpen(false)) : revivalBack()
  );

  useHotkeys("ctrl+,", (e) => {
    e.preventDefault();
    document.getElementById("settingsTrigger")?.click();
  });

  useStatusBar(open, 1);

  return (
    <>
      <Box
        id="settingsTrigger"
        onClick={handleClickOpen}
        onMouseDown={handleClickOpen}
      >
        {children}
      </Box>
      <SwipeableDrawer
        anchor="bottom"
        PaperProps={{
          sx: { maxWidth: "600px", maxHeight: "95vh" },
        }}
        ModalProps={{
          keepMounted: false,
        }}
        open={open}
        onClose={handleClose}
        onOpen={handleClickOpen}
      >
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
            Settings
          </Typography>
        </Box>

        <List sx={{ p: 2, "& *": { transition: "none!important" } }}>
          <SettingsMenu
            content={<AppearanceSettings />}
            icon="format_paint"
            primary="Appearance"
            secondary={`Current theme: ${global.user.color.toUpperCase()}`}
          />
          <SettingsMenu
            content={<TwoFactorAuth />}
            icon="verified_user"
            primary="Two factor authentication"
            secondary={
              <>
                2FA is currently{" "}
                {global.user.twoFactorSecret &&
                global.user.twoFactorSecret !== "false"
                  ? "enabled"
                  : "disabled"}
              </>
            }
          />
          <SettingsMenu
            content={<></>}
            icon="link"
            primary="Integrations"
            secondary={
              <>Coming soon &bull; Manage third-party integrations and access</>
            }
            disabled
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
            content={<LoginActivity />}
            icon="history"
            primary="Login activity"
            secondary="View sessions/log out of other devices"
          />
          <SettingsMenu
            content={<Notifications />}
            icon="notifications"
            primary={
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "600",
                }}
              >
                Notifications
                <Chip
                  sx={{
                    ml: 1.5,
                    background:
                      "linear-gradient(45deg, #FF0080 0%, #FF8C00 100%)",
                    color: "#000",
                  }}
                  size="small"
                  label="BETA"
                />
              </span>
            }
            secondary={
              <>
                {global.user.notificationSubscription
                  ? "Notifications enabled for 1 device"
                  : "Notifications off"}
              </>
            }
          />
          <ConfirmationModal
            title="Sign out"
            question="Are you sure you want to sign out?"
            buttonText="Sign out"
            callback={() =>
              fetchApiWithoutHook("auth/logout").then(() => mutate("/api/user"))
            }
          >
            <ListItem
              sx={{
                transiton: "none!important",
                "& *": { transiton: "none!important" },
                borderRadius: 4,
                "&:hover, &:focus": {
                  background: global.user.darkMode
                    ? "hsl(240,11%,25%)"
                    : colors[themeColor][100],
                },
                userSelect: "none",
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
                secondary="Sign out of Dysperse and its apps"
              />
            </ListItem>
          </ConfirmationModal>
        </List>
      </SwipeableDrawer>
    </>
  );
}
