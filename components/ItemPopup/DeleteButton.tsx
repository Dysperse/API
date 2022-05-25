import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import React from "react";

export function DeleteButton({
  id,
  deleted,
  setDeleted,
  setDrawerState,
  setOpen,
}: any): JSX.Element {
  return (
    <Tooltip title="Move to trash">
      <IconButton
        disableRipple
        size="large"
        edge="end"
        color="inherit"
        aria-label="menu"
        sx={{
          transition: "none",
          color: "#404040",
          "&:hover": { background: "rgba(200,200,200,.3)", color: "#000" },
          "&:active": {
            boxShadow: "none!important",
          },
          "&:focus-within": {
            background: colors[themeColor]["100"] + "!important",
            color: "#000",
            boxShadow: "inset 0px 0px 0px 2px " + colors[themeColor]["800"],
          },
        }}
        onClick={() => {
          fetch("https://api.smartlist.tech/v2/items/delete/", {
            method: "POST",
            body: new URLSearchParams({
              token: global.session && global.session.accessToken,
              id: id.toString(),
              date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            }),
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
