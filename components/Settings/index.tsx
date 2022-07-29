import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as colors from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { neutralizeBack, revivalBack } from "../history-control";
import AccountSettings from "./AccountSettings";
import App from "./App";
import AppearanceSettings from "./AppearanceSettings";
import Developer from "./Developer";
import FinanceSettings from "./FinanceSettings";
import TwoFactorAuth from "./TwoFactorAuth";
import Notifications from "./Notifications";
import Rooms from "./Rooms";
import Sync from "./Sync";

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
              borderRadius: 99,
              px: 3,
              py: 1,
              border: "2px solid transparent",
            }}
            onClick={() => {
              setOpen(false);
              window.location.href = "/api/logout";
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
          mb: 1,
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              color: "#000",
              background: colors[themeColor][100],
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

function SettingsMenu({ content, icon, primary, secondary }: any) {
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    document.documentElement.classList[open ? "add" : "remove"](
      "prevent-scroll"
    );
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        open
          ? window.innerWidth > 900
            ? "rgb(64, 64, 64)"
            : global.theme === "dark"
            ? "hsl(240, 11%, 35%)"
            : colors[themeColor][100]
          : window.innerWidth > 900
          ? "#cccccc"
          : global.theme === "dark"
          ? "hsl(240, 11%, 25%)"
          : colors[themeColor][100]
      );
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
          mb: 1,
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              color: global.theme === "dark" ? "#fff" : "#000",
              borderRadius: 4,
              background:
                global.theme === "dark"
                  ? colors[themeColor][900]
                  : colors[themeColor][100],
            }}
          >
            <span
              style={{ fontSize: "20px" }}
              className="material-symbols-rounded"
            >
              {icon}
            </span>
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
        anchor="right"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        PaperProps={{
          elevation: 0,

          sx: {
            background: colors[themeColor][100],
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 20%)",
            }),
          },
        }}
      >
        <Box
          sx={{
            width: {
              xs: "100vw",
              sm: "60vw",
            },
            maxWidth: "100vw",
            height: "100vh",
            overflow: "scroll",
          }}
        >
          <AppBar
            sx={{
              boxShadow: 0,
              position: "sticky",

              background:
                global.theme === "dark"
                  ? "hsl(240, 11%, 25%)"
                  : colors[themeColor][100],
              backdropFilter: "blur(10px)",
              py: 1,
              color: global.theme === "dark" ? "#fff" : "#000",
            }}
          >
            <Toolbar>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setOpen(false)}
                aria-label="close"
                sx={{ ml: -0.5 }}
              >
                <span className="material-symbols-rounded">chevron_left</span>{" "}
              </IconButton>
              <Typography
                sx={{ ml: 4, flex: 1, fontWeight: "600" }}
                variant="h6"
                component="div"
              >
                {primary}
              </Typography>
            </Toolbar>
          </AppBar>
          {content}
        </Box>
      </SwipeableDrawer>
    </>
  );
}
export default function FullScreenDialog({ children }: any) {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  useEffect(() => {
    document.documentElement.classList[open ? "add" : "remove"](
      "prevent-scroll"
    );
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        open
          ? window.innerWidth < 992
            ? global.theme === "dark"
              ? "hsl(240, 11%, 20%)"
              : "rgb(230,230,230)"
            : colors[themeColor][50]
          : "hsl(240, 11%, 10%)"
      );
  });
  useHotkeys("ctrl+,", (e) => {
    e.preventDefault();
    document.getElementById("settingsTrigger")!.click();
  });
  return (
    <div>
      <div id="settingsTrigger" onClick={handleClickOpen}>
        {children}
      </div>

      <SwipeableDrawer
        anchor="right"
        swipeAreaWidth={0}
        onOpen={handleClickOpen}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "600px",
            borderRadius: "30px 30px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
        open={open}
        onClose={handleClose}
      >
        <Box sx={{ height: "100vh", overflow: "scroll" }}>
          <AppBar
            sx={{
              boxShadow: 0,
              position: "sticky",
              background:
                global.theme === "dark"
                  ? "hsl(240, 11%, 20%)"
                  : colors[themeColor][50],
              backdropFilter: "blur(10px)",
              py: 1,
              color: global.theme === "dark" ? "#fff" : "#000",
            }}
          >
            <Toolbar>
              <Tooltip title="Back">
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                  sx={{ ml: -0.5 }}
                >
                  <span className="material-symbols-rounded">chevron_left</span>{" "}
                </IconButton>
              </Tooltip>
              <Typography
                sx={{ ml: 4, flex: 1, fontWeight: "600" }}
                variant="h6"
                component="div"
              >
                Settings
              </Typography>
            </Toolbar>
          </AppBar>
          <Typography
            sx={{ ml: 4, flex: 1, fontWeight: "400", my: 5 }}
            variant="h3"
            component="div"
          >
            Settings
          </Typography>

          <List sx={{ p: 2, "& *": { transition: "none!important" } }}>
            <SettingsMenu
              content={<AppearanceSettings />}
              icon="palette"
              primary="Appearance"
              secondary={"Current theme: " + global.theme}
            />
            <SettingsMenu
              content={<TwoFactorAuth />}
              icon="security"
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
                  {global.isOwner &&
                  global.session.user["2faCode"] &&
                  global.session.user["2faCode"] === "false" ? (
                    <span style={{ color: "red" }}>
                      Your account is at greater risk because 2-factor auth
                      isn&rsquo;t enabled!
                      <br />
                    </span>
                  ) : (
                    ""
                  )}
                  2FA is currently{" "}
                  {global.session.user["2faCode"] &&
                  global.session.user["2faCode"] !== "false"
                    ? "enabled"
                    : "disabled"}
                </>
              }
            />
            <SettingsMenu
              id="financeSettingsTrigger"
              content={<FinanceSettings />}
              icon="payments"
              primary={<span id="financeSettingsTrigger">Finances</span>}
              secondary={<>Goal: {global.session.user.financePlan}</>}
            />
            <SettingsMenu
              id="accountSettings"
              content={<AccountSettings />}
              icon="account_circle"
              primary={<span id="accountSettings">Account</span>}
              secondary={
                <>
                  {global.session.user.name} &bull; {global.session.user.email}
                </>
              }
            />
            <SettingsMenu
              content={<App />}
              icon="apps"
              primary="Third-party apps"
              secondary={<>4 apps connected</>}
            />
            <SettingsMenu
              content={<Notifications />}
              icon="notifications"
              primary="Notifications"
              secondary={
                <>
                  If an item&apos;s quantity is{" "}
                  {global.session.user.notificationMin} or less
                </>
              }
            />
            <SettingsMenu
              content={<Developer />}
              icon="code"
              primary="Developer"
              secondary={"API"}
            />
            <SettingsMenu
              content={<App />}
              icon="smartphone"
              primary="App"
              secondary={"Coming soon"}
            />
            {global.session.user.studentMode === false && (
              <SettingsMenu
                content={<Rooms />}
                icon="pin_drop"
                primary={<span id="roomsTrigger">Rooms</span>}
                secondary={"10 rooms"}
              />
            )}
            <SettingsMenu
              content={<Sync />}
              icon="sync"
              primary="Sync"
              secondary={
                <span id="syncTrigger">
                  Invite others to your home and sync inventory, lists, etc.
                </span>
              }
            />
            <Divider sx={{ mb: 1 }} />
            <Logout />
            <ListItem
              button
              onClick={() => setOpen(true)}
              sx={{
                transiton: "none!important",
                "& *": { transiton: "none!important" },
                borderRadius: 4,
                mb: 1,
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: "#000",
                    background: colors[themeColor][100],
                    borderRadius: 4,
                  }}
                >
                  <span className="material-symbols-rounded">policy</span>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: "600" }}>Legal</Typography>
                }
                secondary="Food for lawyers"
              />
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
