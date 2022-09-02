import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import * as colors from "@mui/material/colors";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Puller } from "../Puller";

function Room({
  id,
  setDeleted,
  room,
  setOpen,
  setDrawerState,
}: {
  id: number;
  setDeleted: any;
  room: string;
  setOpen: any;
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
              propertyToken:
                global.session.property[global.session.currentProperty]
                  .propertyToken,
              accessToken:
                global.session.property[global.session.currentProperty]
                  .accessToken,
            }),
          {
            method: "POST",
          }
        ).then(() => {
          setDisabled(false);
          setDeleted(true);
          setOpen(false);
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

export function MoveToRoom({ styles, item, setDeleted, setDrawerState }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        onOpen={() => setOpen(true)}
        open={open}
        sx={{
          transition: "all .2s",
        }}
        onClose={() => setOpen(false)}
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
                key={index.toString()}
                room={room}
                setDrawerState={setDrawerState}
                setOpen={setOpen}
                id={parseInt(item.id)}
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
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </SwipeableDrawer>

      <ListItem button sx={styles} onClick={() => setOpen(true)}>
        <span className="material-symbols-rounded">place_item</span>
        Move
      </ListItem>
    </>
  );
}
