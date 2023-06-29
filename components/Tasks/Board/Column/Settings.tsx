import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { vibrate } from "@/lib/client/vibration";
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
import { useCallback, useDeferredValue, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { ConfirmationModal } from "../../../ConfirmationModal";
import EmojiPicker from "../../../EmojiPicker";
import { FilterMenu } from "./FilterMenu";

export function ColumnSettings({ board, setColumnTasks, mutateData, column }) {
  const storage = useAccountStorage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      vibrate(50);
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const [title, setTitle] = useState(column.name);
  const [emoji, setEmoji] = useState(column.emoji);

  const deferredTitle = useDeferredValue(title);

  const ref: any = useRef();
  const buttonRef: any = useRef();
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();

  const isDark = useDarkMode(session.darkMode);
  const handleModalClose = () => {
    mutateData();
    setOpen(false);
  };

  return column.name === "" ? (
    <Box onClick={(e) => e.stopPropagation()}>
      <FilterMenu
        handleParentClose={handleClose}
        originalTasks={column.tasks.filter(
          (task) => task.parentTasks.length === 0
        )}
        setColumnTasks={setColumnTasks}
      >
        <IconButton
          onClick={(e) => e.stopPropagation()}
          size="small"
          sx={{
            mr: 1,
          }}
        >
          <Icon
            className="outlined"
            sx={{
              transition: "all .2s",
            }}
          >
            filter_list
          </Icon>
        </IconButton>
      </FilterMenu>
    </Box>
  ) : (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        sx={{
          zIndex: 9999999,
        }}
        onClose={handleModalClose}
        PaperProps={{
          sx: {
            maxWidth: "400px",
            maxHeight: "400px",
            width: "auto",
            p: 2,
            borderRadius: { xs: "20px 20px 0 0", md: 5 },
            mb: { md: 5 },
          },
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            <EmojiPicker emoji={emoji} setEmoji={setEmoji}>
              <Button variant="outlined" sx={{ py: 0, px: 1.5 }}>
                <picture>
                  <img
                    width={40}
                    height={40}
                    alt="Emoji"
                    src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                  />
                </picture>
              </Button>
            </EmojiPicker>
            <TextField
              value={title}
              onChange={(e: any) => setTitle(e.target.value)}
              id={"renameInput"}
              inputRef={ref}
              disabled={storage?.isReached === true}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  buttonRef.current.click();
                }
              }}
              InputProps={{ sx: { fontWeight: 700 } }}
              placeholder="Column name"
              size="small"
            />
            <IconButton
              ref={buttonRef}
              size="large"
              disabled={
                storage?.isReached === true ||
                deferredTitle.trim() == "" ||
                deferredTitle.length > 25
              }
              onClick={async () => {
                toast.promise(
                  fetchRawApi(session, "property/boards/column/edit", {
                    id: column.id,
                    name: title,
                    emoji: emoji,
                  }).then(mutateData),
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
              <Icon className="outlined">check</Icon>
            </IconButton>
          </Box>
        </>
      </SwipeableDrawer>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          ...(Boolean(anchorEl) && {
            background: `${
              isDark ? "hsla(240,11%,25%, 0.3)" : "rgba(0,0,0,0.05)"
            }!important`,
            color: isDark ? "#fff!important" : "#000!important",
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
        onClick={(event) => event.stopPropagation()}
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <FilterMenu
          handleParentClose={handleClose}
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
        <Box
          sx={{
            textAlign: "center",
          }}
        >
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
          disabled={
            storage?.isReached === true || session.permission === "read-only"
          }
        >
          <Icon className="outlined">edit</Icon>
          Edit
        </MenuItem>
        <ConfirmationModal
          title="Delete column?"
          question="Are you sure you want to delete this column? This action annot be undone."
          callback={async () => {
            await fetchRawApi(session, "property/boards/column/delete", {
              id: column.id,
              who: session.user.name,
              boardName: board.name,
              boardEmoji: board.emoji,
              columnName: column.name,
            });
            await mutateData();
            handleClose();
          }}
        >
          <MenuItem disabled={session.permission === "read-only"}>
            <Icon className="outlined">delete</Icon>
            Delete
          </MenuItem>
        </ConfirmationModal>
      </Menu>
    </>
  );
}
