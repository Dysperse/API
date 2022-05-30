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
import AppearanceSettings from "./AppearanceSettings";
import FinanceSettings from "./FinanceSettings";
import Sessions from "./Sessions";

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
          transiton: "none!important",
          "& *": { transiton: "none!important" },
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
        anchor="right"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
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
                  ? "hsl(240, 11%, 35%)"
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
      <Tooltip title="Settings" placement="bottom-end">
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
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 20%)",
            }),
            width: {
              xs: "100vw",
              sm: "40vw",
            },
          },
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
                  ? "hsl(240, 11%, 25%)"
                  : "rgba(230,230,230,.5)",
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
                  <span className="material-symbols-rounded">close</span>{" "}
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
          <List sx={{ p: 2, "& *": { transition: "none!important" } }}>
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
              secondary={<>Budget set to ${global.session.user.budget}</>}
            />
            <SettingsMenu
              content={<AccountSettings />}
              icon="account_circle"
              primary="Account"
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
              content={<p>test</p>}
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
              content={<p>test</p>}
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
              content={<>Coming soon</>}
              icon="pin_drop"
              primary="Rooms"
              secondary={"10 rooms"}
            />
            <SettingsMenu
              content={<p>test</p>}
              icon="sync"
              primary="Sync"
              secondary={"Pair your account and share inventory"}
            />
            <Divider sx={{ mb: 1 }} />

            <ListItem
              button
              onClick={() => (window.location.href = "/api/logout")}
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
                primary={
                  <Typography sx={{ fontWeight: "600" }}>Sign out</Typography>
                }
                secondary="Sign out of Smartlist and its related apps"
              />
            </ListItem>
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
