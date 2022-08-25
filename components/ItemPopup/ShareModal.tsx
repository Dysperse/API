import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import toast from "react-hot-toast";

export function ShareModal({
  styles,
  title,
  quantity,
  room,
}: any): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const href =
    "https://" +
    window.location.hostname +
    "/share/" +
    encodeURIComponent(
      JSON.stringify({
        name: global.session.account.name,
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
  return (
    <>
      <Dialog
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
            Copy
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
      <ListItem button sx={styles} onClick={() => setOpen(true)}>
        <span className="material-symbols-rounded">share</span>
        Share
      </ListItem>
    </>
  );
}
