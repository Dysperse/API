import {
  CardActionArea,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import { colors } from "../../lib/colors";
import React from "react";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import toast from "react-hot-toast";
import hexToRgba from "hex-to-rgba";
import { CreateTask } from "./CreateTask";

const Color = ({ color }: { color: string }) => {
  return (
    <CardActionArea
      sx={{
        width: "50px",
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
  boxShadow: dark
    ? "inset 0 0 0 2px rgba(16,22,26,.3)"
    : "inset 0 0 0 2px rgba(255,255,255,.6)",
  backgroundColor: "transparent",
  ".Mui-focusVisible &": {
    boxShadow:
      "0px 0px 0px 2px inset " +
      colors[themeColor][700] +
      ", 0px 0px 0px 15px inset " +
      hexToRgba(colors[themeColor][900], 0.1),
  },
  "input:not(:checked):hover ~ &": {
    boxShadow:
      "inset 0 0 0 2px rgba(" + !dark ? "255,255,255" : "16,22,26" + ",.5)",
    backgroundColor: !dark ? colors[themeColor][700] : "#ccc!important",
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
}: any): JSX.Element {
  const [checked, setChecked] = useState(task.completed);
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <SwipeableDrawer
        anchor="right"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        disableSwipeToOpen
        PaperProps={{
          elevation: 0,
          sx: {
            width: "100%",
            m: { sm: "20px" },
            height: { sm: "calc(100% - 40px)" },
            borderRadius: 5,
            maxWidth: 500,
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
            sx={{
              mt: 2,
              display: "block",
            }}
          >
            <Color color="red" />
            <Color color="orange" />
            <Color color="lightBlue" />
            <Color color="blue" />
            <Color color="purple" />
            <Color color="pink" />
            <Color color="green" />
            <Color color="deepOrange" />
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
          sx={{
            borderRadius: 4,
            gap: 0.5,
            py: 0,
            px: 0,
            userSelect: "none",
            "&:hover": {
              backgroundColor: "rgba(200,200,200,0.3)",
              cursor: "pointer",
            },
            transition: "transform 0.2s ease-in-out",
            "&:active": {
              transform: "scale(.98)",
              transition: "none",
            },
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
                  fontWeight: "500",
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
