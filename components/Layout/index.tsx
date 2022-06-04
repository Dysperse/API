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
import { grey } from "@mui/material/colors";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import router from "next/router";
const drawerWidth = 300;
interface Room {
  name: string;
  id: number;
}
function CustomRoom({ room }: { room: Room }) {
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };
  return (
    <>
      <Menu
        BackdropProps={{
          sx: { opacity: "0!important" },
        }}
        sx={{
          transition: "all .2s",
          "& .MuiPaper-root": {
            borderRadius: "15px",
            minWidth: 180,
            background:
              global.theme === "dark"
                ? colors[global.themeColor][900]
                : colors[global.themeColor][100],

            color:
              global.theme === "dark"
                ? colors[global.themeColor][200]
                : colors[global.themeColor][800],
            "& .MuiMenu-list": {
              padding: "4px",
            },
            "& .MuiMenuItem-root": {
              "&:hover": {
                background:
                  global.theme === "dark"
                    ? colors[global.themeColor][800]
                    : colors[global.themeColor][200],
                color:
                  global.theme === "dark"
                    ? colors[global.themeColor][100]
                    : colors[global.themeColor][900],
                "& .MuiSvgIcon-root": {
                  color:
                    global.theme === "dark"
                      ? colors[global.themeColor][200]
                      : colors[global.themeColor][800],
                },
              },
              padding: "10px 15px",
              borderRadius: "15px",
              marginBottom: "1px",

              "& .MuiSvgIcon-root": {
                fontSize: 25,
                color: colors[global.themeColor][700],
                marginRight: 1.9,
              },
              "&:active": {
                background:
                  global.theme === "dark"
                    ? colors[global.themeColor][700]
                    : colors[global.themeColor][300],
              },
            },
          },
        }}
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleClose}>Delete</MenuItem>
        <MenuItem onClick={() => router.push("/rooms/" + room.id)}>
          View
        </MenuItem>
      </Menu>
      <Link href={"/rooms/" + room.id}>
        <ListItemButton
          onContextMenu={handleContextMenu}
          sx={{
            pl: 5,
            transition: "none!important",
            color:
              (global.theme === "dark" ? grey[200] : "#606060") + "!important",
            "& span": {
              color:
                (global.theme === "dark" ? grey[200] : "#606060") +
                "!important",
            },
            borderRadius: "0 200px 200px 0",
            "& .MuiTouchRipple-rippleVisible": {
              animationDuration: ".3s!important",
            },
            "& .MuiTouchRipple-child": {
              filter: "opacity(.2)!important",
            },
            "&:hover,&:focus": {
              color:
                (global.theme === "dark" ? grey[200] : grey[900]) +
                "!important",
              background: "rgba(200,200,200,.3)",
            },
            "&:hover span": {
              color:
                (global.theme === "dark" ? grey[200] : grey[900]) +
                "!important",
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
    </>
  );
}

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

  return (
    <>
      {data.data.map((room: Room) => (
        <CustomRoom room={room} />
      ))}
    </>
  );
}

function ResponsiveDrawer(props: any): JSX.Element {
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  useEffect(() => {
    if (document.querySelector(`meta[name="theme-color"]`))
      document
        .querySelector(`meta[name="theme-color"]`)!
        .setAttribute(
          "content",
          mobileOpen
            ? global.theme === "dark"
              ? "hsl(240, 11%, 5%)"
              : "#808080"
            : global.theme === "dark"
            ? "hsl(240, 11%, 10%)"
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
              ...(global.theme === "dark" && {
                background: "hsl(240, 11%, 15%)",
              }),
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
