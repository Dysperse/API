import { Box, Icon, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { useAccountStorage } from "../../../lib/client/useAccountStorage";
import { fetchRawApi } from "../../../lib/client/useApi";
import { useSession } from "../../../lib/client/useSession";
import { colors } from "../../../lib/colors";
import { ConfirmationModal } from "../../ConfirmationModal";

export function RoomActionMenu({
  roomId,
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
        <MenuItem onClick={handleClose} disabled={storage?.isReached === true}>
          <Icon className="outlined">edit</Icon>Rename
        </MenuItem>
        <MenuItem onClick={handleClose} disabled={storage?.isReached === true}>
          <Icon className="outlined">lock</Icon>Make{" "}
          {isPrivate ? "private" : "public"}
        </MenuItem>
        <ConfirmationModal
          title="Delete room?"
          question="Are you sure you want to delete this room? This will delete all items in it, and CANNOT be undone!"
          callback={async () => {
            await fetchRawApi("property/inventory/room/delete", {
              id: roomId,
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
