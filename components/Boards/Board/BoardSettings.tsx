import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Icon,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../hooks/useApi";
import { colors } from "../../../lib/colors";
import { toastStyles } from "../../../lib/useCustomTheme";
import { ConfirmationModal } from "../../ConfirmationModal";
import { Puller } from "../../Puller";
import { CreateColumn } from "./Column/Create";

function PublishBoard({ board }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(true)}
        PaperProps={{
          sx: {
            maxWidth: "500px",
          },
        }}
      >
        <DialogContent>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Publish as template
          </Typography>
          <List
            sx={{
              listStyleType: "disc",
              pl: 3,
              "& .MuiListItem-root": {
                display: "list-item",
              },
            }}
          >
            <ListItem>
              Others won&apos;t be able to see tasks &amp; files stored in this
              board
            </ListItem>
            <ListItem>You can always unpublish templates</ListItem>
            <ListItem>
              Inappropriate/offensive content will be removed - and your account
              will be banned!
            </ListItem>
            <ListItem>
              Once you publish a template, you won&apos;t be able to edit the
              board&apos;s information
            </ListItem>
          </List>
          <TextField
            value={board.name}
            fullWidth
            label="Template name"
            margin="dense"
          />
          <TextField
            value={board.description}
            margin="dense"
            fullWidth
            label="Template description"
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton variant="contained" loading={loading}>
            Publish
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <MenuItem onClick={() => setOpen(true)}>
        <Icon className="outlined">auto_awesome</Icon>
        Publish
        <Chip
          label="NEW"
          size="small"
          sx={{
            background: "linear-gradient(45deg, #FF0080 0%, #FF8C00 100%)",
            color: "#000",
            ml: "auto",
          }}
        />
      </MenuItem>
    </>
  );
}

export function BoardSettings({ mutationUrl, board }) {
  const [title, setTitle] = React.useState(board.name);
  const [description, setDescription] = React.useState(board.description || "");

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

  const ref: any = React.useRef();

  const [renameOpen, setRenameOpen] = React.useState(false);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={renameOpen}
        onOpen={() => setRenameOpen(true)}
        onClose={() => setRenameOpen(false)}
        disableSwipeToOpen
        disableBackdropTransition
      >
        <Puller />
        <Box sx={{ px: 2.5, mb: 1 }}>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id={"renameInput"}
            autoFocus
            placeholder="Board name"
            InputProps={{
              sx: {
                fontWeight: "700",
                mb: 2,
              },
            }}
          />

          <TextField
            multiline
            rows={4}
            value={description}
            placeholder="What's this board about?"
            onChange={(e) => setDescription(e.target.value)}
            id={"descriptionInput"}
            autoFocus
            InputProps={{
              sx: {
                mb: 2,
              },
            }}
          />
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                setRenameOpen(false);
                ref.current?.click();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={
                (title == board.name && description === board.description) ||
                title.trim() == ""
              }
              onClick={() => {
                if (
                  !(
                    (title == board.name &&
                      description === board.description) ||
                    title.trim() == ""
                  )
                ) {
                  toast.promise(
                    fetchApiWithoutHook("property/boards/edit", {
                      id: board.id,
                      name: title,
                      description: description,
                    }).then(() => mutate(mutationUrl)),
                    {
                      loading: "Renaming...",
                      success: "Renamed board!",
                      error: "An error occurred while renaming the board",
                    },
                    toastStyles
                  );
                }
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Box>
      </SwipeableDrawer>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
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

        {board && board.columns.length !== 1 && (
          <CreateColumn
            setCurrentColumn={(e: any) => e}
            mobile={true}
            id={board.id}
            mutationUrl={mutationUrl}
            hide={
              (board && board.columns.length === 1) ||
              (board && board.columns.length >= 5)
            }
          />
        )}

        <MenuItem
          disabled={board.archived}
          onClick={() => {
            setRenameOpen(true);
            handleClose();
          }}
        >
          <Icon className="outlined">edit</Icon>
          Edit
        </MenuItem>
        <PublishBoard board={board} />

        <ConfirmationModal
          title="Archive board?"
          question={
            board.archived
              ? "Are you sure you want to unarchive this board?"
              : "Are you sure you want to delete this board? You won't be able to add/edit items, or share it with anyone."
          }
          callback={async () => {
            await fetchApiWithoutHook("property/boards/archiveBoard", {
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
            await fetchApiWithoutHook("property/boards/deleteBoard", {
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
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          transition: "none",
          flexShrink: 0,
          ...(open && {
            background: `${
              global.user.darkMode
                ? "hsla(240,11%,14%)"
                : colors[themeColor][100]
            }!important`,
          }),
        }}
        ref={ref}
      >
        <Icon className="outlined">more_vert</Icon>
      </IconButton>
    </>
  );
}
