import CardActionArea from "@mui/material/CardActionArea";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import hexToRgba from "hex-to-rgba";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { CreateTask } from "./CreateTask";

const Color = ({ color }: { color: string }) => {
  return (
    <CardActionArea
      sx={{
        width: "50px",
        flex: "0 0 50px",
        borderRadius: 9,
        height: "50px",
        background: colors[color]["A700"],
      }}
    />
  );
};

export const BpIcon: any = styled("span")(({ theme, dark = false }: any) => ({
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

export const BpCheckedIcon: any = styled(BpIcon)({
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

function SubTask({ subtask }) {
  const [checked, setChecked] = useState(subtask.completed);
  return (
    <ListItem
      key={subtask.id}
      sx={{
        ml: "30px",
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

export const Task = React.memo(function ({
  boardId,
  columnId,
  mutationUrl,
  task,
  checkList,
}: any): JSX.Element {
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

  return (
    <Box>
      <SwipeableDrawer
        anchor="bottom"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        disableSwipeToOpen
        PaperProps={{
          elevation: 0,
          sx: {
            mb: { sm: 2 },
            width: "100%",
            mx: "auto",
            height: "90vh",
            maxWidth: "500px",
            borderRadius: 5,
            background: colors[global.themeColor ?? "brown"][900],
            color: colors[global.themeColor ?? "brown"][50],
          },
        }}
      >
        <Box sx={{ p: 5, px: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box sx={{ height: "100%", alignSelf: "flex-start", pt: 0 }}>
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
                  "&:hover": { bgcolor: "transparent" },
                }}
                color="default"
                checkedIcon={<BpCheckedIcon />}
                icon={<BpIcon />}
                inputProps={{ "aria-label": "Checkbox demo" }}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: "900" }}>
                {task.name}
              </Typography>
              <TextField
                multiline
                fullWidth
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    color: colors[global.themeColor ?? "brown"][50],
                    background: colors[global.themeColor ?? "brown"][800],
                    borderRadius: 5,
                    p: 2,
                    mt: 2,
                    "&:focus-within": {
                      background: colors[global.themeColor ?? "brown"][700],
                      boxShadow:
                        "0px 0px 0px 2px " +
                        colors[global.themeColor ?? "brown"][300],
                    },
                  },
                }}
                placeholder="Add a description"
                minRows={4}
                value={task.description}
              />
            </Box>
          </Box>

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
            <Box className="embla__container" sx={{ gap: 2 }}>
              <Color color="red" />
              <Color color="orange" />
              <Color color="lightBlue" />
              <Color color="blue" />
              <Color color="purple" />
              <Color color="pink" />
              <Color color="green" />
              <Color color="deepOrange" />
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              borderRadius: "20px 20px 0 0",
              maxHeight: "50vh",
              overflowY: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 3,
              background: colors[global.themeColor ?? "brown"][50],
              color: "#000",
            }}
          >
            {task.subTasks.map((subtask) => (
              <SubTask subtask={subtask} />
            ))}
            <CreateTask
              parent={task.id}
              boardId={boardId}
              columnId={columnId}
              mutationUrl={mutationUrl}
            />
          </Box>
        </Box>
      </SwipeableDrawer>
      {task.subTasks.length >= 0 && (
        <ListItem
          onClick={() => setOpen(true)}
          className="rounded-xl gap-0.5 select-none hover:cursor-pointer transition-transform active:scale-[.99] hover:bg-neutral-200 dark:hover:bg-[hsl(240,11%,16%)] duration-100 active:duration-[0s] border border-gray-200"
          sx={{
            p: 0,
            ...(!checkList && {
              border: "0!important",
            }),
            ...(checkList && {
              background:
                global.theme === "dark"
                  ? "hsl(240,11%,13%)"
                  : "#f3f4f6!important",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              px: 1,
              py: 1,
              gap: "10px!important",
              borderRadius: "15px!important",
              mb: 1.5,
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
          <ListItemText
            primary={
              <span
                style={{
                  fontWeight: "400",
                  ...(checked && {
                    textDecoration: "line-through",
                    opacity: 0.5,
                  }),
                }}
              >
                {task.name}
              </span>
            }
            secondary={
              <span
                style={{
                  ...(checked && {
                    textDecoration: "line-through",
                    opacity: 0.5,
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
        <SubTask subtask={subtask} />
      ))}
    </Box>
  );
});
