import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import hexToRgba from "hex-to-rgba";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import { colors } from "../../../../../lib/colors";
import { CreateTask } from "./Create";

import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  IconButton,
  ListItem,
  ListItemText,
  styled,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import {
  neutralizeBack,
  revivalBack,
} from "../../../../../hooks/useBackButton";

function ImageViewer({ url, trimHeight = false }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }}
        onClick={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }}
        PaperProps={{
          sx: {
            borderRadius: 5,
            width: { xs: "100%", sm: "auto" },
            height: "auto",
            maxWidth: "100vw",
            maxHeight: "calc(100vh - 20px)",
            "& img": {
              width: { xs: "100%", sm: "auto" },
              height: { xs: "auto", sm: "100%" },
              maxHeight: "calc(100vh - 20px)",
              maxWidth: "100vw",
            },
          },
        }}
      >
        <picture>
          <img src={url} alt="Modal" />
          <IconButton
            sx={{
              background: "black!important",
              color: "#fff",
              border: "none",
              boxShadow: "none",
              position: "absolute",
              top: 5,
              right: 5,
            }}
            onClick={() => setOpen(false)}
          >
            <span className="material-symbols-rounded">close</span>
          </IconButton>
        </picture>
      </Dialog>
      <Box
        sx={{
          ...(!url && { display: "none" }),
          "&:hover": {
            filter: "brightness(90%)",
            cursor: "pointer",
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
      >
        <picture>
          <img
            alt="asdf"
            draggable={false}
            src={url}
            style={{
              width: "100%",
              borderRadius: "15px",
              height: "100%",
              ...(trimHeight && {
                maxHeight: "100px",
              }),
              objectFit: "cover",
            }}
          />
        </picture>
      </Box>
    </>
  );
}

const Color = ({
  task,
  mutationUrl,
  color,
}: {
  task;
  mutationUrl;
  color: string;
}) => {
  return (
    <Box
      sx={{
        width: "30px",
        flex: "0 0 30px",
        borderRadius: 9,
        cursor: "pointer",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        background: colors[color]["A400"] + "!important",
        "&:hover": {
          background: colors[color]["A700"] + "!important",
        },
      }}
      onClick={(e) => {
        fetchApiWithoutHook("property/boards/editTask", {
          color: color,
          id: task.id,
        }).then(() => {
          mutate(mutationUrl);
        });
      }}
    >
      <span
        className="material-symbols-rounded"
        style={{
          opacity: task.color == color ? 1 : 0,
        }}
      >
        check
      </span>
    </Box>
  );
};

export let BpIcon: any = styled("span")(({ theme, dark = false }: any) => ({
  borderRadius: 99,
  width: 25,
  height: 25,
  boxShadow: "inset 0 0 0 2px rgba(0,0,0,.6)",
  backgroundColor: "transparent",
  ".Mui-focusVisible &": {
    boxShadow:
      "0px 0px 0px 2px inset " +
      colors[themeColor][700] +
      ", 0px 0px 0px 15px inset " +
      hexToRgba(colors[themeColor][900], 0.1),
  },
  "input:not(:checked):hover ~ &": {
    boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.5)",
    backgroundColor:
      global.theme !== "dark"
        ? colors[themeColor][100]
        : "hsl(240,11%,30%)!important",
  },
  "input:disabled ~ &": {
    background: "transparent",
    backgroundImage: `url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' class='feather feather-plus'%3E%3Cline x1='12' y1='5' x2='12' y2='19'%3E%3C/line%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3C/svg%3E");`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
}));

export let BpCheckedIcon: any = styled(BpIcon)({
  backgroundColor: colors[global.themeColor ?? "brown"][900] + "!important",
  "&:before": {
    display: "block",
    width: 25,
    height: 25,
    backgroundImage: `url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' class='feather feather-check'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: colors[global.themeColor ?? "brown"][900],
  },
});

function SubTask({ noMargin = false, subtask, BpCheckedIcon, BpIcon }) {
  const [checked, setChecked] = useState(subtask.completed);
  return (
    <ListItem
      key={subtask.id}
      sx={{
        ml: noMargin ? "10px" : "30px",
        maxWidth: "calc(100% - 30px)",
        pl: 0,
        gap: 1.5,
        mb: 0.5,
        py: 0,
        borderRadius: 4,
      }}
    >
      <Checkbox
        disableRipple
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked);
          fetchApiWithoutHook("property/boards/markTask", {
            completed: e.target.checked ? "true" : "false",
            id: subtask.id,
          }).catch((err) =>
            toast.error("An error occured while updating the task")
          );
        }}
        sx={{
          p: 0,
          "&:hover": { bgcolor: "transparent" },
        }}
        color="default"
        checkedIcon={<BpCheckedIcon />}
        icon={<BpIcon />}
        inputProps={{ "aria-label": "Checkbox demo" }}
      />
      <ListItemText
        primary={
          <span
            style={{
              opacity: checked ? 0.5 : 1,
              textDecoration: checked ? "line-through" : "none",
            }}
          >
            {subtask.name}
          </span>
        }
      />
    </ListItem>
  );
}

export const Task = React.memo(function Task({
  boardId,
  columnId,
  mutationUrl,
  task,
  checkList,
}: any): JSX.Element {
  let BpIcon: any = styled("span")(({ theme, dark = false }: any) => ({
    borderRadius: 99,
    width: 25,
    height: 25,
    boxShadow: global.user.darkMode
      ? "inset 0 0 0 2px rgba(255,255,255,.6)"
      : "inset 0 0 0 2px rgba(0,0,0,.6)",
    backgroundColor: "transparent",
    ".Mui-focusVisible &": {
      boxShadow:
        "0px 0px 0px 2px inset " +
        colors[themeColor][700] +
        ", 0px 0px 0px 15px inset " +
        hexToRgba(colors[themeColor][900], 0.1),
    },
    "input:not(:checked):hover ~ &": {
      boxShadow: global.user.darkMode
        ? "inset 0 0 0 2px rgba(255,255,255,0.5)"
        : "inset 0 0 0 2px rgba(0,0,0,.5)",
      backgroundColor:
        global.theme !== "dark"
          ? colors[themeColor][100]
          : "hsl(240,11%,20%)!important",
    },
    "input:disabled ~ &": {
      background: "transparent",
      backgroundImage: `url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' class='feather feather-plus'%3E%3Cline x1='12' y1='5' x2='12' y2='19'%3E%3C/line%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3C/svg%3E");`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
  }));

  let BpCheckedIcon: any = styled(BpIcon)({
    backgroundColor:
      colors[task.color ?? global.themeColor ?? "brown"][
        global.user.darkMode ? 50 : 900
      ] + "!important",
    "&:before": {
      display: "block",
      width: 26,
      height: 26,
      backgroundImage: `url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23${
        global.user.darkMode ? "000" : "fff"
      }' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' class='feather feather-check'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor:
        colors[task.color ?? global.themeColor ?? "brown"][
          global.user.darkMode ? 50 : 900
        ],
    },
  });

  const [emblaRef] = useEmblaCarousel(
    {
      loop: false,
      containScroll: "keepSnaps",
      dragFree: true,
    },
    [WheelGesturesPlugin()]
  );
  const [checked, setChecked] = useState(task.completed);
  const [open, setOpen] = useState(false);
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
  const [view, setView] = useState<"Details" | "Subtasks">("Details");

  return (
    <Box>
      <SwipeableDrawer
        anchor="right"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            mb: { sm: 2 },
            width: "100%",
            mx: "auto",
            height: "100vh",
            maxWidth: "500px",
            // borderRadius: { sm: "20px 0 0 20px" },
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
            <span className="material-symbols-rounded">west</span>
          </IconButton>
          <Typography sx={{ mx: "auto" }}>Details</Typography>
          <IconButton disableRipple disabled={global.permission == "read-only"}>
            <span className="material-symbols-rounded">delete</span>
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
                sx={{
                  gap: 1.5,
                  background:
                    view == "Subtasks"
                      ? colors[task.color][
                          global.theme === "dark" ? 50 : "900"
                        ] + "!important"
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
      {task.subTasks.length >= 0 && (
        <ListItem
          onClick={() => setOpen(true)}
          className="p-0 rounded-xl gap-0.5 select-none hover:cursor-pointer transition-transform active:scale-[.98] duration-100 active:duration-[0s] border border-gray-200"
          sx={{
            color:
              task.color !== "blue"
                ? colors[task.color][global.theme === "dark" ? "A400" : 900]
                : "",
            p: 0,
            "&:hover": {
              backgroundColor: global.user.darkMode
                ? "hsl(240,11%,16%)"
                : "rgba(200,200,200,0.3)",
              cursor: "pointer",
            },
            ...(!checkList && {
              border: "0!important",
            }),
            ...(checkList && {
              background: global.user.darkMode
                ? "hsl(240,11%,13%)"
                : "#f3f4f6!important",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              gap: "10px!important",
              borderRadius: "15px!important",
              mb: 1.5,
            }),
          }}
        >
          <ListItemText
            sx={{
              my: 0,
            }}
            primary={
              <Box>
                <span
                  style={{
                    fontWeight: "400",
                    ...(checked && {
                      textDecoration: "line-through",
                      opacity: 0.5,
                    }),
                  }}
                >
                  <Checkbox
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
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    sx={{
                      "&:hover": { bgcolor: "transparent" },
                    }}
                    color="default"
                    checkedIcon={<BpCheckedIcon dark />}
                    icon={<BpIcon dark />}
                    inputProps={{ "aria-label": "Checkbox demo" }}
                  />
                  {task.name}
                  <Box
                    sx={{
                      ml: 5,
                    }}
                  >
                    {task.image && <ImageViewer trimHeight url={task.image} />}
                  </Box>
                </span>
              </Box>
            }
            secondary={
              <span
                style={{
                  ...(checked && {
                    textDecoration: "line-through",
                    opacity: 0.5,
                  }),
                  marginLeft: "45px",
                  display: "block",
                  position: "relative",
                  top: task.image ? "3px" : "-7px",
                  ...(task.image && {
                    marginBottom: "7px",
                  }),
                }}
              >
                {task.description}
                {task.due && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginTop: "3px",
                      marginLeft: "-6px",
                    }}
                  >
                    <span className="material-symbols-rounded mx-1">
                      schedule
                    </span>
                    {dayjs(task.due).format("MMMM D, YYYY")}
                  </span>
                )}
              </span>
            }
          />
        </ListItem>
      )}
      {task.subTasks.map((subtask) => (
        <SubTask
          key={task.id}
          BpIcon={BpIcon}
          BpCheckedIcon={BpCheckedIcon}
          subtask={subtask}
        />
      ))}
    </Box>
  );
});
