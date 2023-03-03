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
import dynamic from "next/dynamic";
import React, { cloneElement, useEffect, useState } from "react";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";
import { useSession } from "../../pages/_app";
import { ConfirmationModal } from "../ConfirmationModal";
import { capitalizeFirstLetter } from "../ItemPopup";
import { Puller } from "../Puller";
const AccountSettings = dynamic(() => import("./AccountSettings"));
const AppearanceSettings = dynamic(() => import("./AppearanceSettings"));
const LoginActivity = dynamic(() => import("./LoginActivity"));
const Notifications = dynamic(() => import("./Notifications"));
const TwoFactorAuth = dynamic(() => import("./TwoFactorAuth"));

/**
 * Top-level component for the settings page.
 * @param content content
 * @param icon Icon
 * @param primary Settings option heading
 * @param secondary Secondary text for the settings option
 */
function SettingsMenu({
  parentOpen,
  content,
  icon,
  primary,
  secondary,
  disabled = false,
}: {
  parentOpen: boolean;
  content: React.ReactNode;
  icon: React.ReactNode;
  primary: string | React.ReactNode;
  secondary: string | React.ReactNode;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });
  const session = useSession();

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
            background: session.user.darkMode
              ? "hsl(240,11%,25%)"
              : colors[themeColor][50],
            "& .MuiAvatar-root": {
              background: session.user.darkMode
                ? "hsl(240,11%,35%)"
                : colors[themeColor][100],
            },
          },
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              color: session.user.darkMode ? "#fff" : "#000",
              borderRadius: 4,
              background: session.user.darkMode
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
      {parentOpen && (
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
              ...(session.user.darkMode && {
                background: "hsl(240, 11%, 25%)",
              }),
            },
          }}
          sx={{
            zIndex: 9999,
          }}
          disableSwipeToOpen
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
      )}
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
  children: JSX.Element;
}) {
  const [open, setOpen] = React.useState<boolean>(false);
  const session = useSession();
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() =>
    open ? neutralizeBack(() => setOpen(false)) : revivalBack()
  );

  const trigger = cloneElement(children, {
    onClick: handleClickOpen,
    onmousedown: handleClickOpen,
    id: "settingsTrigger",
  });

  return (
    <>
      {trigger}

      <SwipeableDrawer
        anchor="bottom"
        PaperProps={{ sx: { maxWidth: "600px", maxHeight: "95vh" } }}
        ModalProps={{ keepMounted: true }}
        sx={{ zIndex: 9999 }}
        open={open}
        onClose={handleClose}
        onOpen={handleClickOpen}
        disableSwipeToOpen
      >
        <Puller />
        <Box sx={{ px: 4 }}>
          <Typography
            sx={{
              flex: 1,
              mb: 1,
              mt: 3,
            }}
            className="font-heading"
            variant="h4"
            component="div"
          >
            Settings
          </Typography>
        </Box>

        <List sx={{ p: 2, "& *": { transition: "none!important" } }}>
          <SettingsMenu
            parentOpen={open}
            content={<AppearanceSettings />}
            icon="format_paint"
            primary="Appearance"
            secondary={`Current theme: ${capitalizeFirstLetter(
              session.user.color
            )}`}
          />
          <SettingsMenu
            parentOpen={open}
            content={<TwoFactorAuth />}
            icon="verified_user"
            primary="Two factor authentication"
            secondary={
              <>
                2FA is currently{" "}
                {session.user.twoFactorSecret &&
                session.user.twoFactorSecret !== "false"
                  ? "enabled"
                  : "disabled"}
              </>
            }
          />
          <SettingsMenu
            parentOpen={open}
            content={<AccountSettings />}
            icon="person"
            primary="Account"
            secondary={
              <>
                {session.user.name} &bull; {session.user.email}
              </>
            }
          />
          <SettingsMenu
            parentOpen={open}
            content={<LoginActivity />}
            icon="history"
            primary="Login activity"
            secondary="View sessions/log out of other devices"
          />
          <SettingsMenu
            parentOpen={open}
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
                {session.user.notificationSubscription
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
                  background: session.user.darkMode
                    ? "hsl(240,11%,25%)"
                    : colors[themeColor][50],
                },
                userSelect: "none",
                "& .MuiAvatar-root": {
                  background: session.user.darkMode
                    ? "hsl(240,11%,35%)"
                    : colors[themeColor][100],
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: session.user.darkMode ? "#fff" : "#000",
                    background:
                      colors[themeColor][session.user.darkMode ? 900 : 100],
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
