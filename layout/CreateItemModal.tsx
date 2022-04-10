import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export function CreateItemModal({
  room,
  children
}: {
  room: string;
  children: any;
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div onClick={handleClickOpen}>{children}</div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Item</DialogTitle>
        <DialogContent>
          <DialogContentText>{room}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Item name"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="qty"
            label="Quantity"
            type="text"
            fullWidth
            variant="outlined"
          />
          <Autocomplete
            multiple
            id="categories"
            freeSolo
            limitTags={5}
            options={["1", "2", "3"]}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                {...params}
                margin="dense"
                label="Categories"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
