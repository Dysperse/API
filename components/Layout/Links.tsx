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
import ListSubheader from "@mui/material/ListSubheader";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import { useFormik } from "formik";
import { encode } from "js-base64";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import AddPopup from "../AddPopup";
import { neutralizeBack, revivalBack } from "../history-control";
import { Puller } from "../Puller";

function CreateRoom() {
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
      fetch(
        "/api/rooms/create?" +
          new URLSearchParams({
            propertyToken: global.session.property.propertyToken,
            accessToken: global.session.property.accessToken,
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
            "/rooms/" + encode(res.data.id + "," + values.name) + "?custom=true"
          );
          formik.resetForm();
        });
      setTimeout(() => setLoading(true), 20);
    },
  });
  return (
    <>
      <ListItemButton
        disableRipple
        sx={{ pl: 4, borderRadius: 5, transition: "none" }}
        onClick={toggleDrawer(true)}
        id="setCreateRoomModalOpen"
      >
        <ListItemIcon>
          <span className="material-symbols-rounded">add_location_alt</span>
        </ListItemIcon>
        <ListItemText primary="Create room" />
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
            borderRadius: 5,
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
}: any) {
  const router = useRouter();
  if (!router.asPath) router.asPath = "/dashboard";
  return (
    <Link href={href} as={asHref} replace>
      <ListItemButton
        sx={{
          pl: 2,
          transition: "none!important",
          color:
            (global.theme === "dark" ? grey[200] : "#606060") + "!important",
          "& span": {
            color:
              (global.theme === "dark" ? grey[200] : "#606060") + "!important",
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
              (global.theme === "dark" ? grey[200] : grey[900]) + "!important",
            background:
              global.theme === "dark"
                ? "hsl(240, 11%, 17%)"
                : "rgba(200,200,200,.3)",
          },
          "&:hover span": {
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

            "& span": {
              color:
                colors[global.themeColor][global.theme === "dark" ? 100 : 800] +
                "!important",
            },
            "&:hover span": {
              color:
                colors[global.themeColor][global.theme === "dark" ? 100 : 800] +
                "!important",
            },
            "&:active span": {
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
    </Link>
  );
});

export function DrawerListItems({ collapsed, setCollapsed, customRooms }: any) {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      sx={{ width: "100%", p: 1 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <>
        <Box
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            pt: 2,
          }}
        >
          <Toolbar />
        </Box>
        <div style={{ padding: "10px" }}>
          <AddPopup>
            <Fab
              disabled={global.session.property.role === "read-only"}
              // onMouseOver={() => setHide(false)}
              variant="extended"
              color="primary"
              disableRipple
              aria-label="add"
              sx={{
                borderRadius: "20px",
                px: 4,
                maxWidth: "100%",
                fontSize: "15px",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                "&:focus-within": {
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                },
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
                  transition: "none",
                  background:
                    global.theme === "dark"
                      ? "hsl(240, 11%, 40%)"
                      : colors[themeColor]["200"],
                },
                transition: "transform .2s",
                py: 2,
                textTransform: "none",
                height: "auto",
                maxHeight: "auto",
              }}
            >
              <span
                className="material-symbols-rounded"
                style={{
                  transition: "all .2s",
                  marginRight: "20px",
                  float: "left",
                }}
              >
                add_circle
              </span>
              New item
            </Fab>
          </AddPopup>
        </div>
        <div>
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
          <ListItem text="Overview" icon="layers" />
          <ListItem
            href="/finances"
            asHref="/finances"
            text="Finances"
            icon="savings"
          />
          <ListItem
            asHref="/save-the-planet"
            href="/save-the-planet"
            text="Eco friendliness"
            icon="eco"
          />
        </div>
        <div>
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
            {global.session.property.houseType === "dorm" ? "Dorm" : "Rooms"}
          </ListSubheader>
          {global.session.property.houseType !== "dorm" && (
            <ListItem
              href="/rooms/[index]"
              asHref="/rooms/kitchen"
              text="Kitchen"
              icon="oven_gen"
            />
          )}
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/bedroom"
            text="Bedroom"
            icon="bedroom_parent"
          />
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/bathroom"
            text="Bathroom"
            icon="bathroom"
          />
          {global.session.property.houseType !== "dorm" && (
            <ListItem
              href="/rooms/[index]"
              asHref="/rooms/garage"
              text="Garage"
              icon="garage"
            />
          )}
          {global.session.property.houseType !== "dorm" && (
            <ListItem
              href="/rooms/[index]"
              asHref="/rooms/dining"
              text="Dining room"
              icon="dining"
            />
          )}
          {global.session.property.houseType !== "dorm" && (
            <ListItem
              href="/rooms/[index]"
              asHref="/rooms/living-room"
              text={<>Living room</>}
              icon="living"
            />
          )}
          {global.session.property.houseType !== "dorm" && (
            <ListItem
              href="/rooms/[index]"
              asHref="/rooms/laundry-room"
              text="Laundry room"
              icon="local_laundry_service"
            />
          )}
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/storage-room"
            text={
              <>
                Storage {global.session.property.houseType !== "dorm" && "room"}
              </>
            }
            icon="inventory_2"
          />
        </div>
        {customRooms}
        {global.session.property.houseType !== "dorm" && (
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/camping"
            text="Camping"
            icon="camping"
          />
        )}
        {global.session.property.houseType !== "dorm" && (
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/garden"
            text="Garden"
            icon="yard"
          />
        )}
        <ListSubheader
          component="div"
          id="nested-list-subheader"
          sx={{
            pl: 2,
            position: {
              md: "unset",
            },
            ...(global.theme === "dark" && {
              background: { xs: "hsl(240, 11%, 15%)", md: "transparent" },
            }),
          }}
        >
          Other
        </ListSubheader>
        <ListItem
          href="/starred"
          asHref="/starred"
          text="Starred"
          icon="grade"
        />
        <ListItem href="/trash" asHref="/trash" text="Trash" icon="delete" />
      </>
    </List>
  );
}
