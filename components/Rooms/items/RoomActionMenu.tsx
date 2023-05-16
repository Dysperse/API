import { Puller } from "@/components/Puller";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { colors } from "@/lib/colors";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { ConfirmationModal } from "../../ConfirmationModal";

function Rename({ handleClose, id, name }) {
  const storage = useAccountStorage();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(name);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setLoading(false);
  };

  return (
    <>
      <MenuItem
        onClick={() => setOpen(true)}
        disabled={storage?.isReached === true}
      >
        <Icon className="outlined">edit</Icon>Rename
      </MenuItem>
      <SwipeableDrawer
        open={open}
        sx={{ zIndex: 9999 }}
        anchor="bottom"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Puller showOnDesktop />
        <Box sx={{ p: 3, pt: 0 }}>
          <TextField
            variant="filled"
            label="Room name..."
            placeholder="Backpack"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            margin="dense"
          />
          <LoadingButton
            loading={loading}
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
          >
            Done
          </LoadingButton>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export function RoomActionMenu({
  room,
  itemRef,
  isPrivate,
  mutationUrl,
  isCustom,
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const storage = useAccountStorage();
  const session = useSession();

  return (
    <IconButton
      disabled={session?.permission === "read-only" || !isCustom}
      size="small"
      ref={itemRef}
      onClick={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick(e);
      }}
      onMouseDown={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      sx={{
        ...(session?.permission === "read-only" && {
          display: { sm: "none" },
        }),
        ...(open && {
          background:
            (session.user.darkMode
              ? "hsl(240,11%,20%)"
              : colors[session?.themeColor || "grey"][100]) + "!important",
        }),
      }}
    >
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Rename handleClose={handleClose} id={room?.id} name={room?.name} />
        <MenuItem onClick={handleClose} disabled={storage?.isReached === true}>
          <Icon className="outlined">lock</Icon>Make{" "}
          {isPrivate ? "private" : "public"}
        </MenuItem>
        <ConfirmationModal
          title="Delete room?"
          question="Are you sure you want to delete this room? This will delete all items in it, and CANNOT be undone!"
          callback={async () => {
            await fetchRawApi("property/inventory/room/delete", {
              id: room.id,
            });
            await mutate(mutationUrl);
            toast.success("Deleted room!");
            handleClose();
          }}
        >
          <MenuItem>
            <Icon className="outlined">delete</Icon>Delete
          </MenuItem>
        </ConfirmationModal>
      </Menu>

      <Icon className="outlined">
        {session?.permission === "read-only" ? (
          "chevron_right"
        ) : isPrivate ? (
          "lock"
        ) : isCustom ? (
          "more_horiz"
        ) : (
          <Box
            sx={{
              display: { sm: "none!important" },
              color: session.user.darkMode ? "#fff" : "#404040",
            }}
            className="material-symbols-rounded"
          >
            chevron_right
          </Box>
        )}
      </Icon>
    </IconButton>
  );
}
