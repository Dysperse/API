import * as React from "react";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Skeleton from "@mui/material/Skeleton";
import useSWR from "swr";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function hasNumber(myString) {
  return /\d/.test(myString);
}

function NotificationsList() {
  const fetcher = (u, o) => fetch(u, o).then((res) => res.json());
  const url = "https://api.smartlist.tech/v2/items/list/";

  const { data, error } = useSWR(url, () =>
    fetcher(url, {
      method: "POST",
      body: new URLSearchParams({
        token: global.session.accessToken,
        limit: "500",
        room: "null"
      })
    })
  );
  if (error)
    return (
      <div>
        Yikes! An error occured while trying to load your inbox. Try reloading
        htis page
      </div>
    );
  if (!data)
    return (
      <>
        {[...new Array(25)].map(() => (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ height: 100, borderRadius: 5, mt: 2 }}
          />
        ))}
      </>
    );

  return (
    <>
      {data.data.map((item) => {
        if (
          parseInt(item.amount.replace(/[^\d]/g, ""), 100) > 3 ||
          item.amount.includes("In stock") ||
          !hasNumber(item.amount)
        )
          return "";
        return (
          <ListItem
            sx={{
              mb: 2,
              borderRadius: 5,
              p: 2,
              background: "rgba(200,200,200,.3)"
            }}
          >
            <ListItemText
              primary={capitalizeFirstLetter(item.room)}
              secondary={
                <>
                  You're running out of {item.title} <br />
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
  const [state, setState] = React.useState(false);

  return (
    <>
      <div onClick={() => setState(true)}>{props.children}</div>
      <SwipeableDrawer
        anchor={"right"}
        open={state}
        onOpen={() => setState(true)}
        onClose={() => setState(false)}
      >
        <Box sx={{ flexGrow: 1, position: "relative" }}>
          <AppBar
            elevation={0}
            position="sticky"
            sx={{
              py: 1,
              background: "rgba(200,200,200,.5)",
              color: "#404040"
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
            px: 3
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
