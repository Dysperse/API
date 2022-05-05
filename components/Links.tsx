import React from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import { blue, grey } from "@mui/material/colors";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Skeleton from "@mui/material/Skeleton";
import Toolbar from "@mui/material/Toolbar";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import * as colors from "@mui/material/colors";

function CreateRoom() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

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
        <DialogTitle sx={{ mt: 2, textAlign: "center" }}>
          Create list
        </DialogTitle>
        <Box sx={{ p: 3 }}>
          <TextField
            inputRef={(input) => setTimeout(() => input && input.focus(), 100)}
            margin="dense"
            label="Room name"
            fullWidth
            autoComplete={"off"}
            name="name"
            variant="filled"
          />

          <LoadingButton
            sx={{ mt: 1, float: "right" }}
            color="primary"
            type="submit"
            loading={false}
            // onClick={() => setTimeout(setClickLoading, 10)}
          >
            Create
          </LoadingButton>
          <Button
            sx={{ mt: 1, mr: 1, float: "right" }}
            color="primary"
            type="button"
            onClick={() => {
              // setLoading(false);
              // setOpen(false);
            }}
          >
            Back
          </Button>
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
          transition: "none!important",
          borderRadius: "0 20px 20px 0",
          color: grey[700],
          "& .MuiTouchRipple-rippleVisible": {
            animationDuration: ".3s!important"
          },
          "& .MuiTouchRipple-child": {
            filter: "opacity(.2)!important"
          },
          "&:hover": {
            color: grey[900],
            background: "rgba(200,200,200,.3)"
          },
          "&:hover span": {
            color: grey[800] + "!important"
          },
          "&:active": {
            background: "rgba(200,200,200,.4)"
          },
          ...(router.asPath === asHref && {
            backgroundColor: colors[themeColor]["50"],
            color: colors[themeColor]["900"],
            "&:hover": {
              backgroundColor: colors[themeColor]["100"],
              color: colors[themeColor]["900"]
            },
            "&:active": {
              backgroundColor: colors[themeColor]["100"]
            },
            "& span": {
              color: colors[themeColor]["500"] + "!important"
            },
            "&:hover span": {
              color: colors[themeColor]["700"] + "!important"
            },
            "&:active span": {
              color: colors[themeColor]["800"] + "!important"
            }
          })
        }}
      >
        <ListItemIcon
          sx={{
            ...(router.asPath === asHref && {
              color: blue[500]
            })
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText sx={{ "& *": { fontSize: "15.5px" } }} primary={text} />
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
      {global.session ? (
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
            <ListSubheader sx={{ pl: 2 }}>Home</ListSubheader>
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
            <ListSubheader sx={{ pl: 2 }}>Rooms</ListSubheader>
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
              icon={
                <span className="material-symbols-rounded">inventory_2</span>
              }
            />
            <ListItem
              href="/rooms/[index]"
              asHref="/rooms/camping"
              text="Camping"
              icon={<span className="material-symbols-rounded">landscape</span>}
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
            sx={{ borderRadius: "0 40px 40px 0" }}
          >
            <ListItemIcon>
              <span className="material-symbols-rounded">add_location</span>
            </ListItemIcon>
            <ListItemText primary="More rooms" />
            <span className="material-symbols-rounded">
              {open ? "expand_less" : "expand_more"}
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
      ) : (
        <>
          <Toolbar />
          <Box sx={{ p: 3 }}>
            <Skeleton sx={{ mb: 3 }} width={"100px"} animation="wave" />
            <Skeleton sx={{ mb: 3 }} width={"200px"} animation="wave" />
            <Skeleton sx={{ mb: 5 }} width={"200px"} animation="wave" />
            <Skeleton sx={{ mb: 3 }} width={"100px"} animation="wave" />
            {[...new Array(13)].map(() => (
              <Skeleton sx={{ mb: 3 }} width={"200px"} animation="wave" />
            ))}
          </Box>
        </>
      )}
    </List>
  );
}
