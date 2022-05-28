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
          mr: 1,
          color: global.theme === "dark" ? "hsl(240, 11%, 90%)" : "#606060",
          "&:hover": {
            background: "rgba(200,200,200,.3)",
            color: global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
          },
          "&:focus-within": {
            background:
              (global.theme === "dark"
                ? colors[themeColor]["900"]
                : colors[themeColor]["50"]) + "!important",
            color: global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
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
