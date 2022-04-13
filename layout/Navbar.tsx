import * as React from "react";

import dynamic from "next/dynamic";
import { ProfileMenu } from "./Profile";
import { NotificationsMenu } from "./Notifications";
import AppBar from "@mui/material/AppBar";

import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";

export function Navbar({ handleDrawerToggle }: any): JSX.Element {
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
        <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
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
