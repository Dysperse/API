import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import { grey } from "@mui/material/colors";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Collapse from "@mui/material/Collapse";
import dayjs from "dayjs";
import Toolbar from "@mui/material/Toolbar";
import { useFormik } from "formik";
import { encode } from "js-base64";
import Badge from "@mui/material/Badge";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import AddPopup from "../AddPopup";
import { neutralizeBack, revivalBack } from "../history-control";
import { Puller } from "../Puller";
import Cookies from "js-cookie";

function CreateRoom({ collapsed }: any) {
  const router = useRouter();
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values: { name: string }) => {
      setLoading(true);
      fetch(
        "/api/property/rooms/create?" +
          new URLSearchParams({
            property: global.property.propertyId,
            accessToken: global.property.accessToken,
            name: values.name,
          }),
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          setOpen(false);
          router.push(
            "/rooms/" + encode(res.id + "," + values.name) + "?custom=true"
          );
          formik.resetForm();
        });
    },
  });
  return (
    <>
      <ListItemButton
        id="setCreateRoomModalOpen"
        onClick={toggleDrawer(true)}
        sx={{
          ...(collapsed && {
            width: 70,
            mx: "auto",
            maxWidth: "calc(100% - 15px)",
          }),
          pl: collapsed ? 1.8 : 2,
          color:
            (global.theme === "dark" ? grey[200] : "#606060") + "!important",
          "& span:not(.badge, .badge *)": {
            color:
              (global.theme === "dark" ? grey[200] : "#606060") + "!important",
          },
          borderRadius: collapsed ? 6 : 3,
          transition: "margin .2s!important",
          mb: collapsed ? 1 : 0.2,
          py: 0.8,
          "& .MuiTouchRipple-rippleVisible": {
            animationDuration: ".3s!important",
          },
          "& .MuiTouchRipple-child": {
            filter: "opacity(.2)!important",
          },
          "&:hover,&:focus": {
            color:
              (global.theme === "dark" ? grey[200] : grey[900]) + "!important",
            background:
              global.theme === "dark"
                ? "hsl(240, 11%, 17%)"
                : "rgba(200,200,200,.3)",
          },
          "&:hover span:not(.badge, .badge *)": {
            color:
              (global.theme === "dark" ? grey[200] : grey[900]) + "!important",
          },
        }}
      >
        <ListItemIcon>
          <span
            className="material-symbols-rounded"
            style={{ marginLeft: "5px" }}
          >
            add_location_alt
          </span>
        </ListItemIcon>

        {collapsed ? <></> : <ListItemText primary="Create room" />}
      </ListItemButton>
      <SwipeableDrawer
        anchor="bottom"
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              xs: "100vw",
              sm: "50vw",
            },
            maxWidth: "700px",
            "& *:not(.MuiTouchRipple-child, .puller)": {
              background: "transparent!important",
            },
            borderRadius: "30px 30px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 20%)",
            }),
          },
        }}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Puller />
        <DialogTitle sx={{ mt: 2, textAlign: "center" }}>
          Create room
        </DialogTitle>
        <Box sx={{ p: 3 }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              label="Room name"
              onChange={formik.handleChange}
              value={formik.values.name}
              fullWidth
              autoComplete={"off"}
              name="name"
              variant="outlined"
            />

            <LoadingButton
              sx={{
                mt: 1,
                mr: 1,
                borderRadius: 9,
                float: "right",
                borderWidth: "2px!important",
                boxShadow: 0,
              }}
              size="large"
              variant="outlined"
              type="submit"
              color="primary"
              loading={loading}
            >
              Create
            </LoadingButton>
          </form>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

const ListItem = React.memo(function ListItem({
  href = "/dashboard",
  asHref = "/dashboard",
  text,
  icon,
  collapsed,
}: any) {
  const router = useRouter();
  if (!router.asPath) router.asPath = "/dashboard";
  const c = (
    <ListItemButton
      sx={{
        ...(collapsed && {
          width: 70,
          mx: "auto",
          maxWidth: "calc(100% - 15px)",
        }),
        pl: collapsed ? 1.8 : 2,
        color: (global.theme === "dark" ? grey[200] : "#606060") + "!important",
        "& span:not(.badge, .badge *)": {
          color:
            (global.theme === "dark" ? grey[200] : "#606060") + "!important",
        },
        borderRadius: collapsed ? 6 : 3,
        transition: "margin .2s!important",
        mb: collapsed ? 1 : 0.2,
        py: 0.8,
        "& .MuiTouchRipple-rippleVisible": {
          animationDuration: ".3s!important",
        },
        "& .MuiTouchRipple-child": {
          filter: "opacity(.2)!important",
        },
        "&:hover,&:focus": {
          color:
            (global.theme === "dark" ? grey[200] : grey[900]) + "!important",
          background:
            global.theme === "dark"
              ? "hsl(240, 11%, 17%)"
              : "rgba(200,200,200,.3)",
        },
        "&:hover span:not(.badge, .badge *)": {
          color:
            (global.theme === "dark" ? grey[200] : grey[900]) + "!important",
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
              colors[global.themeColor][global.theme === "dark" ? 100 : 900],
          },

          "& span:not(.badge, .badge *)": {
            color:
              colors[global.themeColor][global.theme === "dark" ? 100 : 800] +
              "!important",
          },
          "&:hover span:not(.badge, .badge *)": {
            color:
              colors[global.themeColor][global.theme === "dark" ? 100 : 800] +
              "!important",
          },
          "&:active span:not(.badge, .badge *)": {
            color:
              colors[global.themeColor][global.theme === "dark" ? 200 : 900] +
              "!important",
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
        <span
          className={
            "material-symbols-" +
            (router.asPath === asHref ? "rounded" : "outlined")
          }
        >
          {icon}
        </span>
      </ListItemIcon>
      <ListItemText
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          "& *": {
            fontSize: "15.2px",
            ...(router.asPath === asHref && {
              fontWeight: "500",
            }),
          },
        }}
        primary={text}
      />
    </ListItemButton>
  );
  return (
    <Link href={href} as={asHref} replace>
      {collapsed ? (
        <Tooltip title={text} placement="right">
          {c}
        </Tooltip>
      ) : (
        c
      )}
    </Link>
  );
});

export function DrawerListItems({
  collapsed,
  setCollapsed,
  customRooms,
  maintenance,
}: any) {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <List
      sx={{ width: "100%", p: 1 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <Box>
        <Toolbar sx={{ mt: 2 }} />
        <div style={{ padding: "0 10px" }}>
          <AddPopup>
            <Fab
              disabled={global.property.role === "read-only"}
              variant="extended"
              color="primary"
              disableRipple
              aria-label="add"
              sx={{
                borderRadius: "20px",
                maxWidth: "100%",
                fontSize: "15px",
                minWidth: !collapsed ? "5px" : "100%",
                transition: "minWidth .2s, margin .2s,transform .2s !important",
                ...(collapsed && { mb: 3, py: 3.5, mt: 2.2 }),
                boxShadow: "0",
                background:
                  global.theme === "dark"
                    ? "hsl(240, 11%, 30%)"
                    : colors[themeColor][100],
                color:
                  global.theme === "dark"
                    ? "hsl(240, 11%, 95%)"
                    : colors[themeColor]["900"],
                "&:hover": {
                  background:
                    global.theme === "dark"
                      ? "hsl(240, 11%, 35%)"
                      : colors[themeColor]["200"],
                },
                "&:active": {
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transform: "scale(.96)",
                  transition: "none!important",
                  background:
                    global.theme === "dark"
                      ? "hsl(240, 11%, 40%)"
                      : colors[themeColor]["200"],
                },
                textTransform: "none",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  transition: "all .2s",
                  marginRight: collapsed ? 0 : "20px",
                  float: "left",
                }}
              >
                add_to_photos
              </span>
              <Collapse
                in={!collapsed}
                orientation="horizontal"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  my: collapsed ? 2 : 0,
                }}
              >
                New item
              </Collapse>
            </Fab>
          </AddPopup>
        </div>
        <div>
          <Collapse in={!collapsed}>
            <ListSubheader
              sx={{
                pl: 2,
                position: {
                  md: "unset",
                },
                fontSize: "15px",
                ...(global.theme === "dark" && {
                  background: { xs: "hsl(240, 11%, 15%)", md: "transparent" },
                }),
              }}
            >
              Home
            </ListSubheader>
          </Collapse>
          <ListItem collapsed={collapsed} text="Home" icon="view_timeline" />
          <ListItem
            collapsed={collapsed}
            href="/notes"
            asHref="/notes"
            text="Notes"
            icon="sticky_note_2"
          />
          <ListItem
            collapsed={collapsed}
            href="/maintenance"
            asHref="/maintenance"
            text={
              <Box sx={{ display: "flex" }}>
                Maintenance
                {!collapsed && (
                  <Badge
                    className="badge"
                    sx={{
                      ml: "auto",
                      mr: 1.2,
                      zIndex: -1,
                      my: "auto",
                      "& .MuiBadge-badge": {
                        borderRadius: 2,
                        background: colors.red["100"],
                        color: colors.red["900"],
                      },
                    }}
                    badgeContent={
                      maintenance
                        ? maintenance.filter((reminder) =>
                            dayjs(reminder.nextDue).isBefore(dayjs())
                          ).length
                        : 0
                    }
                    color="error"
                  />
                )}
              </Box>
            }
            icon={
              <>
                {collapsed ? (
                  <Badge
                    className="badge"
                    sx={{
                      ml: "auto",
                      mr: 1.2,
                      zIndex: -1,
                      my: "auto",
                      "& .MuiBadge-badge": {
                        borderRadius: 2,
                        background: colors.red["100"],
                        color: colors.red["900"],
                      },
                    }}
                    badgeContent={
                      maintenance
                        ? maintenance.filter((reminder) =>
                            dayjs(reminder.nextDue).isBefore(dayjs())
                          ).length
                        : 0
                    }
                    color="error"
                  >
                    <span className="material-symbols-outlined">handyman</span>
                  </Badge>
                ) : (
                  <>handyman</>
                )}
              </>
            }
          />
        </div>
        <div>
          <Collapse in={!collapsed}>
            <ListSubheader
              sx={{
                pl: 2,
                fontSize: "15px",
                position: {
                  md: "unset",
                },
                ...(global.theme === "dark" && {
                  background: { xs: "hsl(240, 11%, 15%)", md: "transparent" },
                }),
              }}
            >
              {global.property.profile.type === "dorm" ? "Dorm" : "Rooms"}
            </ListSubheader>
          </Collapse>

          <Collapse in={collapsed}>
            <Divider sx={{ my: 1 }} />
          </Collapse>
          {global.property.profile.type !== "dorm" && (
            <ListItem
              collapsed={collapsed}
              href="/rooms/[index]"
              asHref="/rooms/kitchen"
              text="Kitchen"
              icon="kitchen"
            />
          )}
          <ListItem
            collapsed={collapsed}
            href="/rooms/[index]"
            asHref="/rooms/bedroom"
            text="Bedroom"
            icon="bedroom_child"
          />
          <ListItem
            collapsed={collapsed}
            href="/rooms/[index]"
            asHref="/rooms/bathroom"
            text="Bathroom"
            icon="bathroom"
          />
          {global.property.profile.type !== "dorm" && (
            <ListItem
              collapsed={collapsed}
              href="/rooms/[index]"
              asHref="/rooms/garage"
              text="Garage"
              icon="garage"
            />
          )}
          {global.property.profile.type !== "dorm" && (
            <ListItem
              collapsed={collapsed}
              href="/rooms/[index]"
              asHref="/rooms/dining"
              text="Dining room"
              icon="dining"
            />
          )}
          {global.property.profile.type !== "dorm" && (
            <ListItem
              collapsed={collapsed}
              href="/rooms/[index]"
              asHref="/rooms/living-room"
              text={<>Living room</>}
              icon="living"
            />
          )}
          {global.property.profile.type !== "dorm" && (
            <ListItem
              collapsed={collapsed}
              href="/rooms/[index]"
              asHref="/rooms/laundry-room"
              text="Laundry room"
              icon="local_laundry_service"
            />
          )}
          <ListItem
            collapsed={collapsed}
            href="/rooms/[index]"
            asHref="/rooms/storage-room"
            text={
              <>Storage {global.property.profile.type !== "dorm" && "room"}</>
            }
            icon="inventory_2"
          />
        </div>
        <Divider sx={{ my: 1 }} />
        {customRooms}
        {global.property.profile.type !== "dorm" && (
          <ListItem
            collapsed={collapsed}
            href="/rooms/[index]"
            asHref="/rooms/camping"
            text="Camping"
            icon="camping"
          />
        )}
        {global.property.profile.type !== "dorm" && (
          <ListItem
            collapsed={collapsed}
            href="/rooms/[index]"
            asHref="/rooms/garden"
            text="Garden"
            icon="yard"
          />
        )}
        <CreateRoom collapsed={collapsed} />
        <Collapse in={!collapsed}>
          <ListSubheader
            sx={{
              pl: 2,
              fontSize: "15px",
              position: {
                md: "unset",
              },
              ...(global.theme === "dark" && {
                background: { xs: "hsl(240, 11%, 15%)", md: "transparent" },
              }),
            }}
          >
            More
          </ListSubheader>
        </Collapse>

        <Collapse in={collapsed}>
          <Divider sx={{ my: 1 }} />
        </Collapse>
        <ListItem
          collapsed={collapsed}
          href="/starred"
          asHref="/starred"
          text="Starred"
          icon="grade"
        />
        <ListItem
          collapsed={collapsed}
          href="/trash"
          asHref="/trash"
          text="Trash"
          icon="delete"
        />
        <Divider sx={{ my: 1 }} />
        <ListItem
          collapsed={collapsed}
          href="https://smartlist.canny.io/general-feedback"
          asHref="https://smartlist.canny.io/general-feedback"
          text="Submit feedback"
          icon="chat"
        />
        <ListItem
          collapsed={collapsed}
          href="https://smartlist.canny.io/feature-requests"
          asHref="https://smartlist.canny.io/feature-requests"
          text="Suggest a feature"
          icon="reviews"
        />
        <Collapse in={collapsed}>
          <Divider sx={{ my: 1 }} />
        </Collapse>
        <ListItemButton
          onClick={() => {
            setCollapsed(!collapsed);
            Cookies.set("collapsed", collapsed ? "false" : "true");
          }}
          sx={{
            ...(collapsed && {
              width: 70,
              mx: "auto",
            }),
            pl: 2,
            color:
              (global.theme === "dark" ? grey[200] : "#606060") + "!important",
            "& span:not(.badge, .badge *)": {
              color:
                (global.theme === "dark" ? grey[200] : "#606060") +
                "!important",
            },
            borderRadius: 3,
            transition: "margin .2s!important",
            mb: collapsed ? 1 : 0.2,
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
            "&:hover span:not(.badge, .badge *)": {
              color:
                (global.theme === "dark" ? grey[200] : grey[900]) +
                "!important",
            },
          }}
        >
          <ListItemIcon
            sx={{
              transform: "translateX(6px)",
            }}
          >
            <span className={"material-symbols-rounded"}>
              chevron_{collapsed ? "right" : "left"}
            </span>
          </ListItemIcon>
          <ListItemText
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              "& *": {
                fontSize: "15.2px",
              },
            }}
            primary={!collapsed ? "Collapse menu" : "Expand menu"}
          />
        </ListItemButton>
      </Box>
    </List>
  );
}
