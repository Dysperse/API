import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  SwipeableDrawer,
  TextField,
  Typography,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";
import { cloneElement, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../../hooks/useApi";
import { toastStyles } from "../../../lib/useCustomTheme";
import { useAccountStorage, useSession } from "../../../pages/_app";
import { ConfirmationModal } from "../../ConfirmationModal";
import { boardSwitcherStyles } from "../Layout";
import { Task } from "./Column/Task";
import { CreateTask } from "./Column/Task/Create";
import BoardSettings from "./settings";

function FilterMenu({ children, originalTasks, setColumnTasks }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const trigger = cloneElement(children, {
    onClick: handleClick,
  });

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: "-3px!important",
            ml: "7px!important",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setColumnTasks(
              originalTasks.sort((a, b) => (a.name > b.name ? 1 : -1))
            );
            handleClose();
          }}
        >
          A-Z
        </MenuItem>
        <MenuItem
          onClick={() => {
            setColumnTasks(
              originalTasks.sort((a, b) => (a.name > b.name ? 1 : -1)).reverse()
            );
            handleClose();
          }}
        >
          Z-A
        </MenuItem>
        <MenuItem
          onClick={() => {
            setColumnTasks(originalTasks);
            handleClose();
          }}
        >
          Newest to oldest
        </MenuItem>
        <MenuItem
          onClick={() => {
            setColumnTasks(originalTasks.reverse());
            handleClose();
          }}
        >
          Oldest to newest
        </MenuItem>
      </Menu>
      {trigger}
    </>
  );
}

function ColumnSettings({
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

function EmojiPickerModal({ emoji, setEmoji }: any) {
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "400px",
            mb: { md: 2 },
            borderRadius: { xs: "20px 20px 0 0", md: 4 },
          },
        }}
        sx={{
          zIndex: 9999999,
        }}
      >
        {open && (
          <EmojiPicker
            skinTonePickerLocation={"PREVIEW" as any}
            theme={(session?.user?.darkMode ? "dark" : "light") as any}
            lazyLoadEmojis={true}
            width="100%"
            onEmojiClick={(event) => {
              const url = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${event.unified}.png`;
              setEmoji(url);
              setOpen(false);
            }}
          />
        )}
      </SwipeableDrawer>
      <Button onClick={() => setOpen(true)}>
        <picture>
          <img src={emoji} alt="emoji" width="30" height="30" />
        </picture>
      </Button>
    </>
  );
}

function Column({ board, mutationUrls, column, index }) {
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [columnTasks, setColumnTasks] = useState(column.tasks);

  useEffect(() => setColumnTasks(column.tasks), [column.tasks]);

  const toggleShowCompleted = useCallback(
    () => setShowCompleted((e) => !e),
    [setShowCompleted]
  );

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
      <Box
        className="snap-center"
        sx={{
          borderLeft: "1px solid",
          borderColor: session?.user?.darkMode
            ? "hsl(240,11%,16%)"
            : "rgba(200,200,200,.2)",
          zIndex: 1,
          height: "100%",
          flexGrow: 1,
          flexBasis: 0,
          ml: "-1px",
          minHeight: { md: "100vh" },
          overflowY: "scroll",
          minWidth: { xs: "100vw", md: "340px" },
          transition: "filter .2s",
        }}
      >
        <Box
          sx={{
            color: session?.user?.darkMode ? "#fff" : "#000",
            p: { xs: 2, sm: 3 },
            px: 4,
            background: session?.user?.darkMode
              ? "hsla(240,11%,16%, 0.2)"
              : "rgba(255,255,255,.05)",
            borderBottom: "1px solid",
            borderColor: session?.user?.darkMode
              ? "hsla(240,11%,18%, 0.2)"
              : "rgba(200,200,200,.3)",
            userSelect: "none",
            zIndex: 9,
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              my: 1,
              gap: 3,
              alignItems: "center",
              "& picture img": {
                width: { xs: "40px", sm: "50px" },
                height: { xs: "40px", sm: "50px" },
              },
            }}
          >
            <picture
              style={{
                flexShrink: 0,
              }}
            >
              <img src={column.emoji} width={50} height={50} />
            </picture>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h4"
                className="font-heading"
                sx={{
                  "& span": {
                    overflow: "hidden",
                    maxWidth: { xs: "100%", sm: "140px" },
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  },
                  fontSize: { xs: "25px", sm: "30px" },
                  borderRadius: 1,
                  width: "auto",
                  mb: 0.7,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span>{column.name}</span>
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: { xs: "15px", sm: "18px" },
                }}
              >
                {columnTasks.length} tasks
              </Typography>
            </Box>
            <Box sx={{ ml: "auto" }}>
              <ColumnSettings
                columnTasks={columnTasks}
                setColumnTasks={setColumnTasks}
                column={column}
                mutationUrls={mutationUrls}
                board={board}
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{ p: { sm: 2 }, mb: { xs: 15, md: 0 } }}
          id={`container-${index}`}
        >
          {columnTasks.filter((task) => !task.completed).length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mx: "auto",
                py: { sm: 2 },
                textAlign: { xs: "center", sm: "left" },
                alignItems: { xs: "center", sm: "start" },
                flexDirection: "column",
                "& img": {
                  display: { sm: "none" },
                },
              }}
            >
              <Image
                src="/images/noTasks.png"
                width={256}
                height={256}
                style={{
                  ...(session?.user?.darkMode && {
                    filter: "invert(100%)",
                  }),
                }}
                alt="No items found"
              />

              <Box sx={{ px: 1.5, maxWidth: "calc(100% - 50px)" }}>
                <Typography variant="h6" gutterBottom>
                  Nothing much here...
                </Typography>
                <Typography gutterBottom sx={{ mb: -1.5 }}>
                  You haven&apos;t added any list items to this column
                </Typography>
              </Box>
              <CreateTask
                mutationUrl={mutationUrls.tasks}
                boardId={board.id}
                column={column}
              />
            </Box>
          ) : (
            <CreateTask
              mutationUrl={mutationUrls.tasks}
              boardId={board.id}
              column={column}
            />
          )}

          {columnTasks
            .filter((task) => !task.completed)
            .map((task) => (
              <Task
                key={task.id}
                board={board}
                columnId={column.id}
                mutationUrl={mutationUrls.tasks}
                task={task}
              />
            ))}

          <Button
            className="task"
            fullWidth
            size="large"
            sx={{
              px: { xs: "15px!important", sm: "10px!important" },
              py: { xs: "10px!important", sm: "5px!important" },
              mb: 1,
              ...(columnTasks.filter((task) => task.completed).length === 0 && {
                display: "none",
              }),
              mt: 2,
              mx: { xs: "20px", sm: 0 },
              width: "calc(100% - 40px)",
              ...(showCompleted && {
                background: session?.user?.darkMode
                  ? "hsl(240,11%,20%)!important"
                  : "rgba(200,200,200,.3)!important",
              }),
              color: session?.user?.darkMode ? "#fff" : "hsl(240,11%,30%)",
            }}
            onClick={toggleShowCompleted}
          >
            <Typography sx={{ fontWeight: 700 }}>
              {columnTasks.filter((task) => task.completed).length} completed
            </Typography>
            <Icon
              sx={{
                ml: "auto",
                transition: "all .2s",
                ...(showCompleted && { transform: "rotate(180deg)" }),
              }}
            >
              expand_more
            </Icon>
          </Button>
          {showCompleted &&
            columnTasks
              .filter((task) => task.completed)
              .map((task) => (
                <Task
                  key={task.id}
                  board={board}
                  columnId={column.id}
                  mutationUrl={mutationUrls.tasks}
                  task={task}
                />
              ))}
        </Box>
      </Box>
    </>
  );
}

const BoardInfo = ({
  setMobileOpen,
  board,
  showInfo,
  mutationUrls,
  setShowInfo,
  setDrawerOpen,
}) => {
  const titleRef: any = useRef();
  const descriptionRef: any = useRef();

  useEffect(() => {
    if (!descriptionRef.current || !descriptionRef.current || !board) return;
    titleRef.current.value = board.name;
    descriptionRef.current.value = board.description;
  }, [board, titleRef, descriptionRef]);

  const handleSave = useCallback(() => {
    if (
      !(
        (titleRef.current.value == board.name &&
          descriptionRef.current.value === board.description) ||
        titleRef.current.value.trim() == ""
      )
    ) {
      toast.promise(
        fetchApiWithoutHook("property/boards/edit", {
          id: board.id,
          name: titleRef.current.value,
          description: descriptionRef.current.value,
        }).then(() => mutate(mutationUrls.boardData)),
        {
          loading: "Updating...",
          success: "Updated board!",
          error: "An error occurred while updating the board",
        },
        toastStyles
      );
    }
  }, [titleRef, descriptionRef]);
  const session = useSession();

  return (
    <Box
      className="snap-center"
      sx={{
        borderRadius: 5,
        mt: { xs: 0, md: "10px" },
        ml: { xs: 0, md: "10px" },
        height: { xs: "500px", md: "calc(100vh - 20px)" },
        minHeight: { xs: "100%", md: "unset" },
        background: {
          md: showInfo
            ? session?.user?.darkMode
              ? "hsla(240,11%,15%, 0.8)"
              : "hsla(240, 11%, 95%, 0.5)"
            : session?.user?.darkMode
            ? "hsla(240,11%,13%, 0.8)"
            : "rgba(200,200,200,.1)",
        },
        border: { xs: "1px solid", md: "none" },
        borderColor: session?.user?.darkMode
          ? "hsla(240,11%,13%, 0.8)!important"
          : "rgba(200,200,200,.4)!important",
        position: { md: "sticky" },
        left: "10px",
        zIndex: 9,
        mr: { xs: 0, md: 2 },
        flexGrow: 1,
        flexBasis: 0,
        flex: { xs: "0 0 calc(100% - 70px)", md: "unset" },
        p: 4,
        py: showInfo ? 3 : 2,
        overflowY: "scroll",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        minWidth: { md: !showInfo ? "auto" : "320px" },
        maxWidth: { md: "300px" },
        backdropFilter: "blur(20px)!important",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(200,200,200,.3)",
          height: "75px",
          width: "3px",
          right: "10px",
          display: { md: "none" },
          borderRadius: 9999,
        }}
      />
      {showInfo ? (
        <>
          <Box sx={{ mt: "auto" }}>
            <TextField
              defaultValue={board.name}
              onChange={(e: any) => {
                e.target.value = e.target.value.replace(/\n|\r/g, "");
              }}
              inputRef={titleRef}
              placeholder="Board name"
              multiline
              onBlur={handleSave}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                className: "font-heading",
                sx: {
                  borderRadius: 2,
                  p: 1,
                  ml: -1,
                  mb: 0.5,
                  fontSize: "40px",
                  py: 0.5,
                  "&:focus-within": {
                    background: session?.user?.darkMode
                      ? "hsl(240,11%,18%)"
                      : "rgba(200,200,200,.2)",
                  },
                },
              }}
            />
            <TextField
              multiline
              defaultValue={board.description}
              inputRef={descriptionRef}
              onBlur={handleSave}
              placeholder="Click to add description"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  borderRadius: 2,
                  p: 1,
                  mb: 0.5,
                  ml: -1,
                  py: 1,
                  "&:focus-within": {
                    background: session?.user?.darkMode
                      ? "hsl(240,11%,18%)"
                      : "rgba(200,200,200,.2)",
                  },
                },
              }}
              maxRows={3}
            />
            <Box sx={{ my: 1 }}>
              <Chip
                sx={{ mr: 1, mb: 1 }}
                label={board.public ? "Public" : "Private"}
                icon={<Icon>{board.public ? "public " : "lock"}</Icon>}
              />
              {board.pinned && (
                <Chip
                  label="Pinned"
                  sx={{ mr: 1, mb: 1 }}
                  icon={<Icon>push_pin</Icon>}
                />
              )}
              {board.archived && (
                <Chip
                  label="Archived"
                  sx={{ mr: 1, mb: 1 }}
                  icon={<Icon>inventory_2</Icon>}
                />
              )}
              {board.integrations.find(
                (integration) => integration.name == "Canvas LMS"
              ) && (
                <Chip
                  onClick={async () => {
                    setMobileOpen(false);
                    toast.promise(
                      new Promise(async (resolve, reject) => {
                        try {
                          await fetchApiWithoutHook(
                            "property/integrations/run/canvas",
                            {
                              boardId: board.id,
                            }
                          );
                          await mutate(mutationUrls.tasks);
                          resolve("Success");
                        } catch (e: any) {
                          reject(e.message);
                        }
                      }),
                      {
                        loading: (
                          <div className="flex items-center gap-5">
                            <div>
                              <Typography>
                                Importing your assignments...
                              </Typography>
                              <Typography variant="body2">
                                Hang tight - this may take a while
                              </Typography>
                            </div>
                            <picture>
                              <img
                                src="https://i.ibb.co/4sNZm4T/image.png"
                                alt="Canvas logo"
                                className="h-7 w-7 rounded-full"
                              />
                            </picture>
                          </div>
                        ),
                        success: "Synced to Canvas!",
                        error:
                          "Yikes! An error occured. Please try again later",
                      },
                      toastStyles
                    );
                  }}
                  label="Resync to Canvas"
                  sx={{
                    mr: 1,
                    mb: 1,
                    background:
                      "linear-gradient(45deg, #FF0080 0%, #FF8C00 100%)",
                    color: "#000",
                  }}
                  icon={
                    <Icon
                      sx={{
                        color: "#000!important",
                      }}
                    >
                      refresh
                    </Icon>
                  }
                />
              )}
            </Box>
          </Box>

          <Box sx={{ mt: "auto", display: "flex", width: "100%" }}>
            <IconButton
              sx={{ mr: "auto", display: { md: "none" } }}
              onClick={() => {
                setDrawerOpen(true);
                navigator.vibrate(50);
              }}
            >
              <Icon className="outlined">unfold_more</Icon>
            </IconButton>
            <BoardSettings mutationUrl={mutationUrls.boardData} board={board} />
            <IconButton
              sx={{
                ml: "auto",
                display: { xs: "none", md: "flex" },
              }}
              onClick={() => setShowInfo(false)}
            >
              <Icon className="outlined">menu_open</Icon>
            </IconButton>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <IconButton
            onClick={() => setShowInfo(true)}
            sx={{ opacity: 0, pointerEvents: "none" }}
          >
            <Icon className="outlined">menu</Icon>
          </IconButton>
          <Typography
            sx={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              my: "auto",
              fontWeight: "700",
            }}
          >
            Board info
          </Typography>
          <IconButton onClick={() => setShowInfo(true)}>
            <Icon className="outlined">menu</Icon>
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

function RenderBoard({ mutationUrls, board, data, setDrawerOpen }) {
  const [showInfo, setShowInfo] = useState<boolean>(true);

  const trigger = useScrollTrigger({
    threshold: 0,
    target: window ? window : undefined,
  });

  const [currentColumn, setCurrentColumn] = useState<number>(0);
  const handleNext = useCallback(
    () => setCurrentColumn((c) => c + 1),
    [setCurrentColumn]
  );
  const handlePrev = useCallback(
    () => setCurrentColumn((c) => c - 1),
    [setCurrentColumn]
  );

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 900px)");

  return (
    <Box
      className="snap-x snap-mandatory sm:snap-none"
      sx={{
        display: "flex",
        maxWidth: "100vw",
        overflowX: "scroll",
        mt: { xs: -2, sm: 0 },
        height: { sm: "" },
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          bottom: {
            xs: "70px",
            md: "30px",
          },
          opacity: trigger ? 0 : 1,
          transform: trigger ? "scale(0.9)" : "scale(1)",
          mr: {
            xs: 1.5,
            md: 3,
          },
          zIndex: 99,
          background: session?.user?.darkMode
            ? "hsla(240,11%,14%,0.5)"
            : "rgba(255,255,255,.5)",
          border: "1px solid",
          transition: "transform .2s, opacity .2s",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          borderRadius: 999,
          borderColor: session?.user?.darkMode
            ? "hsla(240,11%,25%, 0.5)"
            : "rgba(200,200,200, 0.3)",
          right: 0,
          color: session?.user?.darkMode ? "#fff" : "#000",
          display: "flex",
          alignItems: "center",
          p: 0.5,
        }}
      >
        <IconButton
          onClick={handlePrev}
          disabled={currentColumn === 0}
          sx={{
            width: 50,
            borderRadius: 999,
          }}
        >
          <Icon>west</Icon>
        </IconButton>
        <IconButton
          sx={{
            width: 50,
            borderRadius: 999,
          }}
          onClick={handleNext}
          disabled={currentColumn === data.length - 1}
        >
          <Icon>east</Icon>
        </IconButton>
      </Box>
      {!isMobile && (
        <BoardInfo
          setMobileOpen={setMobileOpen}
          setShowInfo={setShowInfo}
          setDrawerOpen={setDrawerOpen}
          board={board}
          showInfo={showInfo}
          mutationUrls={mutationUrls}
        />
      )}
      <SwipeableDrawer
        open={mobileOpen}
        onOpen={() => setMobileOpen(true)}
        onClose={() => setMobileOpen(false)}
        sx={{ zIndex: 9999999 }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(0px)!important",
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            m: "20px",
            maxWidth: "calc(100vw - 40px)!important",
            maxHeight: "calc(100vh - 40px)!important",
          },
        }}
      >
        {isMobile && (
          <BoardInfo
            setMobileOpen={setMobileOpen}
            setShowInfo={setShowInfo}
            setDrawerOpen={setDrawerOpen}
            board={board}
            showInfo={showInfo}
            mutationUrls={mutationUrls}
          />
        )}
      </SwipeableDrawer>
      <IconButton
        size="large"
        onContextMenu={() => {
          navigator.vibrate(50);
          setDrawerOpen(true);
        }}
        onClick={() => {
          navigator.vibrate(50);
          setMobileOpen(true);
        }}
        sx={boardSwitcherStyles(session?.user?.darkMode)}
      >
        <Icon className="outlined">menu</Icon>
      </IconButton>

      {data
        .filter((_, index) => index == currentColumn || !isMobile)
        .map((column, index) => (
          <Column
            index={index}
            mutationUrls={mutationUrls}
            column={column}
            key={column.id}
            board={board}
          />
        ))}
    </Box>
  );
}

export function Board({ mutationUrl, board, setDrawerOpen }) {
  const { data, url, error } = useApi("property/boards/tasks", {
    id: board.id,
  });

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Yikes! An error occured while trying to load the items in this board.
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <RenderBoard
      data={data}
      mutationUrls={{
        boardData: mutationUrl,
        tasks: url,
      }}
      board={board}
      setDrawerOpen={setDrawerOpen}
    />
  );
}
