import type { Item as ItemType } from "@prisma/client";
import { useState } from "react";
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
  ListItemButton,
  ListItemText,
  Skeleton,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { toastStyles } from "../../lib/useCustomTheme";

function BoardModal({ itemId, title, list }) {
  const [open, setOpen] = useState(false);

  const handleClick = async (column) => {
    try {
      await fetchApiWithoutHook("property/boards/createTask", {
        title,
        description: `<items:${itemId}:${title}>`,
        pinned: "false",
        boardId: list.id,
        columnId: column.id,
      });
      toast.success("Task created", toastStyles);
    } catch (e) {
      toast.error(
        "An error occured while trying to create a task",
        toastStyles
      );
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        PaperProps={{
          sx: {
            width: "400px",
            maxWidth: "calc(100vw - 20px)",
            borderRadius: "28px",
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "800" }}>
          {list.columns.length == 1 ? "Confirm creation" : "Select a column"}
          <DialogContentText
            id="alert-dialog-slide-description"
            sx={{ mt: 1, mb: 2 }}
          >
            {list.name}
          </DialogContentText>
          {list.columns.map((column) => (
            <ListItemButton
              key={column.id}
              disabled={global.permission === "read-only"}
              sx={{
                borderRadius: 5,
                py: 0.5,
                px: 2,
                transition: "none",
                gap: 2,
              }}
              onClick={() => handleClick(column)}
            >
              {list.columns.length !== 1 && (
                <picture>
                  <img src={column.emoji} alt={column.name} width={25} />
                </picture>
              )}
              <ListItemText
                primary={
                  column.name ||
                  (list.columns.length == 1 && <>Add to list &rarr;</>)
                }
              />
            </ListItemButton>
          ))}
        </DialogTitle>
      </Dialog>
      <ListItemButton
        sx={{ borderRadius: 5, py: 0.5, px: 2, transition: "none" }}
        disabled={global.permission === "read-only"}
        onClick={() => setOpen(true)}
      >
        <ListItemText primary={list.name} secondary={list.description} />
      </ListItemButton>
    </>
  );
}

/**
 * Description
 * @param {any} {title
 * @param {any} handleClose}
 * @returns {JSX.Element}
 */
function RoomList({
  itemId,
  title,
  handleClose,
}: {
  itemId: number;
  title: string;
  handleClose: () => void;
}): JSX.Element {
  const { data, error }: ApiResponse = useApi("property/boards");

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
        <BoardModal list={list} title={title} key={list.id} itemId={itemId} />
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
export default function AddToListModal({
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
  useStatusBar(open);

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
          <RoomList
            title={item.name}
            handleClose={() => setOpen(false)}
            itemId={parseInt(item.id)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            size="large"
            sx={{ borderRadius: 9 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <ListItemButton
        sx={styles}
        onClick={() => setOpen(true)}
        disabled={global.permission === "read-only"}
      >
        <Icon>receipt_long</Icon> Add to list
      </ListItemButton>
    </>
  );
}
