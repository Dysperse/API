import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";
import { AddToListModal } from "./AddToList";
import { InfoButton } from "./InfoButton";
import { QrCodeModal } from "./QrCodeModal";
import { ShareModal } from "./ShareModal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Puller } from "../Puller";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import toast from "react-hot-toast";

function Room({
  id,
  setDeleted,
  room,
  key,
  setMoveToRoomOpen,
  setDrawerState,
}: {
  id: number;
  setDeleted: any;
  room: string;
  key: number;
  setMoveToRoomOpen: any;
  setDrawerState: any;
}) {
  const [disabled, setDisabled] = useState(false);
  return (
    <ListItem
      button
      onClick={() => {
        setDisabled(true);
        fetch(
          "/api/inventory/moveToRoom?" +
            new URLSearchParams({
              id: id.toString(),
              room: room.toLowerCase().replace(" room", ""),
              lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              token:
                global.session.account.SyncToken ??
                global.session.property.propertyToken,
            }),
          {
            method: "POST",
          }
        ).then(() => {
          setDisabled(false);
          setDeleted(true);
          setMoveToRoomOpen(false);
          setDrawerState(false);
          setTimeout(() => {
            toast.success("Moved item!");
          }, 100);
        });
      }}
      sx={{ transition: "none!important", borderRadius: 3 }}
    >
      <ListItemText
        primary={
          <span
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {room}{" "}
            {disabled ? (
              <CircularProgress size={20} sx={{ ml: "auto" }} />
            ) : null}
          </span>
        }
      />
    </ListItem>
  );
}

export function ItemActionsMenu({
  room,
  setDrawerState,
  id,
  setDeleted,
  title,
  quantity,
  star,
}: any): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [openMoveToRoom, setMoveToRoomOpen] = React.useState<boolean>(false);
  const [openInfo, setOpenInfo] = React.useState<boolean>(false);

  const handleClose = () => {
    setOpenInfo(false);
  };
  // end info button
  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        onOpen={() => setMoveToRoomOpen(true)}
        open={openMoveToRoom}
        sx={{
          transition: "all .2s",
        }}
        onClose={() => setMoveToRoomOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "600px",
            maxHeight: "95vh",
            borderRadius: "30px 30px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
      >
        <Puller />
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontWeight: "800", p: 4, pb: 2 }}
        >
          Select a room
        </DialogTitle>
        <DialogContent sx={{ p: 4, pt: 0 }}>
          <DialogContentText id="alert-dialog-description">
            {[
              "Kitchen",
              "Bedroom",
              "Bathroom",
              "Garage",
              "Dining",
              "Living room",
              "Laundry room",
              "Storage room",
              "Camping",
              "Garden",
            ].map((room, index) => (
              <Room
                key={index}
                room={room}
                setDrawerState={setDrawerState}
                setMoveToRoomOpen={setMoveToRoomOpen}
                id={parseInt(id)}
                setDeleted={setDeleted}
              />
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            disableElevation
            size="large"
            sx={{ borderRadius: 99, borderWidth: "2px!important" }}
            onClick={() => setMoveToRoomOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </SwipeableDrawer>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        onOpen={() => setAnchorEl(null)}
        open={openInfo}
        sx={{
          transition: "all .2s",
        }}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "600px",
            maxHeight: "95vh",
            borderRadius: "30px 30px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
      >
        <Puller />
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontWeight: "800", p: 4, pb: 2 }}
        >
          Item information
        </DialogTitle>
        <DialogContent sx={{ width: "450px", maxWidth: "100vw", p: 4, pt: 0 }}>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="body2">{"Title"}</Typography>
            <Typography>{title}</Typography>
            <br />
            <Typography variant="body2">{"Quantity"}</Typography>
            <Typography>{quantity || "(no quantity)"}</Typography>
            <br />
            <Typography variant="body2">{"Starred"}</Typography>
            <Typography>{star === 1 ? "Starred" : "Not starred"}</Typography>
            <br />
            <Typography variant="body2">{"ID"}</Typography>
            <Typography>{id}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            disableElevation
            size="large"
            sx={{ borderRadius: 99 }}
            onClick={handleClose}
          >
            Done
          </Button>
        </DialogActions>
      </SwipeableDrawer>

      <Tooltip title="More">
        <IconButton
          disableRipple
          size="large"
          edge="end"
          color="inherit"
          sx={{
            transition: "none",
            mr: -1,
            color: global.theme === "dark" ? "hsl(240, 11%, 90%)" : "#606060",
            "&:hover": {
              background: "rgba(200,200,200,.3)",
              color: global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
            },
            "&:focus-within": {
              background:
                (global.theme === "dark"
                  ? colors[themeColor]["900"]
                  : colors[themeColor]["100"]) + "!important",
              color: global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
            },
          }}
          aria-label="menu"
          onClick={handleClick}
        >
          <span className="material-symbols-rounded">more_horiz</span>
        </IconButton>
      </Tooltip>
      <Menu
        BackdropProps={{ sx: { opacity: "0!important" } }}
        elevation={0}
        id="basic-menu"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transitionDuration={300}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        sx={{
          transition: "all .2s",
          "& .MuiPaper-root": {
            mt: 1,
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
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Box onClick={() => setAnchorEl(null)}>
          <InfoButton setOpenInfo={setOpenInfo} />
        </Box>
        <ShareModal title={title} quantity={quantity} room={room} />
        {room.toLowerCase() === "kitchen" && (
          <MenuItem disableRipple onClick={handleClose}>
            <span
              style={{ marginRight: "15px" }}
              className="material-symbols-rounded"
            >
              auto_awesome
            </span>
            Find recipes
          </MenuItem>
        )}
        {/* <MenuItem disableRipple onClick={handleClose}>
          <span
            style={{ marginRight: "15px" }}
            className="material-symbols-rounded"
          >
            person_add
          </span>
          Invite collaborators
        </MenuItem> */}
        {global.session.property.role !== "read-only" && (
          <AddToListModal handleClose={handleClose} title={title} />
        )}
        <QrCodeModal title={title} quantity={quantity} />
        {global.session.property.role !== "read-only" && (
          <MenuItem
            disableRipple
            onClick={() => {
              setMoveToRoomOpen(true);
              setAnchorEl(null);
            }}
          >
            <span
              style={{ marginRight: "15px" }}
              className="material-symbols-rounded"
            >
              place_item
            </span>
            Move to another room
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
