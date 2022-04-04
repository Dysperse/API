import * as React from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { ProfileMenu } from "./Profile";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { NotificationsMenu } from "./Notifications";

export function Navbar({ handleDrawerToggle }: any) {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer."
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap component="div">
          {global.ACCOUNT_DATA.houseName}
        </Typography>
        <NotificationsMenu>
          <IconButton color="inherit" edge="end" size="large" sx={{ mr: 0.5 }}>
            <NotificationsIcon />
          </IconButton>
        </NotificationsMenu>
        <IconButton color="inherit" edge="end" size="large" sx={{ mr: 0.5 }}>
          <SearchIcon />
        </IconButton>
        <ProfileMenu />
      </Toolbar>
    </AppBar>
  );
}
