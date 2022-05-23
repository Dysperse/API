import LabelIcon from "@mui/icons-material/Label";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import React, { useEffect } from "react";
import useSWR from "swr";
import useWindowDimensions from "../useWindowDimensions";
import { BottomNav } from "./BottomNav";
import { FloatingActionButton } from "./FloatingActionButton";
import { DrawerListItems } from "./Links";
import { Navbar } from "./Navbar";

const drawerWidth = 300;

function CustomRooms() {
  const url = "https://api.smartlist.tech/v2/rooms/";

  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        token: global.session && global.session.accessToken,
      }),
    }).then((res) => res.json())
  );
  if (error) return <div>Failed to load room!</div>;
  if (!data)
    return (
      <>
        {[...new Array(10)].map(() => (
          <Box sx={{ px: 4, py: 2 }}>
            <Skeleton width={"200px"} animation={"wave"} />
          </Box>
        ))}
      </>
    );
  interface Room {
    name: string;
    id: number;
  }
  return (
    <>
      {data.data.map((room: Room) => (
        <Link href={"/rooms/" + room.id}>
          <ListItemButton
            sx={{
              pl: 6,
              mb: 0.1,
              transition: "none!important",
              borderRadius: "0 20px 20px 0",
              color: colors["grey"][800],
              "& .MuiTouchRipple-rippleVisible": {
                animationDuration: ".3s!important",
              },
              "& .MuiTouchRipple-child": {
                filter: "opacity(.2)!important",
              },
              "&:hover": {
                color: "#000",
                background: "rgba(200,200,200,.3)",
              },
              "&:hover span": {
                color: colors["grey"][800] + "!important",
              },
              "&:active": {
                background: "rgba(200,200,200,.4)",
              },
            }}
          >
            <ListItemIcon>
              <LabelIcon />
            </ListItemIcon>
            <ListItemText primary={room.name} />
          </ListItemButton>
        </Link>
      ))}
    </>
  );
}

function ResponsiveDrawer(props: any): JSX.Element {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  useEffect(() => {
    if (document.querySelector(`meta[name="theme-color"]`))
      document
        .querySelector(`meta[name="theme-color"]`)!
        .setAttribute(
          "content",
          mobileOpen
            ? global.theme === "dark"
              ? "#101010"
              : "#808080"
            : colors[global.themeColor][100]
        );
  });
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const { width }: any = useWindowDimensions();

  return (
    <Box
      sx={{
        display: "flex",
        "& *::selection": {
          color: "#fff",
          background: colors[themeColor]["A700"],
        },
      }}
    >
      <CssBaseline />
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="nav"
        sx={{ width: { sm: "65px", md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <SwipeableDrawer
          variant="temporary"
          swipeAreaWidth={width > 992 ? 0 : 10}
          open={mobileOpen}
          PaperProps={{
            sx: {
              boxShadow: 0,
              overscrollBehavior: "none",
              pr: "2px",
              borderRadius: "0 20px 20px 0",
            },
          }}
          onClose={handleDrawerToggle}
          onOpen={() => setMobileOpen(true)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              height: "100vh",
              overflowY: "scroll",
              width: drawerWidth,
            },
          }}
        >
          <DrawerListItems
            customRooms={<CustomRooms />}
            handleDrawerToggle={handleDrawerToggle}
          />
        </SwipeableDrawer>
        <Drawer
          variant="permanent"
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "none", md: "block" },
            width: drawerWidth,
            flexShrink: 0,
            height: "100px",
            borderRight: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              borderRight: 0,
              zIndex: 1000,
              height: "100vh",
              overflowY: "scroll",
              boxSizing: "border-box",
            },
          }}
          open
        >
          <DrawerListItems
            customRooms={<CustomRooms />}
            handleDrawerToggle={handleDrawerToggle}
          />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 90,
          p: 0,
          width: {
            sm: `calc(100% - 65px)`,
            md: `calc(100% - ${drawerWidth}px)`,
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            py: {
              sm: 1,
              xs: 0.5,
            },
          }}
        >
          {props.children}
          <Box sx={{ display: { sm: "none" } }}>
            <Toolbar />
          </Box>
        </Box>
        <FloatingActionButton />
        <BottomNav />
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
