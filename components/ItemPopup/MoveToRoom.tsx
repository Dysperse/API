import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useBackButton } from "@/lib/client/useBackButton";
import { toastStyles } from "@/lib/client/useTheme";
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
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { Puller } from "../Puller";

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
  const session = useSession();

  const [disabled, setDisabled] = useState<boolean>(false);

  const handleClick = async () => {
    try {
      setDisabled(true);
      await fetchRawApi(session, "property/inventory/items/move", {
        id: id.toString(),
        room: room.toLowerCase().replace(" room", ""),
        lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      });
      setDisabled(false);
      setOpen(false);
      toast.success("Moved item!", toastStyles);
    } catch (e: any) {
      toast.error(e.message, toastStyles);
    }
  };

  return (
    <ListItemButton
      onClick={handleClick}
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
                (index) => index.toLowerCase() !== item.room.toLowerCase(),
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
