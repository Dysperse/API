import {
  Box,
  Button,
  Checkbox,
  Chip,
  Drawer,
  Icon,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import hexToRgba from "hex-to-rgba";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import {
  neutralizeBack,
  revivalBack,
} from "../../../../../hooks/useBackButton";
import { colors } from "../../../../../lib/colors";
import { toastStyles } from "../../../../../lib/useCustomTheme";
import { Color } from "./Color";
import { CreateTask } from "./Create";
import { ImageViewer } from "./ImageViewer";
import { SubTask } from "./SubTask";

export const TaskDrawer = React.memo(function TaskDrawer({
  taskData,
  setTaskData,
  board,
  open,
  setOpen,
  BpIcon,
  BpCheckedIcon,
  mutationUrl,
  columnId,
  handleDelete,
  handlePriorityClick,
}: any) {
  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)
      ?.setAttribute(
        "content",
        open
          ? colors[taskData.color ?? global.themeColor ?? "brown"][
              global.user.darkMode ? 900 : 50
            ]
          : global.user.darkMode
          ? "hsl(240,11%,10%)"
          : "#fff"
      );
  });
  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  useHotkeys("alt+s", (e) => {
    e.preventDefault();
    setView("Subtasks");
  });

  useHotkeys("alt+d", (e) => {
    e.preventDefault();
    setView("Details");
  });

  const [view, setView] = useState<"Details" | "Subtasks">("Details");

  useHotkeys(
    "alt+e",
    (e) => {
      if (open) {
        e.preventDefault();
        handlePriorityClick();
      }
    },
    [handlePriorityClick]
  );

  const styles = (activeView: string) => {
    return {
      px: 1.5,
      cursor: "unset",
      gap: 1.5,
      background:
        view === activeView
          ? colors[taskData.color][global.user.darkMode ? 50 : 900] +
            "!important"
          : "transparent!important",

      "&:hover": {
        background:
          view === activeView
            ? colors[taskData.color][global.user.darkMode ? 100 : 800] +
              "!important"
            : colors[taskData.color][!global.user.darkMode ? 100 : 800] +
              "!important",
      },

      mr: 0.5,
      borderRadius: 4,
      color:
        view === activeView
          ? colors[taskData.color][global.user.darkMode ? 900 : 50] +
            "!important"
          : colors[taskData.color][global.user.darkMode ? 50 : 900] +
            "!important",
    };
  };
  return (
    <Drawer
      anchor="right"
      onClose={() => setOpen(false)}
      open={open}
      ModalProps={{
        keepMounted: false,
      }}
      BackdropProps={{
        className: "override-bg",
        sx: {
          background: `${hexToRgba(
            colors[taskData.color ?? "brown"][200],
            0.5
          )}!important`,
          backdropFilter: "blur(5px)",
        },
      }}
      PaperProps={{
        sx: {
          width: "100%",
          mx: "auto",
          height: "100vh",
          maxWidth: "500px",
          background:
            colors[
              taskData.color ?? taskData.color ?? global.themeColor ?? "brown"
            ][global.user.darkMode ? 900 : 50],
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
        }}
      >
        <IconButton onClick={() => setOpen(false)}>
          <Icon
            sx={{
              display: { sm: "none!important" },
            }}
          >
            west
          </Icon>
          <Icon
            sx={{
              display: { xs: "none!important", sm: "block!important" },
              WebkitAppRegion: "no-drag",
            }}
          >
            close
          </Icon>
        </IconButton>
        <Typography sx={{ mx: "auto", opacity: { sm: 0 } }}>Details</Typography>
        <Tooltip
          title={
            taskData.pinned
              ? "Remove important label (alt • e)"
              : "Mark as important (alt • e)"
          }
        >
          <IconButton
            disableRipple
            disabled={
              (board && board.archived) || global.permission === "read-only"
            }
            sx={{
              WebkitAppRegion: "no-drag",
            }}
            onClick={handlePriorityClick}
          >
            <Icon className={taskData.pinned ? "rounded" : "outlined"}>
              priority
            </Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete task (alt • a)">
          <IconButton
            disableRipple
            disabled={
              (board && board.archived) || global.permission === "read-only"
            }
            sx={{
              WebkitAppRegion: "no-drag",
            }}
            onClick={() => {
              handleDelete(taskData.id);
              setOpen(false);
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ p: 5, px: 3, pt: 2, overflowY: "auto" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ height: "100%", alignSelf: "flex-start", pt: 2 }}>
            <Checkbox
              disabled={
                (board && board.archived) || global.permission === "read-only"
              }
              disableRipple
              checked={taskData.checked}
              onChange={(e) => {
                setTaskData((prev: any) => ({
                  ...prev,
                  checked: e.target.checked,
                }));
                fetchApiWithoutHook("property/boards/markTask", {
                  completed: e.target.checked ? "true" : "false",
                  id: taskData.id,
                }).catch(() =>
                  toast.error(
                    "An error occured while updating the task",
                    toastStyles
                  )
                );
              }}
              sx={{
                transform: "scale(1.3)",
                "&:hover": { bgcolor: "transparent" },
              }}
              color="default"
              checkedIcon={<BpCheckedIcon />}
              icon={<BpIcon />}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              multiline
              disabled={
                (board && board.archived) || global.permission === "read-only"
              }
              defaultValue={taskData.name.replace(/\n/g, "")}
              onKeyDown={(e: any) => {
                if (e.key == "Enter") e.target.blur();
              }}
              onBlur={(e: any) => {
                e.target.value = e.target.value.replace(/\n/g, "");
                fetchApiWithoutHook("property/boards/editTask", {
                  name: e.target.value,
                  id: taskData.id,
                }).then(() => {
                  setTaskData({
                    ...taskData,
                    name: e.target.value,
                  });
                  mutate(mutationUrl);
                });
              }}
              placeholder="Item name"
              variant="standard"
              InputProps={{
                sx: {
                  fontSize: "40px",
                  // height: "70px",
                  mb: 3,
                  borderRadius: 4,
                },
              }}
            />
            <Button
              variant={"contained"}
              onClick={() => setView("Details")}
              onMouseDown={() => setView("Details")}
              sx={styles("Details")}
            >
              Details
            </Button>
            <Button
              variant={"contained"}
              id="subTasksTrigger"
              onClick={() => setView("Subtasks")}
              onMouseDown={() => setView("Subtasks")}
              sx={styles("Subtasks")}
            >
              Subtasks
              <Chip
                label={taskData.subTasks.length}
                size="small"
                sx={{
                  transition: "none",
                  pointerEvents: "none",
                  backgroundColor: hexToRgba(
                    colors[taskData.color][view === "Subtasks" ? 700 : 300],
                    0.5
                  ),
                  color: colors[taskData.color][view === "Subtasks" ? 50 : 900],
                }}
              />
            </Button>
            {view === "Details" && (
              <TextField
                multiline
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    color:
                      colors[taskData.color ?? global.themeColor ?? "brown"][
                        global.user.darkMode ? 50 : 900
                      ],
                    background:
                      colors[taskData.color ?? global.themeColor ?? "brown"][
                        global.user.darkMode ? 800 : 100
                      ],
                    borderRadius: 5,
                    p: 2,
                    mt: 2,
                    "&:focus-within": {
                      background:
                        colors[taskData.color ?? global.themeColor ?? "brown"][
                          global.user.darkMode ? 800 : 100
                        ],
                      boxShadow:
                        "0px 0px 0px 2px " +
                        colors[taskData.color ?? global.themeColor ?? "brown"][
                          global.user.darkMode ? 700 : 900
                        ],
                    },
                  },
                }}
                onKeyDown={(e: any) => {
                  if (e.key == "Enter") e.target.blur();
                }}
                onBlur={(e) => {
                  fetchApiWithoutHook("property/boards/editTask", {
                    description: e.target.value,
                    id: taskData.id,
                  }).then(() => {
                    setTaskData({
                      ...taskData,
                      description: e.target.value,
                    });
                    mutate(mutationUrl);
                  });
                }}
                disabled={
                  (board && board.archived) || global.permission === "read-only"
                }
                placeholder={
                  global.permission === "read-only"
                    ? "Add a description. Wait you can't because you have no permission 😂"
                    : "Add a description"
                }
                minRows={4}
                defaultValue={taskData.description}
              />
            )}
          </Box>
        </Box>
        {view === "Details" && taskData.image && (
          <Box
            sx={{
              ml: 7,
              mt: taskData.image ? 2 : 0,
            }}
          >
            <ImageViewer url={taskData.image} />
          </Box>
        )}
        {!(board && board.archived) && view === "Details" && (
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              pl: 7,
              pt: 3,
              flexWrap: "wrap",
            }}
          >
            {[
              "red",
              "orange",
              "deepOrange",
              "lightBlue",
              "blue",
              "indigo",
              "purple",
              "pink",
              "green",
              "lime",
              "brown",
              "blueGrey",
            ].map((color) => (
              <Color
                task={taskData}
                mutationUrl={mutationUrl}
                color={color}
                key={color}
              />
            ))}
          </Box>
        )}
        {view === "Subtasks" && (
          <Box sx={{ ml: 6, mt: 2 }}>
            {taskData.subTasks.map((subtask) => (
              <SubTask
                mutationUrl={mutationUrl}
                checkList={false}
                key={subtask.id}
                noMargin
                board={board}
                BpIcon={BpIcon}
                BpCheckedIcon={BpCheckedIcon}
                subtask={subtask}
              />
            ))}
            {!(board && board.archived) && (
              <CreateTask
                parent={taskData.id}
                boardId={board.id}
                columnId={columnId}
                mutationUrl={mutationUrl}
              />
            )}
          </Box>
        )}
      </Box>
    </Drawer>
  );
});
