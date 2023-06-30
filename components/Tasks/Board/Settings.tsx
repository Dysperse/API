import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { toastStyles } from "@/lib/client/useTheme";
import { vibrate } from "@/lib/client/vibration";
import { Icon, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { ConfirmationModal } from "../../ConfirmationModal";
import CreateColumn from "./Column/Create";

export default function BoardSettings({ isShared, mutationUrls, board }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    vibrate(50);
  };

  const handleClose = () => {
    mutate(mutationUrls.boardData);
    setAnchorEl(null);
  };

  const storage = useAccountStorage();
  const session = useSession();
  const router = useRouter();

  const handleEdit = () => {
    setTimeout(() => {
      fetchRawApi(session, "property/boards/edit", {
        id: board.id,
        pinned: !board.pinned ? "true" : "false",
      }).then(() => {
        toast.success(
          !board.pinned ? "Pinned board!" : "Unpinned board!",
          toastStyles
        );
      });
    }, 100);
  };

  return (
    <>
      <Menu
        id="basic-menu"
        keepMounted
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
      >
        <ConfirmationModal
          title={board.pinned ? "Unpin?" : "Pin?"}
          buttonText="Yes!"
          question={
            board.pinned
              ? "Are you sure you want to unpin this board?"
              : "Are you sure you want to pin this board? Any other boards will be unpinned."
          }
          callback={handleEdit}
        >
          <MenuItem
            sx={{
              flexShrink: 0,
              ml: "auto",
              flex: "0 0 auto",
            }}
            disabled={board.archived || storage?.isReached === true || isShared}
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
        <CreateColumn
          setCurrentColumn={(e: any) => e}
          name={board.name}
          id={board.id}
          mutationUrls={mutationUrls}
          hide={
            (board?.columns.length === 1 && board?.columns[0].name === "") ||
            board?.columns.length >= 5
          }
        />
        <ConfirmationModal
          title="Change board visibility?"
          question={
            !board.public
              ? "Are you sure you want to make this board public? Other members in your group will be able to view and edit content within this board"
              : "Are you sure you want to make this board private? Other members in your group won't be able to view/edit content within this board anymore."
          }
          callback={async () => {
            await fetchRawApi(session, "property/boards/edit", {
              id: board.id,
              public: !board.public,
            });
            await mutate(mutationUrls.boardData);
          }}
        >
          <MenuItem disabled={storage?.isReached === true || isShared}>
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
              : "Are you sure you want to archive this board? You won't be able to add/edit items, or share it with anyone."
          }
          callback={async () => {
            await fetchRawApi(session, "property/boards/archived", {
              id: board.id,
              archived: !board.archived,
            });
            await mutate(mutationUrls.boardData);
          }}
        >
          <MenuItem onClick={handleClose} disabled={isShared}>
            <Icon className="outlined">inventory_2</Icon>
            {board.archived ? "Unarchive" : "Archive"}
          </MenuItem>
        </ConfirmationModal>
        <ConfirmationModal
          title="Delete board?"
          question="Are you sure you want to delete this board? This action annot be undone."
          callback={async () => {
            await fetchRawApi(session, "property/boards/delete", {
              id: board.id,
            });
            router.push("/tasks/agenda/week");
            await mutate(mutationUrls.boardData);
          }}
        >
          <MenuItem onClick={handleClose} disabled={board.archived || isShared}>
            <Icon className="outlined">delete</Icon>
            Delete
          </MenuItem>
        </ConfirmationModal>
      </Menu>

      <Tooltip title="Board settings">
        <IconButton
          onClick={handleClick}
          size="large"
          disabled={session.permission === "read-only"}
        >
          <Icon className="outlined">settings</Icon>
        </IconButton>
      </Tooltip>
    </>
  );
}
