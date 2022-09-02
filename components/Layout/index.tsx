import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import { grey } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import Toolbar from "@mui/material/Toolbar";
import { encode } from "js-base64";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import router from "next/router";
import React from "react";
import useSWR from "swr";
import { BottomNav } from "./BottomNav";
import { DrawerListItems } from "./Links";
import { Navbar } from "./Navbar";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const drawerWidth = 260;
interface Room {
  name: string;
  id: number;
}
function CustomRoom({ collapsed, room }: { collapsed: any; room: Room }) {
  const [deleted, setDeleted] = React.useState<boolean>(false);
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
  const asHref = "/rooms/" + encode(room.id + "," + room.name) + "?custom=true";
  return deleted ? null : (
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
            boxShadow: "none !important",
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
        <MenuItem
          onClick={() => {
            handleClose();
            if (
              confirm(
                "Delete this room including the items in it? This action is irreversible."
              )
            ) {
              setDeleted(true);
              fetch(
                "/api/rooms/delete?" +
                  new URLSearchParams({
                    id: room.id.toString(),
                    propertyToken:
                      global.session.property[global.session.propertyIndex]
                        .propertyToken,
                    accessToken:
                      global.session.property[global.session.propertyIndex]
                        .accessToken,
                  }),
                {
                  method: "POST",
                }
              )
                .then(() => toast.success("Room deleted!"))
                .catch(() => {
                  toast.error("Failed to delete room");
                  setDeleted(false);
                });
            }
          }}
        >
          Delete
        </MenuItem>
        <MenuItem onClick={() => router.push("/rooms/" + room.id)}>
          View
        </MenuItem>
      </Menu>
      <Link
        href={"/rooms/" + encode(room.id + "," + room.name) + "?custom=true"}
      >
        <ListItemButton
          onContextMenu={handleContextMenu}
          sx={{
            pl: 2,
            ...(collapsed && {
              width: 70,
              mx: "auto",
            }),
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            transition: "none!important",
            color:
              (global.theme === "dark" ? grey[200] : "#606060") + "!important",
            "& span": {
              color:
                (global.theme === "dark" ? grey[200] : "#606060") +
                "!important",
            },
            borderRadius: 3,
            mb: 0.2,
            py: 0.8,
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
              background:
                global.theme === "dark"
                  ? "hsl(240, 11%, 17%)"
                  : "rgba(200,200,200,.3)",
            },
            "&:hover span": {
              color:
                (global.theme === "dark" ? grey[200] : grey[900]) +
                "!important",
            },
            ...(router.asPath === asHref && {
              backgroundColor:
                global.theme === "dark"
                  ? "hsl(240, 11%, 15%)"
                  : colors[global.themeColor][50],
              "&:hover,&:focus": {
                backgroundColor:
                  global.theme === "dark"
                    ? "hsl(240, 11%, 17%)"
                    : colors[global.themeColor][100],
                color:
                  colors[global.themeColor][
                    global.theme === "dark" ? 100 : 900
                  ],
              },
              "& span": {
                color:
                  colors[global.themeColor][
                    global.theme === "dark" ? 100 : 800
                  ] + "!important",
              },
              "&:hover span": {
                color:
                  colors[global.themeColor][
                    global.theme === "dark" ? 100 : 800
                  ] + "!important",
              },
              "&:active span": {
                color:
                  colors[global.themeColor][
                    global.theme === "dark" ? 200 : 900
                  ] + "!important",
              },
            }),
          }}
        >
          <ListItemIcon
            sx={{
              transform: "translateX(6px)",
              ...(router.asPath === asHref && {
                color: colors[global.themeColor][500],
              }),
            }}
          >
            <span className="material-symbols-outlined">label</span>
          </ListItemIcon>
          <ListItemText primary={room.name} />
        </ListItemButton>
      </Link>
    </>
  );
}

function CustomRooms({ collapsed }: any) {
  const url =
    "/api/rooms?" +
    new URLSearchParams({
      propertyToken: global.session.property[global.session.propertyIndex].id,
      accessToken:
        global.session.property[global.session.propertyIndex].accessToken,
    });

  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );
  if (error) return <div>Failed to load room!</div>;
  if (!data)
    return (
      <>
        {[...new Array(10)].map((_: any, id: number) => (
          <Box sx={{ px: 4, py: 2 }} key={id.toString()}>
            <Skeleton width={"200px"} animation={"wave"} />
          </Box>
        ))}
      </>
    );

  return (
    <>
      {data.data.map((room: Room, id: number) => (
        <CustomRoom collapsed={collapsed} room={room} key={id.toString()} />
      ))}
    </>
  );
}

function ResponsiveDrawer(props: any): JSX.Element {
  const [collapsed, setCollapsed] = React.useState(
    Cookies.get("collapsed") ? JSON.parse(Cookies.get("collapsed")) : false
  );

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
      <Navbar />
      <Box
        component="nav"
        sx={{
          width: { md: collapsed ? 100 : drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        <Drawer
          variant="permanent"
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "none", md: "block" },
            flexShrink: 0,
            height: "100px",
            borderRight: 0,
            [`& .MuiDrawer-paper`]: {
              maxWidth: collapsed ? 100 : drawerWidth,
              transition: "maxWidth 2s !important",
              textAlign: collapsed ? "center" : "",
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
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            customRooms={<CustomRooms collapsed={collapsed} />}
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
        <BottomNav />
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
