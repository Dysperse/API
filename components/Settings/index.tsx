import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { Puller } from "../Puller";
import AccountSettings from "./AccountSettings";
import AppearanceSettings from "./AppearanceSettings";
import Notifications from "./Notifications";
import TwoFactorAuth from "./TwoFactorAuth";

/**
 * Logout modal
 */
function Logout() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            width: "450px",
            maxWidth: "calc(100vw - 20px)",
            borderRadius: "28px",
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "800" }}>
          Sign out
          <DialogContentText id="alert-dialog-slide-description" sx={{ mt: 1 }}>
            Are you sure you want to sign out?
          </DialogContentText>
        </DialogTitle>
        <DialogActions>
          <Button
            variant="outlined"
            disableElevation
            size="large"
            sx={{
              borderRadius: 99,
              px: 3,
              py: 1,
              borderWidth: "2px!important",
            }}
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            size="large"
            sx={{
              background: colors[themeColor][900] + "!important",
              borderRadius: 99,
              px: 3,
              py: 1,
              border: "2px solid transparent",
            }}
            onClick={() => {
              setOpen(false);
              fetch("/api/logout").then(() => mutate("/api/user"));
            }}
          >
            Sign out
          </Button>
        </DialogActions>
      </Dialog>
      <ListItem
        button
        onClick={() => setOpen(true)}
        sx={{
          transiton: "none!important",
          "& *": { transiton: "none!important" },
          borderRadius: 4,
          "&:hover": {
            background:
              global.theme === "dark"
                ? "hsl(240,11%,25%)"
                : colors[themeColor][200],
          },
          "& .MuiAvatar-root": {
            background:
              global.theme === "dark"
                ? "hsl(240,11%,35%)"
                : colors[themeColor][200],
          },
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              color: global.user.darkMode ? "#fff" : "#000",
              background: colors[themeColor][global.user.darkMode ? 900 : 100],
              borderRadius: 4,
            }}
          >
            <span className="material-symbols-rounded">logout</span>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={<Typography sx={{ fontWeight: "600" }}>Sign out</Typography>}
          secondary="Sign out of Smartlist and its related apps"
        />
      </ListItem>
    </>
  );
}

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
  useStatusBar(open, 1);
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
            background:
              global.theme === "dark"
                ? "hsl(240,11%,25%)"
                : colors[themeColor][100],
            "& .MuiAvatar-root": {
              background:
                global.theme === "dark"
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
              background:
                global.theme === "dark"
                  ? "hsl(240,11%,30%)"
                  : colors[themeColor][100],
            }}
          >
            <span className="material-symbols-outlined">{icon}</span>
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
        ModalProps={{
          keepMounted: true,
        }}
        anchor="bottom"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "650px",
            overflow: "scroll",
            maxHeight: "95vh",
            borderRadius: "20px 20px 0 0",
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
        swipeAreaWidth={0}
        onOpen={handleClickOpen}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "650px",
            maxHeight: "95vh",
            borderRadius: "20px 20px 0 0",
            mx: "auto",
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 20%)",
            }),
          },
        }}
        ModalProps={{
          keepMounted: true,
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
              {global.user.name}
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
              primary={
                <span id="twoFactorAuthSettings">
                  Two factor authentication
                  <Chip
                    component="span"
                    label="New"
                    sx={{
                      display: { xs: "none", sm: "unset" },
                      height: "auto",
                      ml: 2,
                      py: 0.4,
                      px: 0.7,
                      background: "#B00200",
                      color: "#fff",
                    }}
                  />
                </span>
              }
              secondary={
                <>
                  {global.property.role === "owner" &&
                  global.user.twoFactorSecret &&
                  global.user.twoFactorSecret === "false" ? (
                    <span style={{ color: "red" }}>
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
              primary={<span id="accountSettings">Account</span>}
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
            <Logout />
          </List>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
