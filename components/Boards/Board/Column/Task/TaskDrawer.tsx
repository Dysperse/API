import {
  Box,
  Button,
  Checkbox,
  Chip,
  Icon,
  IconButton,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import hexToRgba from "hex-to-rgba";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import {
  neutralizeBack,
  revivalBack,
} from "../../../../../hooks/useBackButton";
import { colors } from "../../../../../lib/colors";
import { Color } from "./Color";
import { CreateTask } from "./Create";
import { ImageViewer } from "./ImageViewer";
import { SubTask } from "./SubTask";

export function TaskDrawer({
  checked,
  setChecked,
  task,
  boardId,
  open,
  setOpen,
  BpIcon,
  BpCheckedIcon,
  mutationUrl,
  columnId,
  handleDelete,
}) {
  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)
      ?.setAttribute(
        "content",
        open
          ? colors[task.color ?? global.themeColor ?? "brown"][
              global.theme === "dark" ? 900 : 50
            ]
          : "#fff"
      );
  });
  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  const [emblaRef] = useEmblaCarousel(
    {
      loop: false,
      containScroll: "keepSnaps",
      dragFree: true,
    },
    [WheelGesturesPlugin()]
  );

  const [view, setView] = useState<"Details" | "Subtasks">("Details");

  return (
    <SwipeableDrawer
      anchor="right"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      disableSwipeToOpen
      BackdropProps={{
        className: "override-bg",
        sx: {
          background:
            hexToRgba(colors[task.color ?? "brown"][200], 0.5) + "!important",
          backdropFilter: "blur(5px)",
        },
      }}
      PaperProps={{
        sx: {
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: "100%",
          mx: "auto",
          height: "100vh",
          maxWidth: "500px",
          background:
            colors[task.color ?? task.color ?? global.themeColor ?? "brown"][
              global.theme === "dark" ? 900 : 50
            ],
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
        <IconButton disableRipple onClick={() => setOpen(false)}>
          <Icon
            sx={{
              display: { sm: "none!important" },
            }}
          >
            west
          </Icon>
          <Icon
            sx={{ display: { xs: "none!important", sm: "block!important" } }}
          >
            close
          </Icon>
        </IconButton>
        <Typography sx={{ mx: "auto", opacity: { sm: 0 } }}>Details</Typography>
        <IconButton
          disableRipple
          disabled={global.permission == "read-only"}
          onClick={() => {
            handleDelete(task.id);
            setOpen(false);
          }}
        >
          <Icon>delete</Icon>
        </IconButton>
      </Box>
      <Box sx={{ p: 5, px: 3, pt: 2, overflowY: "auto" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ height: "100%", alignSelf: "flex-start", pt: 1.5 }}>
            <Checkbox
              disabled={global.permission == "read-only"}
              disableRipple
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
                fetchApiWithoutHook("property/boards/markTask", {
                  completed: e.target.checked ? "true" : "false",
                  id: task.id,
                }).catch((err) =>
                  toast.error("An error occured while updating the task")
                );
              }}
              sx={{
                transform: "scale(1.3)",
                "&:hover": { bgcolor: "transparent" },
              }}
              color="default"
              checkedIcon={<BpCheckedIcon />}
              icon={<BpIcon />}
              inputProps={{ "aria-label": "Checkbox demo" }}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              disabled={global.permission == "read-only"}
              defaultValue={task.name}
              onBlur={(e: any) => {
                fetchApiWithoutHook("property/boards/editTask", {
                  name: e.target.value,
                  id: task.id,
                }).then(() => {
                  mutate(mutationUrl);
                });
              }}
              placeholder="Item name"
              variant="standard"
              InputProps={{
                className: "font-secondary",
                sx: {
                  fontSize: "40px",
                  height: "70px",
                  mb: 3,
                  borderRadius: 4,
                },
              }}
            />
            <Button
              variant={"contained"}
              onClick={() => setView("Details")}
              accessKey="a"
              sx={{
                borderRadius: 4,
                mr: 1,
                background:
                  view == "Details"
                    ? colors[task.color][global.theme === "dark" ? 50 : 900] +
                      "!important"
                    : "transparent!important",
                color:
                  view == "Details"
                    ? colors[task.color][global.theme === "dark" ? 900 : 50] +
                      "!important"
                    : colors[task.color][global.theme === "dark" ? 50 : 900] +
                      "!important",
              }}
            >
              Details
            </Button>
            <Button
              variant={"contained"}
              onClick={() => setView("Subtasks")}
              accessKey="s"
              sx={{
                gap: 1.5,
                background:
                  view == "Subtasks"
                    ? colors[task.color][global.theme === "dark" ? 50 : "900"] +
                      "!important"
                    : "transparent!important",
                borderRadius: 4,
                color:
                  view == "Subtasks"
                    ? colors[task.color][global.theme === "dark" ? 900 : 50] +
                      "!important"
                    : colors[task.color][global.theme === "dark" ? 50 : 900] +
                      "!important",
              }}
            >
              Subtasks
              <Chip
                label={task.subTasks.length}
                size="small"
                sx={{
                  transition: "none",
                  pointerEvents: "none",
                  backgroundColor:
                    colors[task.color][view === "Subtasks" ? 700 : 100],
                  color: colors[task.color][view === "Subtasks" ? 50 : 900],
                }}
              />
            </Button>
            {view == "Details" && (
              <TextField
                multiline
                fullWidth
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    color:
                      colors[task.color ?? global.themeColor ?? "brown"][
                        global.theme === "dark" ? 50 : 900
                      ],
                    background:
                      colors[task.color ?? global.themeColor ?? "brown"][
                        global.theme === "dark" ? 800 : 100
                      ],
                    borderRadius: 5,
                    p: 2,
                    mt: 2,
                    "&:focus-within": {
                      background:
                        colors[task.color ?? global.themeColor ?? "brown"][
                          global.theme === "dark" ? 800 : 100
                        ],
                      boxShadow:
                        "0px 0px 0px 2px " +
                        colors[task.color ?? global.themeColor ?? "brown"][
                          global.theme === "dark" ? 700 : 900
                        ],
                    },
                  },
                }}
                onBlur={(e) => {
                  fetchApiWithoutHook("property/boards/editTask", {
                    description: e.target.value,
                    id: task.id,
                  }).then(() => {
                    mutate(mutationUrl);
                  });
                }}
                disabled={global.permission == "read-only"}
                placeholder={
                  global.permission == "read-only"
                    ? "Add a description. Wait you can't because you have no permission 😂"
                    : "Add a description"
                }
                minRows={4}
                defaultValue={task.description}
              />
            )}
          </Box>
        </Box>
        {view == "Details" && task.image && (
          <Box
            sx={{
              ml: 7,
              mt: task.image ? 2 : 0,
            }}
          >
            <ImageViewer url={task.image} />
          </Box>
        )}
        {view == "Details" && (
          <Box
            ref={emblaRef}
            sx={{
              mt: 2,
              gap: 2,
              overflowX: "auto",
              ml: 7,
              borderRadius: 5,
            }}
          >
            <Box className="embla__container" sx={{ gap: 1 }}>
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
                  task={task}
                  mutationUrl={mutationUrl}
                  color={color}
                  key={color}
                />
              ))}
            </Box>
          </Box>
        )}

        {view == "Subtasks" && (
          <Box sx={{ ml: 6, mt: 2 }}>
            {task.subTasks.map((subtask) => (
              <SubTask
                mutationUrl={mutationUrl}
                checkList={false}
                key={subtask.id}
                noMargin
                BpIcon={BpIcon}
                BpCheckedIcon={BpCheckedIcon}
                subtask={subtask}
              />
            ))}
            <CreateTask
              parent={task.id}
              boardId={boardId}
              columnId={columnId}
              mutationUrl={mutationUrl}
            />
          </Box>
        )}
      </Box>
    </SwipeableDrawer>
  );
}
