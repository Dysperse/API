import * as React from "react";

import dynamic from "next/dynamic";
import { ProfileMenu } from "./Profile";
import { NotificationsMenu } from "./Notifications";

const AppBar = dynamic(() => import("@mui/material/AppBar"));
const IconButton = dynamic(() => import("@mui/material/IconButton"));
const Toolbar = dynamic(() => import("@mui/material/Toolbar"));
const Typography = dynamic(() => import("@mui/material/Typography"));
const MenuIcon = dynamic(() => import("@mui/icons-material/Menu"));

const NotificationsIcon = dynamic(() =>
  import("@mui/icons-material/Notifications")
);
const SearchIcon = dynamic(() => import("@mui/icons-material/Search"));

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
