import type { Item as ItemType } from "@prisma/client";
import { useState } from "react";
import { fetchApiWithoutHook, useApi } from "../../lib/client/useApi";
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
import { toastStyles } from "../../lib/client/useTheme";
import { useAccountStorage, useSession } from "../../pages/_app";

function BoardModal({ itemId, title, list }) {
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();
  const handleClick = async (column) => {
    try {
      await fetchApiWithoutHook("property/boards/column/task/create", {
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
              disabled={session?.permission === "read-only"}
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
                  <img
                    src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${column.emoji}.png`}
                    alt={column.name}
                    width={25}
                  />
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
        disabled={session?.permission === "read-only"}
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
  itemId: string;
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
        {[...new Array(10)].map((_, i) => (
          <Skeleton animation="wave" key={i} />
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

  const storage = useAccountStorage();
  const session = useSession();

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
            itemId={item.id}
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
        disabled={
          session?.permission === "read-only" || storage?.isReached === true
        }
      >
        <Icon>receipt_long</Icon> Add to list
      </ListItemButton>
    </>
  );
}
