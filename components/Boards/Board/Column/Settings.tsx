import {
  Box,
  Button,
  Chip,
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../lib/client/useApi";
import { toastStyles } from "../../../../lib/client/useTheme";
import { useAccountStorage, useSession } from "../../../../pages/_app";
import { ConfirmationModal } from "../../../ConfirmationModal";
import { EmojiPickerModal } from "../EmojiPickerModal";
import { FilterMenu } from "./FilterMenu";

export function ColumnSettings({
  columnTasks,
  setColumnTasks,
  board,
  mutationUrls,
  column,
}) {
  const storage = useAccountStorage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      navigator.vibrate(50);
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const [title, setTitle] = useState(column.name);
  const [emoji, setEmoji] = useState(column.emoji);
  const ref: any = useRef();
  const buttonRef: any = useRef();
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        sx={{
          zIndex: 9999999,
        }}
        onClose={() => {
          mutate(mutationUrls.boardData);
          setOpen(false);
        }}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            maxWidth: "400px",
            maxHeight: "400px",
            width: "auto",
            p: 1,
            borderRadius: { xs: "20px 20px 0 0", md: 5 },
            mb: { md: 5 },
          },
        }}
      >
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              py: 2,
              mb: 1,
              borderBottom: `1px solid ${
                session?.user?.darkMode ? "hsla(240,11%,25%,50%)" : "#e0e0e0"
              }`,
            }}
          >
            <EmojiPickerModal
              emoji={emoji}
              setEmoji={setEmoji}
              lazyLoadEmojis={true}
            />
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id={"renameInput"}
              inputRef={ref}
              disabled={storage?.isReached === true}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  buttonRef.current.click();
                }
              }}
              size="small"
              InputProps={{
                sx: {
                  fontWeight: "700",
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex" }}>
            <Button
              ref={buttonRef}
              size="large"
              disabled={storage?.isReached === true}
              onClick={async () => {
                toast.promise(
                  fetchApiWithoutHook("property/boards/column/edit", {
                    id: column.id,
                    name: title,
                    emoji: emoji,
                  }).then(() => mutate(mutationUrls.boardData)),
                  {
                    loading: "Saving...",
                    success: "Edited column!",
                    error: "Yikes! An error occured - Please try again later!",
                  },
                  toastStyles
                );
                setOpen(false);
              }}
            >
              <Icon className="outlined">save</Icon>
              Save
            </Button>
          </Box>
        </>
      </SwipeableDrawer>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          ...(Boolean(anchorEl) && {
            background: `${
              session?.user?.darkMode
                ? "hsla(240,11%,25%, 0.3)"
                : "rgba(0,0,0,0.05)"
            }!important`,
            color: session?.user?.darkMode
              ? "#fff!important"
              : "#000!important",
          }),
        }}
      >
        <Icon
          className="outlined"
          sx={{
            transition: "all .2s",
            ...(Boolean(anchorEl) && { transform: "rotate(180deg)" }),
          }}
        >
          expand_circle_down
        </Icon>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <FilterMenu
          originalTasks={column.tasks.filter(
            (task) => task.parentTasks.length === 0
          )}
          setColumnTasks={setColumnTasks}
        >
          <MenuItem className="sortMenu">
            <Icon className="outlined">filter_list</Icon>
            Sort
            <Icon className="outlined" sx={{ ml: "auto" }}>
              chevron_right
            </Icon>
          </MenuItem>
        </FilterMenu>
        <Divider />
        <Box sx={{ textAlign: "center" }}>
          <Chip label="Coming soon" sx={{ my: 1 }} size="small" />
        </Box>
        <MenuItem disabled>
          <Icon className="outlined">east</Icon>Move right
        </MenuItem>
        <MenuItem disabled>
          <Icon className="outlined">west</Icon>Move left
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => setOpen(true)}
          disabled={storage?.isReached === true}
        >
          <Icon className="outlined">edit</Icon>
          Edit
        </MenuItem>
        <ConfirmationModal
          title="Delete column?"
          question="Are you sure you want to delete this column? This action annot be undone."
          callback={async () => {
            await fetchApiWithoutHook("property/boards/column/delete", {
              id: column.id,
            });
            await mutate(mutationUrls.board);
            handleClose();
          }}
        >
          <MenuItem>
            <Icon className="outlined">delete</Icon>
            Delete
          </MenuItem>
        </ConfirmationModal>
      </Menu>
    </>
  );
}
