import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export function ItemDetails({ children, itemData }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    document
      .querySelector("meta[name='theme-color']")
      .setAttribute("content", "#7a7a7a");
  };

  const handleClose = () => {
    setOpen(false);
    document
      .querySelector("meta[name='theme-color']")
      .setAttribute("content", "#eee");
  };

  return (
    <div>
      <div onClick={handleClickOpen}>{children}</div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Info</DialogTitle>
        <DialogContent sx={{ width: "500px", maxWidth: "100vw" }}>
          {Object.keys(itemData).map((key) => (
            <>
              <Card sx={{ boxShadow: 0 }}>
                <CardContent sx={{ p: 0 }}>
                  <Typography
                    sx={{ textTransform: "capitalize", opacity: 0.6 }}
                  >
                    {key}
                  </Typography>
                  <Typography>{itemData[key] || "null"}</Typography>
                </CardContent>
              </Card>
            </>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Continue</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
