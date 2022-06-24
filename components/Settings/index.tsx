import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import AccountSettings from "./AccountSettings";
import App from "./App";
import Developer from "./Developer";
import Notifications from "./Notifications";
import Rooms from "./Rooms";
import Sync from "./Sync";
import AppearanceSettings from "./AppearanceSettings";
import FinanceSettings from "./FinanceSettings";
import Sessions from "./Sessions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { neutralizeBack, revivalBack } from "../history-control";

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
              window.location.href = "/api/logout";
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
            : "#eee"
          : window.innerWidth > 900
          ? "#808080"
          : global.theme === "dark"
          ? "hsl(240, 11%, 25%)"
          : "#eee"
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
          sx: {
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
                  : "rgba(230,230,230,.5)",
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
            ? global.theme === "darl"
              ? "hsl(240, 11%, 20%)"
              : "rgb(230,230,230)"
            : "#808080"
          : "hsl(240, 11%, 10%)"
      );
  });

  return (
    <div>
      <div onClick={handleClickOpen}>{children}</div>

      <SwipeableDrawer
        anchor="right"
        swipeAreaWidth={0}
        onOpen={handleClickOpen}
        PaperProps={{
          sx: {
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 15%)",
            }),
            maxWidth: "100vw",
            width: {
              xs: "100vw",
              sm: "40vw",
            },
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
                  : "rgba(255,255,255,.5)",
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
              {/* <Typography
                sx={{ ml: 4, flex: 1, fontWeight: "600" }}
                variant="h6"
                component="div"
              >
                Settings
              </Typography> */}
            </Toolbar>
          </AppBar>
          <Typography
            sx={{ ml: 4, flex: 1, fontWeight: "600", my: 5 }}
            variant="h3"
            component="div"
          >
            Settings
          </Typography>

          <List sx={{ p: 2, "& *": { transition: "none!important" } }}>
            <div>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="close"
                sx={{ mr: 1, float: "right" }}
                onClick={() =>
                  document.getElementById("accountSettings")!.click()
                }
              >
                <Avatar
                  sx={{
                    width: "25px",
                    height: "25px",
                    bgcolor: colors[themeColor][200],
                  }}
                  alt="Profie picture"
                  src={global.session.user.image}
                />
              </IconButton>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="close"
                sx={{ mr: 1, float: "right" }}
              >
                <span className="material-symbols-rounded">more_vert</span>{" "}
              </IconButton>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="close"
                sx={{ mr: 1, float: "right" }}
              >
                <span className="material-symbols-rounded">search</span>{" "}
              </IconButton>
            </div>
            <SettingsMenu
              content={<AppearanceSettings />}
              icon="palette"
              primary="Appearance"
              secondary={"Current theme: " + global.theme}
            />
            <SettingsMenu
              id="financeSettingsTrigger"
              content={<FinanceSettings />}
              icon="payments"
              primary={<span id="financeSettingsTrigger">Finances</span>}
              secondary={<>Budget set to ${global.session.user.budget}</>}
            />
            <div style={{ display: "none" }}>
              <SettingsMenu
                id="accountSettings"
                content={<AccountSettings />}
                icon="account_circle"
                primary={<span id="accountSettings">Finances</span>}
                secondary={
                  <>
                    {global.session.user.name} &bull;{" "}
                    {global.session.user.email}
                  </>
                }
              />
            </div>
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
                  If an item's quantity is {global.session.user.notificationMin}{" "}
                  or less
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
            <SettingsMenu
              content={<Sessions />}
              icon="history"
              primary="Sessions"
              secondary={<>Accessing on {window.navigator.platform}</>}
            />
            <SettingsMenu
              content={<Rooms />}
              icon="pin_drop"
              primary="Rooms"
              secondary={"10 rooms"}
            />
            <SettingsMenu
              content={<Sync />}
              icon="sync"
              primary="Sync"
              secondary={"Pair your account and share inventory"}
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
