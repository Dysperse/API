import React from "react";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export function DeleteButton({
  id,
  deleted,
  setDeleted,
  setDrawerState,
  setOpen
}: any): JSX.Element {
  return (
    <Tooltip title="Move to trash">
      <IconButton
        size="large"
        edge="end"
        color="inherit"
        aria-label="menu"
        sx={{
          transition: "none",
          color: "#404040",
          "&:hover": { color: "#000" },
          mr: 1
        }}
        onClick={() => {
          fetch("https://api.smartlist.tech/v2/items/delete/", {
            method: "POST",
            body: new URLSearchParams({
              token: global.session && global.session.accessToken,
              id: id.toString(),
              date: dayjs().format("YYYY-M-D HH:mm:ss")
            })
          });
          setOpen(true);
          setDeleted(true);
          setDrawerState(false);
        }}
      >
        <span className="material-symbols-rounded">delete</span>
      </IconButton>
    </Tooltip>
  );
}
