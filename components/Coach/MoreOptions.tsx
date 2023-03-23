import { Icon, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import { mutate } from "swr";
import { fetchRawApi } from "../../lib/client/useApi";
import { ConfirmationModal } from "../ConfirmationModal";

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
      >
        <MenuItem onClick={handleClose} disabled>
          <Icon>share</Icon>
          Share (Coming soon!)
        </MenuItem>
        <ConfirmationModal
          title="Stop goal?"
          question="Are you sure you want to stop working towards this goal? ALL your progress will be lost FOREVER. You won't be able to undo this action!"
          callback={() => {
            handleClose();
            fetchRawApi("user/routines/delete", {
              id: goal.id,
            }).then(async () => {
              await mutate(mutationUrl);
              setOpen(false);
            });
          }}
        >
          <MenuItem disabled={goal.completed}>
            <Icon>stop</Icon> Stop goal
          </MenuItem>
        </ConfirmationModal>
      </Menu>
      <IconButton color="inherit" onClick={handleClick}>
        <Icon>more_horiz</Icon>
      </IconButton>
    </>
  );
}
