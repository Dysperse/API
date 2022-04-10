import * as React from "react";
import dynamic from "next/dynamic";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";

const List: any = dynamic(() => import("@mui/material/List"));
const ListItem: any = dynamic(() => import("@mui/material/ListItem"));
const Divider: any = dynamic(() => import("@mui/material/Divider"));
const ListItemText: any = dynamic(() => import("@mui/material/ListItemText"));
const ListItemAvatar: any = dynamic(() =>
  import("@mui/material/ListItemAvatar")
);
const Avatar: any = dynamic(() => import("@mui/material/Avatar"));

function NotificationsList() {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Brunch this weekend?"
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                Ali Connors
              </Typography>
              {" — I'll be in your basement doing errands this…"}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Summer BBQ"
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                to Scott, Alex, Jennifer
              </Typography>
              {" — Wish I could come, but I'm out of town this…"}
            </React.Fragment>
          }
        />
      </ListItem>
      {[1, 1, 1, 1, 1, 1, 1, 1].map((_) => (
        <>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Oui Oui"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Sandra Adams
                  </Typography>
                  {" — Do you have Paris recommendations? Have you ever..."}
                </React.Fragment>
              }
            />
          </ListItem>
        </>
      ))}
    </List>
  );
}

export function NotificationsMenu(props: any) {
  const [state, setState] = React.useState(false);

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    setState(open);
    if (open) {
      document.documentElement.classList.add("prevent-scroll");
    } else {
      document.documentElement.classList.remove("prevent-scroll");
    }
  };

  const list = () => (
    <Box
      sx={{
        height: "100vh",
        overflowY: "scroll",
        width: "500px",
        maxWidth: "100vw",
        p: 3
      }}
      role="presentation"
    >
      <Typography variant="h5">Notifications</Typography>
      <NotificationsList />
    </Box>
  );

  return (
    <div>
      <React.Fragment key={"right"}>
        <div onClick={toggleDrawer(true)}>{props.children}</div>
        <SwipeableDrawer
          anchor={"right"}
          open={state}
          onOpen={toggleDrawer(true)}
          onClose={toggleDrawer(false)}
        >
          {list()}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
