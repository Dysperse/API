import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import { grey } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { encode } from "js-base64";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";
import { Puller } from "../Puller";

/**
 * Create room popup
 * @param {any} {collapsed}
 * @returns {any}
 */
function CreateRoom({ collapsed }: { collapsed: boolean }): JSX.Element {
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
        onClick={() => setOpen(true)}
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
            width: {
              xs: "100vw",
              sm: "50vw",
            },
            maxWidth: "500px",
            borderRadius: "20px 20px 0 0",
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
        <Box sx={{ p: 3 }}>
          <Typography sx={{ textAlign: "center", my: 2 }} variant="h6">
            Create room
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              label="Room name"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.name}
              fullWidth
              autoComplete={"off"}
              name="name"
            />

            <LoadingButton
              disableElevation
              variant="contained"
              sx={{
                mt: 1,
                width: "100%",
                borderRadius: 9,
                float: "right",
                borderWidth: "2px!important",
                boxShadow: 0,
              }}
              size="large"
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
  href = "/home",
  asHref = "/home",
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
  if (!router.asPath) router.asPath = "/home";
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
              : colors[themeColor][100]
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
              fontWeight: "700",
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
}: {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  customRooms: JSX.Element;
}) {
  return (
    <List
      sx={{ width: "100%", p: 1 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <Toolbar sx={{ mt: 2 }} />
      <div style={{ padding: "0 10px" }} />

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
