import * as React from "react";

import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import dynamic from "next/dynamic";
const SettingsIcon = dynamic(() => import("@mui/icons-material/Settings"));
const CloseIcon = dynamic(() => import("@mui/icons-material/Close"));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton edge="end" aria-label="comments" onClick={handleClickOpen}>
        <SettingsIcon />
      </IconButton>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ boxShadow: 0, position: "sticky" }}>
          <Toolbar>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{ ml: -0.5 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 4, flex: 1 }} variant="h6" component="div">
              Settings
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button>
            <ListItemText
              primary="Appearance"
              secondary="Current theme: Blue"
            />
          </ListItem>
          <ListItem button>
            <ListItemText
              primary="Finances"
              secondary="Manage your connected bank account"
            />
          </ListItem>
          <ListItem button>
            <ListItemText
              primary="Profile"
              secondary="View and edit your account details"
            />
          </ListItem>
          <ListItem button>
            <ListItemText
              primary="Connected apps"
              secondary="View and edit access to third-party apps"
            />
          </ListItem>
          <ListItem button>
            <ListItemText
              primary="Notifications"
              secondary="If an item's quantity is 10 or less"
            />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Developer" secondary="Manage API keys" />
          </ListItem>
          <ListItem button>
            <ListItemText
              primary="App"
              secondary="Download the Smartlist mobile and desktop app"
            />
          </ListItem>
          <ListItem button>
            <ListItemText
              primary="Login history"
              secondary="View previous logins to this account"
            />
          </ListItem>
          <ListItem button>
            <ListItemText
              primary="Sync"
              secondary="Sync your account with up to 3 people"
            />
          </ListItem>
          <Divider />

          <ListItem button>
            <ListItemText
              primary="Sign out"
              secondary="Sign out of Smartlist and it's related apps"
            />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Legal" secondary="Food for lawyers" />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}
