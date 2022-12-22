import type { Item as ItemType } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import type { ApiResponse } from "../../types/client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
} from "@mui/material";

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
      {data.map((list: any) => (
        <ListItem
          disablePadding
          key={list.id.toString()}
          disabled={global.permission == "read-only"}
        >
          <ListItemButton
            sx={{ borderRadius: 5, py: 0.5, px: 2, transition: "none" }}
            onClick={() => {
              fetchApiWithoutHook("property/lists/createItem", {
                list: list.id,
                name: title,
                details: "",
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
  styles: {
    [key: string]:
      | string
      | number
      | boolean
      | {
          [key: string]: string | number | boolean;
        };
  };
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
          <RoomList title={item.name} handleClose={() => setOpen(false)} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            size="large"
            sx={{ borderWidth: "2px!important", borderRadius: 9 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <ListItem
        sx={styles}
        button
        onClick={() => setOpen(true)}
        disabled={global.permission == "read-only"}
      >
        <Icon>receipt_long</Icon> Add to
        list
      </ListItem>
    </>
  );
}
