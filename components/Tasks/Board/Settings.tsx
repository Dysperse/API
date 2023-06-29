import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { toastStyles } from "@/lib/client/useTheme";
import { vibrate } from "@/lib/client/vibration";
import { LoadingButton } from "@mui/lab";
import {
  AppBar,
  Box,
  CircularProgress,
  Icon,
  IconButton,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { cloneElement, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { ConfirmationModal } from "../../ConfirmationModal";
import CreateColumn from "./Column/Create";

function ShareBoard({ isShared, board, children }) {
  const session = useSession();
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const trigger = cloneElement(children, {
    onClick: handleOpen,
  });

  const {
    data,
    url: mutationUrl,
    error,
  } = useApi("property/shareTokens", {
    board: board.id,
  });

  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await fetchRawApi(session, "property/shareTokens/create", {
        board: board.id,
        date: new Date().toISOString(),
        expires: 7,
      });
      setToken(data.token);
      setLoading(false);
    } catch (e) {
      toast.error(
        "Yikes! Something happened while trying to generate the share link! Please try again later.",
        toastStyles
      );
      setLoading(false);
    }
  };

  const handleRevoke = async (token) => {
    await fetchRawApi(session, "property/shareTokens/revoke", {
      token,
    });
    await mutate(mutationUrl);
  };

  const url = isShared
    ? window.location.href
    : `${window.location.origin}/tasks/boards/${board.id}?share=${token}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    toast.success("Copied link to clipboard!", toastStyles);
  };

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        anchor="bottom"
        sx={{ zIndex: 9999 }}
        onKeyDown={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            height: "100vh",
          },
        }}
      >
        <AppBar sx={{ border: 0 }}>
          <Toolbar>
            <IconButton onClick={handleClose}>
              <Icon>close</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ px: 5, pt: 4 }}>
          <Typography variant="h2" className="font-heading">
            Share
          </Typography>
          {token && (
            <TextField
              label="Board link"
              value={url}
              fullWidth
              size="small"
              sx={{ mt: 1 }}
            />
          )}
          <LoadingButton
            loading={loading}
            onClick={copyUrl}
            sx={{ mt: 1 }}
            variant="outlined"
            fullWidth
          >
            Copy
          </LoadingButton>
          {!isShared && (
            <LoadingButton
              loading={loading}
              onClick={handleGenerate}
              sx={{ mt: 1 }}
              variant="contained"
              fullWidth
            >
              Create link
            </LoadingButton>
          )}
          {data ? (
            <>
              <Typography variant="h6" sx={{ mt: 3 }}>
                Active links
              </Typography>
              {data.map((share) => (
                <ListItem
                  key={share.id}
                  sx={{
                    px: 0,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <ListItemText
                    primary={dayjs(share.createdAt).fromNow()}
                    secondary={"Expires " + dayjs(share.expiresAt).fromNow()}
                  />
                  <IconButton
                    sx={{ ml: "auto" }}
                    onClick={() => handleRevoke(share.token)}
                  >
                    <Icon>delete</Icon>
                  </IconButton>
                </ListItem>
              ))}
            </>
          ) : data.error ? (
            <ErrorHandler
              error="Oh no! An error occured while trying to get your active share links!"
              callback={() => mutate(mutationUrl)}
            />
          ) : (
            <CircularProgress />
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
}

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
          id={board.id}
          mutationUrls={mutationUrls}
          hide={
            (board?.columns.length === 1 && board?.columns[0].name === "") ||
            board?.columns.length >= 5
          }
        />
        <ShareBoard board={board} isShared={isShared}>
          <MenuItem>
            <Icon className="outlined">ios_share</Icon>
            Share
          </MenuItem>
        </ShareBoard>
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
          sx={{ mr: { md: "auto" } }}
          size="large"
          disabled={session.permission === "read-only"}
        >
          <Icon className="outlined">settings</Icon>
        </IconButton>
      </Tooltip>
    </>
  );
}
