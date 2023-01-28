import { Box, Icon, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";

export function RoomActionMenu({ itemRef, isPrivate, isCustom }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <IconButton
      disabled={global.permission === "read-only" || !isCustom}
      size="small"
      ref={itemRef}
      onClick={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick(e);
      }}
      onMouseDown={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      sx={{
        transition: "none",
        backdropFilter: "blur(1px)",
        "&:hover": {
          background: "rgba(200,200,200,.3)",
        },
        ...(global.permission === "read-only" && {
          display: { sm: "none" },
          opacity: "1!important",
        }),
      }}
    >
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClose();
        }}
      >
        <MenuItem onClick={handleClose} disabled>
          Rename
        </MenuItem>
        <MenuItem onClick={handleClose} disabled>
          Make {isPrivate ? "private" : "public"}
        </MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
      <Icon className="outlined">
        {global.permission === "read-only" ? (
          "chevron_right"
        ) : isPrivate ? (
          "lock"
        ) : isCustom ? (
          "more_horiz"
        ) : (
          <Box
            sx={{
              display: { sm: "none!important" },
              color: global.user.darkMode ? "#fff" : "#404040",
            }}
            className="material-symbols-rounded"
          >
            chevron_right
          </Box>
        )}
      </Icon>
    </IconButton>
  );
}
