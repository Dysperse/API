import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import { Navbar } from "./Navbar";
import { DrawerListItems } from "./Links";
import { BottomNav } from "./BottomNav";
import { FloatingActionButton } from "./FloatingActionButton";
import useWindowDimensions from "./useWindowDimensions";

const drawerWidth = 300;

function ResponsiveDrawer(props: any) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const { width }: any = useWindowDimensions();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <SwipeableDrawer
          container={container}
          onOpen={handleDrawerToggle}
          swipeAreaWidth={width > 900 ? 0 : 10}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              height: "100vh",
              overflowY: "scroll",
              width: drawerWidth
            }
          }}
        >
          <DrawerListItems handleDrawerToggle={handleDrawerToggle} />
        </SwipeableDrawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            width: drawerWidth,
            flexShrink: 0,
            height: "100px",
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              zIndex: 1000,
              height: "100vh",
              overflowY: "scroll",
              boxSizing: "border-box"
            }
          }}
          open
        >
          <DrawerListItems handleDrawerToggle={handleDrawerToggle} />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        {props.children}
        <Toolbar />
        <FloatingActionButton />
        <BottomNav />
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
