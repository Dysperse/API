import { Icon, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../hooks/useApi";

export function MoreOptions({ goal, mutationUrl, setOpen }): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <Icon>share</Icon>
          Share
        </MenuItem>
        <MenuItem onClick={handleClose} disabled={goal.completed}>
          <Icon>edit</Icon> Edit
        </MenuItem>
        <MenuItem
          disabled={goal.completed}
          onClick={() => {
            handleClose();
            fetchApiWithoutHook("user/routines/delete", {
              id: goal.id,
            }).then(async () => {
              await mutate(mutationUrl);
              setOpen(false);
            });
          }}
        >
          <Icon>delete</Icon> Delete
        </MenuItem>
      </Menu>
      <IconButton color="inherit" disableRipple onClick={handleClick}>
        <Icon>more_horiz</Icon>
      </IconButton>
    </>
  );
}
