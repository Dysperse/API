import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export function DeleteModal() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    document!
      .querySelector("meta[name='theme-color']")!
      .setAttribute("content", "#7f7f7f");
  };

  const handleClose = () => {
    setOpen(false);
    document!
      .querySelector("meta[name='theme-color']")!
      .setAttribute("content", "#eee");
  };

  return (
    <>
      <Tooltip enterDelay={1000} leaveDelay={200} title="Delete">
        <IconButton
          size="large"
          onClick={handleClickOpen}
          aria-label="search"
          edge="end"
          color="inherit"
          sx={{ ml: 1, mr: 0 }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete item?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can restore deleted items by viewing your trash.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
