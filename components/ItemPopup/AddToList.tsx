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
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import type { ApiResponse } from "../../types/client";
import { useStatusBar } from "../../hooks/useStatusBar";
import type { List as ListType } from "../../types/list";
import type { Item as ItemType } from "../../types/item";

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
  handleClose: () => void;
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
        {[...new Array(10)].map(() => (
          <Skeleton animation="wave" key={Math.random().toString()} />
        ))}
      </>
    );
  return (
    <List sx={{ mt: -1 }}>
      {data.map((list: ListType) => (
        <ListItem disablePadding key={list.id.toString()}>
          <ListItemButton
            sx={{ borderRadius: 5, py: 0.5, px: 2, transition: "none" }}
            onClick={() => {
              fetchApiWithoutHook("lists/create-item", {
                parent: list.id,
                title: title,
                description: "",
              }).then(() => {
                toast.success("Added item!");
                handleClose();
              });
            }}
          >
            <ListItemText primary={list.name} secondary={list.description} />
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
export function AddToListModal({
  styles,
  item,
}: {
  styles: any;
  item: ItemType;
}) {
  const [open, setOpen] = useState<boolean>(false);
  useStatusBar(open, 1);

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
