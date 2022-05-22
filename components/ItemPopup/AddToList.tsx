import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import MenuItem from "@mui/material/MenuItem";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import useSWR from "swr";

function RoomList() {
  const url = "https://api.smartlist.tech/v2/lists/";
  const { error, data }: any = useSWR(url, () =>
    fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        token: global.session && global.session.accessToken,
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then((res) => res.json())
  );

  if (error) {
    return (
      <>
        Yikes! An error occured while trying to fetch your lists. Try reloading
        the page
      </>
    );
  }
  if (!data)
    return (
      <>
        {[...new Array(10)].map(() => (
          <Skeleton animation="wave" />
        ))}
      </>
    );
  return (
    <>
      <List sx={{ mt: -1 }}>
        {data.data.map((list: any) => (
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 9, py: 0.5, px: 2 }}>
              <ListItemText primary={list.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
export function AddToListModal({ handleClose }: any) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          handleClose();
        }}
        PaperProps={{
          sx: {
            width: "450px",
            maxWidth: "calc(100vw - 20px)",
            borderRadius: "28px",
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "800" }}>
          Add to list
          <DialogContentText id="alert-dialog-slide-description" sx={{ mt: 1 }}>
            Select a list
          </DialogContentText>
        </DialogTitle>
        <DialogContent>
          <RoomList />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            disableElevation
            size="large"
            sx={{ borderRadius: 99, px: 3, py: 1 }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <MenuItem disableRipple onClick={() => setOpen(true)}>
        <span
          className="material-symbols-rounded"
          style={{ marginRight: "10px" }}
        >
          receipt_long
        </span>
        Add to list
      </MenuItem>
    </>
  );
}
