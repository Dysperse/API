import React from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Toolbar from "@mui/material/Toolbar";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import * as colors from "@mui/material/colors";
import { Puller } from "./Puller";

function CreateRoom() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const formik = useFormik({
    initialValues: {
      name: ""
    },
    onSubmit: async (values: { name: string }) => {
      fetch("https://api.smartlist.tech/v2/rooms/create/", {
        method: "POST",
        body: new URLSearchParams({
          token: res.session.accessToken,
          name: values.name
        })
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          setOpen(false);
          formik.resetForm();
          alert("Created room!");
          router.push("/rooms/" + res.data.id);
        });
        setTimeout(() => setLoading(true), 20)
    }
  });
  return (
    <>
      <ListItemButton
        sx={{ pl: 4, borderRadius: "0 40px 40px 0" }}
        onClick={toggleDrawer(true)}
      >
        <ListItemIcon>
          <span className="material-symbols-rounded">add_location_alt</span>
        </ListItemIcon>
        <ListItemText primary="Create room" />
      </ListItemButton>
      <SwipeableDrawer
        anchor="bottom"
        PaperProps={{
          sx: {
            width: {
              sm: "50vw"
            },
            borderRadius: "40px 40px 0 0",
            mx: "auto"
          }
        }}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        ModalProps={{
          keepMounted: true
        }}
      >
        <Puller />
        <DialogTitle sx={{ mt: 2, textAlign: "center" }}>
          Create list
        </DialogTitle>
        <Box sx={{ p: 3 }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              inputRef={(input) =>
                setTimeout(() => input && input.focus(), 100)
              }
              margin="dense"
              label="Room name"
              onChange={formik.handleChange}
              value={formik.values.name}
              fullWidth
              autoComplete={"off"}
              name="name"
              variant="filled"
            />

            <LoadingButton
              sx={{
                mt: 1,
                mr: 1,
                borderRadius: 9,
                textTransform: "none",
                float: "right",
                boxShadow: 0
              }}
              size="large"
              variant="contained"
              color="primary"
              type="submit"
              loading={loading}
              // onClick={() => setTimeout(setClickLoading, 10)}
            >
              Create
            </LoadingButton>
            <Button
              sx={{
                mt: 1,
                mr: 1,
                borderRadius: 9,
                textTransform: "none",
                float: "right"
              }}
              color="primary"
              type="button"
              size="large"
              variant="outlined"
              onClick={() => {
                // setLoading(false);
                // setOpen(false);
              }}
            >
              Back
            </Button>
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
  icon
}: any) {
  const router = useRouter();
  if (!router.asPath) router.asPath = "/dashboard";
  return (
    <Link href={href} as={asHref} replace>
      <ListItemButton
        sx={{
          pl: 4,
          mb: 0.1,
          transition: "none!important",
          borderRadius: "0 20px 20px 0",
          color: global.theme === "dark" ? grey[300] : grey[800],
          "& .MuiTouchRipple-rippleVisible": {
            animationDuration: ".3s!important"
          },
          "& .MuiTouchRipple-child": {
            filter: "opacity(.2)!important"
          },
          "&:hover,&:focus": {
            color: "#000",
            background: "rgba(200,200,200,.3)"
          },
          "&:hover span": {
            color:
              (global.theme === "dark" ? grey[200] : grey[800]) + "!important"
          },
          "&:active": {
            background: "rgba(200,200,200,.4)"
          },
          ...(router.asPath === asHref && {
            backgroundColor:
              colors[global.themeColor][global.theme === "dark" ? 900 : 50],
            color:
              colors[global.themeColor][global.theme === "dark" ? 50 : 900],
            "&:hover,&:focus": {
              backgroundColor:
                colors[global.themeColor][global.theme === "dark" ? 800 : 100],
              color:
                colors[global.themeColor][global.theme === "dark" ? 100 : 900]
            },
            "&:active": {
              backgroundColor:
                colors[global.themeColor][global.theme === "dark" ? 700 : 200]
            },
            "& span": {
              color:
                colors[global.themeColor][global.theme === "dark" ? 100 : 500] +
                "!important"
            },
            "&:hover span": {
              color:
                colors[global.themeColor][global.theme === "dark" ? 100 : 700] +
                "!important"
            },
            "&:active span": {
              color:
                colors[global.themeColor][global.theme === "dark" ? 200 : 800] +
                "!important"
            }
          })
        }}
      >
        <ListItemIcon
          sx={{
            ...(router.asPath === asHref && {
              color: colors[global.themeColor][500]
            })
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText sx={{ "& *": { fontSize: "15.2px" } }} primary={text} />
      </ListItemButton>
    </Link>
  );
});

export function DrawerListItems({ handleDrawerToggle, customRooms }: any) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      sx={{ width: "100%" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <>
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block"
            },
            pt: 2
          }}
        >
          <Toolbar />
        </Box>
        <div onClick={handleDrawerToggle}>
          <ListSubheader sx={{ pl: 2, fontSize: "15px" }}>Home</ListSubheader>
          <ListItem
            text="Overview"
            icon={<span className="material-symbols-rounded">home</span>}
          />
          <ListItem
            href="/finances"
            asHref="/finances"
            text="Finances"
            icon={<span className="material-symbols-rounded">payments</span>}
          />
          <ListItem
            asHref="/meals"
            href="/meals"
            text="Meals"
            icon={
              <span className="material-symbols-rounded">lunch_dining</span>
            }
          />
          {/* <ListItem href="/meals" text="Eco-friendly tips" icon={<SpaIcon />} /> */}
        </div>
        <div onClick={handleDrawerToggle}>
          <ListSubheader sx={{ pl: 2, fontSize: "15px" }}>Rooms</ListSubheader>
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/kitchen"
            text="Kitchen"
            icon={<span className="material-symbols-rounded">microwave</span>}
          />
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/bedroom"
            text="Bedroom"
            icon={
              <span className="material-symbols-rounded">bedroom_parent</span>
            }
          />
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/bathroom"
            text="Bathroom"
            icon={<span className="material-symbols-rounded">bathroom</span>}
          />
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/garage"
            text="Garage"
            icon={<span className="material-symbols-rounded">bathroom</span>}
          />
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/dining"
            text="Dining room"
            icon={<span className="material-symbols-rounded">dining</span>}
          />
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/living-room"
            text="Living room"
            icon={<span className="material-symbols-rounded">living</span>}
          />
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/laundry-room"
            text="Laundry room"
            icon={
              <span className="material-symbols-rounded">
                local_laundry_service
              </span>
            }
          />
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/storage-room"
            text="Storage room"
            icon={<span className="material-symbols-rounded">inventory_2</span>}
          />
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/camping"
            text="Camping"
            icon={<span className="material-symbols-rounded">image</span>}
          />
          <ListItem
            href="/rooms/[index]"
            asHref="/rooms/garden"
            text="Garden"
            icon={<span className="material-symbols-rounded">yard</span>}
          />
        </div>

        <ListItemButton
          onClick={handleClick}
          sx={{
            pl: 4,
            mb: 0.1,
            transition: "none!important",
            borderRadius: "0 20px 20px 0",
            color: grey[800],
            "& .MuiTouchRipple-rippleVisible": {
              animationDuration: ".3s!important"
            },
            "& .MuiTouchRipple-child": {
              filter: "opacity(.2)!important"
            },
            "&:hover": {
              color: "#000",
              background: "rgba(200,200,200,.3)"
            },
            "&:hover span": {
              color: grey[800] + "!important"
            },
            "&:active": {
              background: "rgba(200,200,200,.4)"
            }
          }}
        >
          <ListItemIcon>
            <span className="material-symbols-rounded">pin_drop</span>
          </ListItemIcon>
          <ListItemText primary="More rooms" />
          <span
            className="material-symbols-rounded"
            style={{
              transition: "all .2s",
              ...(open && {
                transform: "rotate(-180deg)"
              })
            }}
          >
            expand_more
          </span>
        </ListItemButton>
        <Collapse
          in={open}
          timeout="auto"
          unmountOnExit
          onClick={handleDrawerToggle}
        >
          <List component="div" disablePadding>
            {customRooms}
            <CreateRoom />
          </List>
        </Collapse>
        <ListSubheader
          component="div"
          id="nested-list-subheader"
          sx={{ pl: 2 }}
        >
          Other
        </ListSubheader>
        <ListItem
          href="/home-maintenance"
          asHref="/home-maintenance"
          text="Home maintenance"
          icon={<span className="material-symbols-rounded">label</span>}
        />
        <ListItem
          href="/starred"
          asHref="/starred"
          text="Starred items"
          icon={<span className="material-symbols-rounded">star</span>}
        />
        <ListItem
          href="/trash"
          asHref="/trash"
          text="Trash"
          icon={<span className="material-symbols-rounded">delete</span>}
        />
      </>
    </List>
  );
}
