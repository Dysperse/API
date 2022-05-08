import * as React from "react";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import useFetch from "react-fetch-hook";
import Tooltip from "@mui/material/Tooltip";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Skeleton from "@mui/material/Skeleton";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function hasNumber(myString) {
  return /\d/.test(myString);
}
function NotificationsList() {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/items/list/",
    {
      method: "POST",
      body: new URLSearchParams({
        token: global.session.accessToken,
        limit: "500",
        room: "null"
      })
    }
  );
  return isLoading ? (
    <>
      {[...new Array(25)].map((_) => (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ height: 100, borderRadius: 5, mt: 2 }}
        />
      ))}
    </>
  ) : (
    <>
      {data.data.map((item) => {
        if (
          parseInt(item.amount.replace(/[^\d]/g, ""), 100) > 3 ||
          item.amount.includes("In stock") ||
          !hasNumber(item.amount)
        )
          return "";
        return (
          <ListItem>
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
            sx={{ background: "rgba(200,200,200,.3)", color: "#404040" }}
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
