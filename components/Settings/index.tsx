import {
  Avatar,
  Box,
  Chip,
  Icon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import React, { cloneElement } from "react";
import { mutate } from "swr";
import { capitalizeFirstLetter } from "../../lib/client/capitalizeFirstLetter";
import { fetchRawApi } from "../../lib/client/useApi";
import { useBackButton } from "../../lib/client/useBackButton";
import { useSession } from "../../lib/client/useSession";
import { colors } from "../../lib/colors";
import { ConfirmationModal } from "../ConfirmationModal";
import { Puller } from "../Puller";
import { SettingsMenu } from "./Menus";

const AccountSettings = dynamic(() => import("./Menus/Account"));
const AppearanceSettings = dynamic(() => import("./Menus/Appearance"));
const LoginActivity = dynamic(() => import("./Menus/LoginActivity"));
const Notifications = dynamic(() => import("./Menus/Notifications"));
const TwoFactorAuth = dynamic(() => import("./Menus/TwoFactorAuth"));

/**
 * Settings drawer component
 * @param {any} {children} - Children to add in trigger component
 * @returns {any}
 */
export default function Settings({ children }: { children: JSX.Element }) {
  const session = useSession();
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useBackButton(() => setOpen(false));

  const trigger = cloneElement(children, {
    onClick: handleClickOpen,
    onMouseDown: handleClickOpen,
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
        <Puller showOnDesktop />
        <Box sx={{ px: 4 }}>
          <Typography className="font-heading" variant="h4">
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
              fetchRawApi("auth/logout").then(() => mutate("/api/user"))
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
                    : colors[session?.themeColor || "grey"][50],
                },
                userSelect: "none",
                "& .MuiAvatar-root": {
                  background: session.user.darkMode
                    ? "hsl(240,11%,35%)"
                    : colors[session?.themeColor || "grey"][100],
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: session.user.darkMode ? "#fff" : "#000",
                    background:
                      colors[session?.themeColor || "grey"][
                        session.user.darkMode ? 900 : 100
                      ],
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
