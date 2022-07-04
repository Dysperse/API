import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import toast from "react-hot-toast";

export function ShareModal({ title, quantity, room }: any): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const href =
    "https://" +
    window.location.hostname +
    "/share/" +
    encodeURIComponent(
      JSON.stringify({
        title: title,
        quantity: quantity,
        room: room,
      })
    );
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const stopPropagationForTab = (event: any) => {
    if (event.key !== "Esc") {
      event.stopPropagation();
    }
  };

  return (
    <>
      <MenuItem disableRipple onClick={handleClickOpen}>
        <span
          className="material-symbols-rounded"
          style={{ marginRight: "15px" }}
        >
          share
        </span>
        Share
      </MenuItem>
      <Dialog
        onKeyDown={stopPropagationForTab}
        open={open}
        onClose={handleClose}
        sx={{
          transition: "all .2s",
        }}
        PaperProps={{
          sx: {
            p: 2,
            width: "500px",
            maxWidth: "calc(100vw - 30px)",
            borderRadius: "28px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "800" }}>Share</DialogTitle>
        <DialogContent>
          <TextField
            defaultValue={href}
            fullWidth
            sx={{ mt: 1 }}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            disableElevation
            size="large"
            sx={{ borderRadius: 99, px: 3, py: 1 }}
            onClick={() => {
              navigator.clipboard.writeText(href);
              toast.success("Copied link to clipboard");
              handleClose();
            }}
          >
            Copy link
          </Button>
          <Button
            variant="contained"
            disableElevation
            size="large"
            sx={{ borderRadius: 99, px: 3, py: 1 }}
            onClick={() => {
              navigator.share({
                url: href,
              });
              handleClose();
            }}
          >
            Share
          </Button>
          <Button
            variant="contained"
            disableElevation
            size="large"
            sx={{ borderRadius: 99, px: 3, py: 1 }}
            onClick={() => {
              window.open(href);
              handleClose();
            }}
          >
            Open
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
