import StarBorderIcon from "@mui/icons-material/StarBorder";
import { orange } from "@mui/material/colors";
import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import React from "react";

export function StarButton({ setLastUpdated, id, star, setStar }: any) {
  return (
    <Tooltip title={star === 0 ? "Star" : "Unstar"}>
      <IconButton
          disableRipple
        size="large"
        edge="end"
        color="inherit"
        aria-label="menu"
        sx={{
          mr: 1,
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
          ...(parseInt(star, 10) === 1 && {
            "&:hover": {
              background: global.theme === "dark" ? orange[900] : orange[50],
              color: "#000",
            },
            "&:active": {
              boxShadow: "none!important",
            },
            "&:focus-within": {
              background: orange[100] + "!important",
              color: "#000",
              boxShadow: "inset 0px 0px 0px 2px " + orange[900],
            },
          }),
        }}
        onClick={() => {
          setLastUpdated(dayjs().format("YYYY-MM-DD HH:mm:ss"));
          setStar((s: number) => {
            fetch("https://api.smartlist.tech/v2/items/star/", {
              method: "POST",
              body: new URLSearchParams({
                token: global.session && global.session.accessToken,
                id: id.toString(),
                date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              }),
            });
            return +!s;
          });
        }}
      >
        {star === 1 ? (
          <span
            className="material-symbols-rounded"
            style={{
              color: global.theme === "dark" ? orange[200] : orange[600],
            }}
          >
            star_border
          </span>
        ) : (
          <StarBorderIcon />
        )}
      </IconButton>
    </Tooltip>
  );
}
