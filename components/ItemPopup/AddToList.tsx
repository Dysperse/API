import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { RoomList } from "./RoomList";

export function AddToListModal({ title, handleClose }: any) {
  const [open, setOpen] = useState<boolean>(false);
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
          <RoomList title={title} handleClose={() => setOpen(false)} />
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
          style={{ marginRight: "15px" }}
        >
          receipt_long
        </span>
        Add to list
      </MenuItem>
    </>
  );
}
