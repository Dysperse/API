import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import { colors } from "../../lib/colors";

export const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: 5,
  width: 21,
  height: 21,
  boxShadow:
    "inset 0 0 0 2px rgba(16,22,26,.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  backgroundColor: theme.palette.mode === "dark" ? "#394b59" : "#f5f8fa",
  backgroundImage:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
      : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
  },
  "input:disabled ~ &": {
    // boxShadow: "none",
    background: "transparent",
    backgroundImage: `url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='%23606060' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' class='feather feather-plus'%3E%3Cline x1='12' y1='5' x2='12' y2='19'%3E%3C/line%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3C/svg%3E");`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
}));

export const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: colors[global.themeColor ?? "brown"][700],
  backgroundImage:
    "linear-gradient(180deg," +
    colors[global.themeColor ?? "brown"][700] +
    " ,hsla(0,0%,100%,0))",
  "&:before": {
    display: "block",
    width: 21,
    height: 21,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: colors[global.themeColor ?? "brown"][900],
  },
});

export function Task({ task }): JSX.Element {
  const [checked, setChecked] = useState(task.completed);
  return (
    <Box>
      {task.subTasks.length >= 0 && (
        <ListItem
          sx={{
            borderRadius: 4,
            gap: 0.5,
            py: 0,
            px: 0,
          }}
        >
          <Checkbox
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
            }}
            sx={{
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
          />

          <ListItemIcon>
            <IconButton
              size="small"
              sx={{
                ml: "auto",
                transition: "none!important",
                border: "1px solid rgba(200, 200, 200, 0)!important",
                "&:hover,&:active": {
                  color: "#000",
                  border: "1px solid rgba(200, 200, 200, 0.5)!important",
                },
              }}
            >
              <span className="material-symbols-outlined">more_horiz</span>
            </IconButton>
          </ListItemIcon>
        </ListItem>
      )}
      {task.subTasks.map((subtask) => (
        <ListItem
          key={subtask.id}
          sx={{
            ml: "30px",
            maxWidth: "calc(100% - 30px)",
            pl: 0,
            gap: 0.5,
            py: 0,
            borderRadius: 4,
          }}
        >
          <Checkbox
            sx={{
              "&:hover": { bgcolor: "transparent" },
            }}
            color="default"
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            inputProps={{ "aria-label": "Checkbox demo" }}
          />
          <ListItemText primary={subtask.name} />
        </ListItem>
      ))}
    </Box>
  );
}
