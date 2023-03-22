import { Icon, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../lib/client/useApi";
import { toastStyles } from "../../../lib/client/useTheme";
import { useAccountStorage, useSession } from "../../../pages/_app";
import { ConfirmationModal } from "../../ConfirmationModal";
import CreateColumn from "./Column/Create";

export default function BoardSettings({ mutationUrl, board }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    navigator.vibrate(50);
  };

  const handleClose = () => {
    mutate(mutationUrl);
    setAnchorEl(null);
  };

  const storage = useAccountStorage();
  const session = useSession();

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        sx={{
          zIndex: 9999999999,
        }}
      >
        <ConfirmationModal
          title={board.pinned ? "Unpin?" : "Pin?"}
          buttonText="Yes, please!"
          question={
            board.pinned
              ? "Are you sure you want to unpin this board?"
              : "Are you sure you want to pin this board? Any other boards will be unpinned."
          }
          callback={() => {
            setTimeout(() => {
              fetchApiWithoutHook("property/boards/pin", {
                id: board.id,
                pinned: !board.pinned ? "true" : "false",
              }).then(() => {
                toast.success(
                  !board.pinned ? "Pinned board!" : "Unpinned board!",
                  toastStyles
                );
              });
            }, 100);
          }}
        >
          <MenuItem
            sx={{
              flexShrink: 0,
              ml: "auto",
              flex: "0 0 auto",
            }}
            disabled={board.archived || storage?.isReached === true}
          >
            <Icon
              className={board.pinned ? "" : "outlined"}
              sx={{
                transition: "transform .2s",
                ...(board.pinned && {
                  transform: "rotate(-30deg)!important",
                }),
              }}
            >
              push_pin
            </Icon>
            {board.pinned ? "Unpin" : "Pin"}
          </MenuItem>
        </ConfirmationModal>
        {board && Boolean(anchorEl) && board.columns.length !== 1 && (
          <CreateColumn
            setCurrentColumn={(e: any) => e}
            mobile={true}
            id={board.id}
            mutationUrl={mutationUrl}
            hide={
              session.user.email !== "manusvathgurudath@gmail.com" &&
              ((board && board.columns.length === 1) ||
                (board && board.columns.length >= 5))
            }
          />
        )}
        <MenuItem
          disabled={board.archived}
          onClick={() => {
            handleClose();
            window.navigator.share({
              url: window.location.href,
            });
          }}
        >
          <Icon className="outlined">share</Icon>
          Share
        </MenuItem>
        <ConfirmationModal
          title="Change board visibility?"
          question={
            !board.public
              ? "Are you sure you want to make this board public? Other members in your group will be able to view and edit content within this board"
              : "Are you sure you want to make this board private? Other members in your group won't be able to view/edit content within this board anymore."
          }
          callback={async () => {
            await fetchApiWithoutHook("property/boards/setVisibility", {
              id: board.id,
              public: !board.public,
            });
            await mutate(mutationUrl);
          }}
        >
          <MenuItem disabled={storage?.isReached === true}>
            <Icon className="outlined">
              {!board.public ? "visibility" : "visibility_off"}
            </Icon>
            Make {!board.public ? "public" : "private"}
          </MenuItem>
        </ConfirmationModal>

        <ConfirmationModal
          title="Archive board?"
          question={
            board.archived
              ? "Are you sure you want to unarchive this board?"
              : "Are you sure you want to delete this board? You won't be able to add/edit items, or share it with anyone."
          }
          callback={async () => {
            await fetchApiWithoutHook("property/boards/archive", {
              id: board.id,
              archive: !board.archived,
            });
            await mutate(mutationUrl);
          }}
        >
          <MenuItem onClick={handleClose}>
            <Icon className="outlined">inventory_2</Icon>
            {board.archived ? "Unarchive" : "Archive"}
          </MenuItem>
        </ConfirmationModal>
        <ConfirmationModal
          title="Delete board?"
          question="Are you sure you want to delete this board? This action annot be undone."
          callback={async () => {
            await fetchApiWithoutHook("property/boards/delete", {
              id: board.id,
            });
            await mutate(mutationUrl);
          }}
        >
          <MenuItem onClick={handleClose} disabled={board.archived}>
            <Icon className="outlined">delete</Icon>
            Delete
          </MenuItem>
        </ConfirmationModal>
      </Menu>

      <Tooltip title="Board settings">
        <IconButton onClick={handleClick} sx={{ mr: { md: "auto" } }}>
          <Icon className="outlined">settings</Icon>
        </IconButton>
      </Tooltip>
    </>
  );
}
