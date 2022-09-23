import LoadingButton from "@mui/lab/LoadingButton";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import { colors } from "../../lib/colors";
import { grey } from "@mui/material/colors";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { encode } from "js-base64";
import AddIcon from "@mui/icons-material/Add";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import AddPopup from "../AddPopup";
import { neutralizeBack, revivalBack } from "../history-control";
import { Puller } from "../Puller";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { Room } from "../../types/room";

/**
 * Create room popup
 * @param {any} {collapsed}
 * @returns {any}
 */
function CreateRoom({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  /**
   * Toggle the drawer's open state
   * @param {boolean} newOpen
   * @returns {any}
   */
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
    onSubmit: (values: { name: string }) => {
      setLoading(true);
      fetchApiWithoutHook("property/rooms/create", {
        name: values.name,
      }).then((res) => {
        setLoading(false);
        setOpen(false);
        router.push(
          `/rooms/${encode(`${res.id},${values.name}`).toString()}?custom=true`
        );
        formik.resetForm();
      });
    },
  });
  return (
    <>
      <ListItemButton
        id="setCreateRoomModalOpen"
        onClick={() => toggleDrawer(true)}
        sx={{
          ...(collapsed && {
            width: 70,
            mx: "auto",
            maxWidth: "calc(100% - 15px)",
          }),
          pl: collapsed ? 1.8 : 2,
          color: `${global.user.darkMode ? grey[200] : "#606060"}!important`,
          "& span:not(.MuiBadge-root, .MuiBadge-root *)": {
            color: `${global.user.darkMode ? grey[200] : "#606060"}!important`,
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
            color: `${global.user.darkMode ? grey[200] : grey[900]}!important`,
            background: global.user.darkMode
              ? "hsl(240, 11%, 17%)"
              : "rgba(200,200,200,.3)",
          },
          "&:hover span:not(.MuiBadge-root, .MuiBadge-root *)": {
            color: `${global.user.darkMode ? grey[200] : grey[900]}!important`,
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

        {!collapsed && <ListItemText primary="Create room" />}
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
            ...(global.user.darkMode && {
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
/**
 * List item
 * @param href
 * @param asHref
 * @param text
 * @param icon
 * @param collapsed
 */
const ListItem = React.memo(function ListItem({
  href = "/dashboard",
  asHref = "/dashboard",
  text,
  icon,
  collapsed,
}: {
  href?: string;
  asHref?: string;
  text: JSX.Element | string;
  icon: JSX.Element | string;
  collapsed: boolean;
}) {
  const router = useRouter();
  if (!router.asPath) router.asPath = "/dashboard";
  const template = (
    <ListItemButton
      disableRipple={collapsed}
      sx={{
        ...(collapsed && {
          width: 70,
          mx: "auto",
          maxWidth: "calc(100% - 15px)",
        }),
        pl: collapsed ? null : 2,
        color: `${global.user.darkMode ? grey[200] : "#606060"}!important`,
        "& span:not(.MuiBadge-root, .MuiBadge-root *)": {
          color: `${global.user.darkMode ? grey[200] : "#606060"}!important`,
        },
        borderRadius: collapsed ? 8 : 3,
        transition: "border-radius .2s, margin .2s!important",
        mb: collapsed ? 1 : 0.2,
        py: 0.8,
        "& .MuiTouchRipple-rippleVisible": {
          animationDuration: ".3s!important",
        },
        "& .MuiTouchRipple-child": {
          filter: "opacity(.2)!important",
        },
        "&:hover,&:focus": {
          color: `${global.user.darkMode ? grey[200] : grey[900]}!important`,
          background: global.user.darkMode
            ? "hsl(240, 11%, 17%)"
            : "rgba(200,200,200,.3)",
        },
        "&:hover span:not(.MuiBadge-root, .MuiBadge-root *)": {
          color: `${global.user.darkMode ? grey[200] : grey[900]}!important`,
        },
        ...(router.asPath === asHref && {
          borderRadius: collapsed ? 4 : 3,
          background: `linear-gradient(45deg, ${
            global.user.darkMode ? "hsl(240, 11%, 30%)" : colors[themeColor][50]
          }  0%, ${
            global.user.darkMode
              ? "hsl(240, 11%, 20%)"
              : colors[themeColor][200]
          } 100%)`,
          "&:hover,&:focus": {
            backgroundColor: global.user.darkMode
              ? "hsl(240, 11%, 17%)"
              : colors[global.themeColor][100],
            color: colors[global.themeColor][global.user.darkMode ? 100 : 900],
          },

          "& span:not(.MuiBadge-root, .MuiBadge-root *)": {
            color: `${
              colors[global.themeColor][global.user.darkMode ? 100 : 800]
            }!important`,
          },
          "&:hover span:not(.MuiBadge-root, .MuiBadge-root *)": {
            color: `${
              colors[global.themeColor][global.user.darkMode ? 100 : 800]
            }!important`,
          },
          "&:active span:not(.MuiBadge-root, .MuiBadge-root *)": {
            color: `${
              colors[global.themeColor][global.user.darkMode ? 200 : 900]
            }!important`,
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
          className={`material-symbols-${
            router.asPath === asHref ? "rounded" : "outlined"
          }`}
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
          {template}
        </Tooltip>
      ) : (
        template
      )}
    </Link>
  );
});

/**
 * List items in drawer
 * @param collapsed - Is the drawer colapsed
 * @param setCollapsed - Make the drawer collapsed / uncollapsed
 * @param customRooms - Custom rooms component
 * @param maintenance - Maintenance reminder count
 */
export function DrawerListItems({
  collapsed,
  setCollapsed,
  customRooms,
  maintenance,
}: {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  customRooms: JSX.Element;
  maintenance: Array<any>;
}) {
  return (
    <List
      sx={{ width: "100%", p: 1 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <Toolbar sx={{ mt: 2 }} />
      <div style={{ padding: "0 10px" }}>
        <AddPopup>
          <div>
            <Fab
              disabled={
                global.property.role === "read-only" || global.itemLimitReached
              }
              variant={collapsed ? "circular" : "extended"}
              disableRipple
              color="primary"
              aria-label="add"
              sx={{
                borderRadius: collapsed ? "100%" : "20px",
                fontSize: "15px",
                boxShadow: "none!important",
                transition:
                  "minWidth .2s, border-radius .2s ease-in-out, margin .2s,transform .2s !important",
                ...(collapsed && {
                  mt: 2.2,
                  mb: 3,
                }),
                "&:hover": {
                  ...(collapsed && {
                    borderRadius: 5,
                  }),
                },
                ...(!global.itemLimitReached && {
                  background: `linear-gradient(45deg, ${
                    global.user.darkMode
                      ? "hsl(240, 11%, 30%)"
                      : colors[themeColor][100]
                  }  0%, ${
                    global.user.darkMode
                      ? "hsl(240, 11%, 30%)"
                      : colors[themeColor][300]
                  } 100%)`,
                }),
                color: global.user.darkMode
                  ? "hsl(240, 11%, 95%)"
                  : colors[themeColor]["900"],
                "&:active": {
                  background: `${"linear-gradient(90deg, "}${
                    global.user.darkMode
                      ? "hsl(240, 11%, 30%)"
                      : colors[themeColor][200]
                  }  0%, ${
                    global.user.darkMode
                      ? "hsl(240, 11%, 30%)"
                      : colors[themeColor][500]
                  } 100%)`,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transform: "scale(.96)",
                },
                textTransform: "none",
              }}
            >
              <AddIcon sx={{ mr: collapsed ? 0 : 1 }} />
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
          </div>
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
              ...(global.user.darkMode && {
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
                  sx={{
                    ml: "auto",
                    mr: 1.2,
                    zIndex: 1,
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
            collapsed ? (
              <Badge
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
              "handyman"
            )
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
              ...(global.user.darkMode && {
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
            ...(global.user.darkMode && {
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
          color: `${global.user.darkMode ? grey[200] : "#606060"}!important`,
          "& span:not(.MuiBadge-root, .MuiBadge-root *)": {
            color: `${global.user.darkMode ? grey[200] : "#606060"}!important`,
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
            color: `${global.user.darkMode ? grey[200] : grey[900]}!important`,
            background: global.user.darkMode
              ? "hsl(240, 11%, 17%)"
              : "rgba(200,200,200,.3)",
          },
          "&:hover span:not(.MuiBadge-root, .MuiBadge-root *)": {
            color: `${global.user.darkMode ? grey[200] : grey[900]}!important`,
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
    </List>
  );
}
