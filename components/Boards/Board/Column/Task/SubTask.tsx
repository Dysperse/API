import { Checkbox, ListItem, ListItemText } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";

export function SubTask({ noMargin = false, subtask, BpCheckedIcon, BpIcon }) {
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
