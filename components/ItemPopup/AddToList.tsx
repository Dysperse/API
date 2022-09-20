import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import type { ApiResponse } from "../../types/client";
import { useApi } from "../../hooks/useApi";

/**
 * Description
 * @param {any} {title
 * @param {any} handleClose}
 * @returns {JSX.Element}
 */
function RoomList({
  title,
  handleClose,
}: {
  title: string;
  handleClose: any;
}): JSX.Element {
  const { data, error }: ApiResponse = useApi("property/lists");

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
          <Skeleton animation="wave" key={Math.random().toString()} />
        ))}
      </>
    );
  return (
    <List sx={{ mt: -1 }}>
      {data.lists.map((list: any) => (
        <ListItem disablePadding key={list.id.toString()}>
          <ListItemButton
            sx={{ borderRadius: 5, py: 0.5, px: 2, transition: "none" }}
            onClick={() => {
              fetch(
                `/api/lists/create-item?${new URLSearchParams({
                  property: global.property.propertyId,
                  accessToken: global.property.accessToken,
                  parent: list.id,
                  title: title,
                  description: "",
                }).toString()}`,
                {
                  method: "POST",
                }
              )
                .then((res) => res.json())
                .then(() => {
                  toast.success("Added item!");
                  handleClose();
                });
            }}
          >
            <ListItemText primary={list.title} secondary={list.description} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

/**
 * Description
 * @param {any} {styles}
 * @param {any} item}
 * @returns {any}
 */
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
            variant="outlined"
            disableElevation
            size="large"
            sx={{ borderWidth: "2px!important", borderRadius: 9 }}
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
