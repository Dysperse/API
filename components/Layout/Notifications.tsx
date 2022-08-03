import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import useSWR from "swr";
import { neutralizeBack, revivalBack } from "../history-control";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function NotificationsList() {
  const url =
    "/api/inventory?" +
    new URLSearchParams({
      limit: "500",
      token:
        global.session &&
        (global.session.account.SyncToken ||
          global.session.property.accessToken),
    });

  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );
  if (error)
    return (
      <div>
        Yikes! An error occured while trying to load your inbox. Try reloading
        this page
      </div>
    );
  if (!data)
    return (
      <>
        {[...new Array(25)].map((_: any, id: number) => (
          <Skeleton
            key={id.toString()}
            variant="rectangular"
            animation="wave"
            sx={{ height: 100, borderRadius: 5, mt: 2 }}
          />
        ))}
      </>
    );

  return (
    <>
      {data.data.map((item: any, id: number) => {
        if (
          parseInt(item.amount.replace(/[^\d]/g, ""), 100) <
            global.session.account.notificationMin ||
          item.amount.includes("In stock")
        )
          return "";
        return (
          <ListItem
            key={id.toString()}
            sx={{
              mb: 2,
              borderRadius: 5,
              p: 2,
              background:
                global.theme === "dark"
                  ? "hsl(240, 11%, 25%)"
                  : "rgba(200,200,200,.3)",
            }}
          >
            <ListItemText
              primary={capitalizeFirstLetter(item.room)}
              secondary={
                <>
                  You&apos;re running out of {item.title} <br />
                  Current quantity: {item.amount || "No quantity specified"}
                </>
              }
            />
          </ListItem>
        );
      })}
      {data.data.length === 0 && "No notifications!"}
    </>
  );
}

export function NotificationsMenu(props: any): JSX.Element {
  const [state, setState] = React.useState<boolean>(false);
  React.useEffect(() => {
    document.documentElement.classList[state ? "add" : "remove"](
      "prevent-scroll"
    );
    state ? neutralizeBack(() => setState(false)) : revivalBack();
  });
  return (
    <>
      <div onClick={() => setState(true)}>{props.children}</div>
      <SwipeableDrawer
        anchor={"right"}
        open={state}
        onOpen={() => setState(true)}
        onClose={() => setState(false)}
        PaperProps={{
          sx: {
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 20%)",
            }),
          },
        }}
      >
        <Box sx={{ flexGrow: 1, position: "relative" }}>
          <AppBar
            elevation={0}
            position="sticky"
            sx={{
              py: 1,
              background:
                global.theme === "dark"
                  ? "hsl(240, 11%, 30%)"
                  : "rgba(200,200,200,.5)",
              color: global.theme === "dark" ? "#fff" : "#404040",
            }}
          >
            <Toolbar>
              <Tooltip title="Back">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  onClick={() => setState(false)}
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <span className="material-symbols-rounded">chevron_left</span>
                </IconButton>
              </Tooltip>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Inbox
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Box
          sx={{
            pt: 3,
            height: "100vh",
            overflowY: "scroll",
            width: "500px",
            maxWidth: "100vw",
            px: 3,
          }}
          role="presentation"
        >
          <NotificationsList />
          <Toolbar />
        </Box>
      </SwipeableDrawer>
    </>
  );
}
