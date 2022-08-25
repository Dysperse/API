import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import toast from "react-hot-toast";
import useSWR from "swr";

function RoomList({ title, handleClose }: { title: string; handleClose: any }) {
  const url =
    "/api/lists/items?" +
    new URLSearchParams({
      propertyToken: global.session.property.propertyToken,
      accessToken: global.session.property.accessToken,
    });
  const { error, data }: any = useSWR(url, () =>
    fetch(url, {
      method: "POST",
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
        {[...new Array(10)].map((_: any, id: number) => (
          <Skeleton animation="wave" key={id.toString()} />
        ))}
      </>
    );
  return (
    <>
      <List sx={{ mt: -1 }}>
        {data.map((list: any, id: number) => (
          <ListItem disablePadding key={id.toString()}>
            <ListItemButton
              sx={{ borderRadius: 9, py: 0.5, px: 2 }}
              onClick={() => {
                fetch(
                  "/api/lists/create-item?" +
                    new URLSearchParams({
                      propertyToken: global.session.property.propertyToken,
                      accessToken: global.session.property.accessToken,
                      parent: list.id,
                      title: title,
                      description: "",
                    }),
                  {
                    method: "POST",
                  }
                )
                  .then((res) => res.json())
                  .then((res) => {
                    toast.success("Added item!");
                    handleClose();
                  });
              }}
            >
              <ListItemText primary={list.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export function AddToListModal({ styles, item }: any) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        PaperProps={{
          elevation: 0,
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
          <RoomList title={item.title} handleClose={() => setOpen(false)} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            disableElevation
            size="large"
            sx={{ borderRadius: 99, px: 3, py: 1 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <ListItem sx={styles} button onClick={() => setOpen(true)}>
        <span className="material-symbols-rounded">receipt_long</span> Add to
        list
      </ListItem>
    </>
  );
}
