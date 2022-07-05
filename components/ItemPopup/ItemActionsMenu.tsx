import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";
import { AddToListModal } from "./AddToList";
import { InfoButton } from "./InfoButton";
import { QrCodeModal } from "./QrCodeModal";
import { ShareModal } from "./ShareModal";

export function ItemActionsMenu({
  room,
  id,
  title,
  quantity,
  star,
}: any): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="More">
        <IconButton
          disableRipple
          size="large"
          edge="end"
          color="inherit"
          sx={{
            transition: "none",
            mr: -1,
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
          aria-label="menu"
          onClick={handleClick}
        >
          <span className="material-symbols-rounded">more_vert</span>
        </IconButton>
      </Tooltip>
      <Menu
        BackdropProps={{ sx: { opacity: "0!important" } }}
        elevation={0}
        id="basic-menu"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transitionDuration={300}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          transition: "all .2s",
          "& .MuiPaper-root": {
            mt: 1,
            borderRadius: "15px",
            minWidth: 180,
            background:
              global.theme === "dark"
                ? colors[global.themeColor][900]
                : colors[global.themeColor][100],

            color:
              global.theme === "dark"
                ? colors[global.themeColor][200]
                : colors[global.themeColor][800],
            "& .MuiMenu-list": {
              padding: "4px",
            },
            "& .MuiMenuItem-root": {
              "&:hover": {
                background:
                  global.theme === "dark"
                    ? colors[global.themeColor][800]
                    : colors[global.themeColor][200],
                color:
                  global.theme === "dark"
                    ? colors[global.themeColor][100]
                    : colors[global.themeColor][900],
                "& .MuiSvgIcon-root": {
                  color:
                    global.theme === "dark"
                      ? colors[global.themeColor][200]
                      : colors[global.themeColor][800],
                },
              },
              padding: "10px 15px",
              borderRadius: "15px",
              marginBottom: "1px",

              "& .MuiSvgIcon-root": {
                fontSize: 25,
                color: colors[global.themeColor][700],
                marginRight: 1.9,
              },
              "&:active": {
                background:
                  global.theme === "dark"
                    ? colors[global.themeColor][700]
                    : colors[global.themeColor][300],
              },
            },
          },
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <InfoButton id={id} title={title} star={star} quantity={quantity} />
        <ShareModal title={title} quantity={quantity} room={room} />
        {room.toLowerCase() === "kitchen" && (
          <MenuItem disableRipple onClick={handleClose}>
            <span
              style={{ marginRight: "15px" }}
              className="material-symbols-rounded"
            >
              auto_awesome
            </span>
            Find recipes
          </MenuItem>
        )}
        {/* <MenuItem disableRipple onClick={handleClose}>
          <span
            style={{ marginRight: "15px" }}
            className="material-symbols-rounded"
          >
            person_add
          </span>
          Invite collaborators
        </MenuItem> */}
        <AddToListModal handleClose={handleClose} title={title} />
        <QrCodeModal title={title} quantity={quantity} />
      </Menu>
    </>
  );
}
