import { useState } from "react";
import toast from "react-hot-toast";
import { useStatusBar } from "../../hooks/useStatusBar";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Icon,
  ListItem,
  TextField,
} from "@mui/material";

/**
 * Share modal
 * @param styles
 * @param title
 * @param quantity
 * @param room
 */
export function ShareModal({
  styles,
  title,
  quantity,
  room,
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
  title: string;
  quantity: string;
  room: string;
}): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const href = `https://${window.location.hostname}/share/${encodeURIComponent(
    JSON.stringify({
      name: global.user.name,
      title: title,
      quantity: quantity,
      room: room,
    })
  )}`;

  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setOpen(false);
  };
  useStatusBar(open, 1);

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
            sx={{ mt: 1 }}
            InputProps={{
              readOnly: true,
            }}
          />
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 99,
              borderWidth: "2px!important",
              display: "inline-flex",
              mt: 2,
              mr: 1,
              px: 3,
              py: 1,
            }}
            onClick={() => {
              navigator.share({
                url: href,
              });
              handleClose();
            }}
          >
            Share link
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 99,
              borderWidth: "2px!important",
              display: "inline-flex",
              mt: 2,
              mr: 1,
              px: 3,
              py: 1,
            }}
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
            size="large"
            sx={{
              borderRadius: 99,
              border: "2px solid transparent!important",
              display: "inline-flex",
              mt: 2,
              mr: 1,
              px: 3,
              gap: 1.5,
              py: 1,
            }}
            onClick={() => {
              window.open(href);
              handleClose();
            }}
          >
            Open
            <Icon>open_in_new</Icon>
          </Button>
        </DialogContent>
      </Dialog>
      <ListItem button sx={styles} onClick={() => setOpen(true)}>
        <Icon>share</Icon>
        Share
      </ListItem>
    </>
  );
}
