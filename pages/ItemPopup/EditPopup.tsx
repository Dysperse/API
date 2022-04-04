import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export function EditPopup({ children, itemData }) {
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
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <DialogContentText>{itemData.title}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Item name"
            type="text"
            fullWidth
            defaultValue={itemData.title}
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="qty"
            label="Quantity"
            type="text"
            fullWidth
            defaultValue={itemData.amount}
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
                fullWidth
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
