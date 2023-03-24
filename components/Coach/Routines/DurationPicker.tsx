import { Button, Icon, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export function DurationPicker({ duration, setDuration }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (d) => {
    setDuration(d);
    setAnchorEl(null);
  };
  return (
    <>
      <Button size="small" variant="contained" onClick={handleClick}>
        {duration}
        <Icon className="outlined">edit</Icon>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => handleClose(10)}>10 days</MenuItem>
        <MenuItem onClick={() => handleClose(25)}>25 days</MenuItem>
        <MenuItem onClick={() => handleClose(50)}>50 days</MenuItem>
        <MenuItem onClick={() => handleClose(75)}>75 days</MenuItem>
        <MenuItem onClick={() => handleClose(100)}>100 days</MenuItem>
        <MenuItem onClick={() => handleClose(365)}>365 days</MenuItem>
      </Menu>
    </>
  );
}
