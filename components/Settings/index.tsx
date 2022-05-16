import React, { useState, useEffect } from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import * as colors from "@mui/material/colors";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Tooltip from "@mui/material/Tooltip";
import AppearanceSettings from "./AppearanceSettings";
import FinanceSettings from "./FinanceSettings";
import AccountSettings from "./AccountSettings";
import Sessions from "./Sessions";
import App from "./App";
import Box from "@mui/material/Box";

function SettingsMenu({ content, icon, primary, secondary }: any) {
  const [open, setOpen] = useState(false);
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
            : "#eee"
          : window.innerWidth > 900
          ? "#808080"
          : "#eee"
      );
  });
  return (
    <>
      <ListItem
        button
        onClick={() => setOpen(true)}
        sx={{
          transiton: "none!important",
          "& *": { transiton: "none!important" }
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              color: global.theme === "dark" ? "#fff" : "#000",
              background:
                global.theme === "dark"
                  ? colors[themeColor][900]
                  : colors[themeColor][100]
            }}
          >
            <span
              style={{ fontSize: "18px" }}
              className="material-symbols-rounded"
            >
              {icon}
            </span>
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={primary} secondary={secondary} />
      </ListItem>
      <SwipeableDrawer
        open={open}
        swipeAreaWidth={0}
        anchor="right"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <Box
          sx={{
            width: {
              xs: "100vw",
              sm: "60vw"
            },
            height: "100vh",
            overflow: "scroll"
          }}
        >
          <AppBar
            sx={{
              boxShadow: 0,
              position: "sticky",

              background:
                global.theme === "dark"
                  ? "rgba(255,255,255,.1)"
                  : "rgba(230,230,230,.5)",
              backdropFilter: "blur(10px)",
              py: 1,
              color: global.theme === "dark" ? "#fff" : "#000"
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
              <Typography sx={{ ml: 4, flex: 1 }} variant="h6" component="div">
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
export default function FullScreenDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    document.documentElement.classList[open ? "add" : "remove"](
      "prevent-scroll"
    );
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        window.innerWidth < 992 ? "rgb(230,230,230)" : "#808080"
      );
  });

  return (
    <div>
      <Tooltip title="Settings">
        <IconButton
          edge="end"
          aria-label="comments"
          onClick={handleClickOpen}
          sx={{ transition: "none" }}
        >
          <span className="material-symbols-rounded">settings</span>
        </IconButton>
      </Tooltip>

      <SwipeableDrawer
        anchor="right"
        swipeAreaWidth={0}
        onOpen={handleClickOpen}
        PaperProps={{
          sx: {
            width: {
              xs: "100vw",
              sm: "40vw"
            }
          }
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
                  ? "rgba(255,255,255,.1)"
                  : "rgba(230,230,230,.5)",
              backdropFilter: "blur(10px)",
              py: 1,
              color: global.theme === "dark" ? "#fff" : "#000"
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
                  <span className="material-symbols-rounded">close</span>{" "}
                </IconButton>
              </Tooltip>
              <Typography sx={{ ml: 4, flex: 1 }} variant="h6" component="div">
                Settings
              </Typography>
            </Toolbar>
          </AppBar>
          <List>
            <SettingsMenu
              content={<AppearanceSettings />}
              icon="palette"
              primary="Appearance"
              secondary={"Current theme: " + global.theme}
            />
            <SettingsMenu
              content={<FinanceSettings />}
              icon="payments"
              primary="Finances"
              secondary={null}
            />
            <SettingsMenu
              content={<AccountSettings />}
              icon="account_circle"
              primary="Account"
              secondary={null}
            />
            <SettingsMenu
              content={<App />}
              icon="apps"
              primary="Third-party apps"
              secondary={null}
            />
            <SettingsMenu
              content={<p>test</p>}
              icon="notifications"
              primary="Notifications"
              secondary={null}
            />
            <SettingsMenu
              content={<p>test</p>}
              icon="code"
              primary="Developer"
              secondary={null}
            />
            <SettingsMenu
              content={<App />}
              icon="smartphone"
              primary="App"
              secondary={null}
            />
            <SettingsMenu
              content={<Sessions />}
              icon="history"
              primary="Sessions"
              secondary={null}
            />
            <SettingsMenu
              content={<>Coming soon</>}
              icon="pin_drop"
              primary="Rooms"
              secondary={null}
            />
            <SettingsMenu
              content={<p>test</p>}
              icon="sync"
              primary="Sync"
              secondary={null}
            />
            <Divider />

            <ListItem button>
              <ListItemAvatar>
                <Avatar
                  sx={{ color: "#000", background: colors[themeColor][100] }}
                >
                  <span className="material-symbols-rounded">logout</span>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Sign out"
                secondary="Sign out of Smartlist and it's related apps"
              />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Legal" secondary="Food for lawyers" />
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
