import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import React from "react";

export function InfoButton({ id, title, quantity, star }: any): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MenuItem disableRipple onClick={handleClickOpen}>
        <span
          style={{ marginRight: "10px" }}
          className="material-symbols-rounded"
        >
          info
        </span>
        View details
      </MenuItem>
      <Dialog
        open={open}
        sx={{
          transition: "all .2s",
        }}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: "28px",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: "800" }}>
          {"Item information"}
        </DialogTitle>
        <DialogContent sx={{ width: "450px", maxWidth: "100vw" }}>
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
        <DialogActions>
          <Button
            variant="contained"
            disableElevation
            size="large"
            sx={{ borderRadius: 99, px: 3, py: 1 }}
            onClick={handleClose}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
