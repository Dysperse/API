import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { fetchRawApi } from "../../lib/client/useApi";
import { Puller } from "../Puller";

import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import { useBackButton } from "../../lib/client/useBackButton";
import { toastStyles } from "../../lib/client/useTheme";
import { useAccountStorage, useSession } from "../../pages/_app";

/**
 * @description A room
 * @param room Room
 * @param setOpen Set open
 * @param id ID
 * @returns JSX.Element
 */
function Room({
  id,
  room,
  setOpen,
}: {
  id: number;
  room: string;
  setOpen: (open: boolean) => void;
}) {
  const [disabled, setDisabled] = useState<boolean>(false);
  return (
    <ListItemButton
      onClick={() => {
        setDisabled(true);
        fetchRawApi("property/inventory/items/move", {
          id: id.toString(),
          room: room.toLowerCase().replace(" room", ""),
          lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        }).then(() => {
          setDisabled(false);
          setOpen(false);
          setTimeout(() => {
            toast.success("Moved item!", toastStyles);
          }, 100);
        });
      }}
      sx={{ transition: "none!important", borderRadius: 3 }}
    >
      <ListItemText
        primary={
          <span
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {room}{" "}
            {disabled ? (
              <CircularProgress size={20} sx={{ ml: "auto" }} />
            ) : null}
          </span>
        }
      />
    </ListItemButton>
  );
}

/**
 * Description
 * @param {any} styles
 * @param {any} item
 * @returns {any}
 */
export default function MoveToRoom({ item, styles }) {
  const [open, setOpen] = useState<boolean>(false);

  useBackButton(() => setOpen(false));

  const storage = useAccountStorage();
  const session = useSession();

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        onOpen={() => setOpen(true)}
        open={open}
        sx={{
          transition: "all .2s",
        }}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: {
              sm: "50vw",
            },
            maxWidth: "600px",
            maxHeight: "95vh",

            mx: "auto",
            ...(session.user.darkMode && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
      >
        <Puller />
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontWeight: "800", p: 4, pt: 0, pb: 2 }}
        >
          Select a room
        </DialogTitle>
        <DialogContent sx={{ p: 4, pt: 0 }}>
          <DialogContentText id="alert-dialog-description">
            {[
              "Kitchen",
              "Bedroom",
              "Bathroom",
              "Garage",
              "Dining",
              "Living room",
              "Laundry room",
              "Storage room",
              "Camping",
              "Garden",
            ]
              .filter(
                (index) => index.toLowerCase() !== item.room.toLowerCase()
              )
              .map((index) => (
                <Room
                  key={index}
                  room={index}
                  setOpen={setOpen}
                  id={parseInt(item.id)}
                />
              ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </SwipeableDrawer>

      <ListItemButton
        sx={styles}
        onClick={() => setOpen(true)}
        disabled={
          session?.permission === "read-only" || storage?.isReached === true
        }
      >
        <Icon>place_item</Icon>
        Move
      </ListItemButton>
    </>
  );
}
