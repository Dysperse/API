import { Menu, MenuItem } from "@mui/material";
import { cloneElement, useState } from "react";

export function FilterMenu({
  children,
  originalTasks,
  setColumnTasks,
  handleParentClose,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (sortingFunction) => {
    setColumnTasks(originalTasks.sort(sortingFunction));
    handleClose();
    handleParentClose();
  };

  const trigger = cloneElement(children, {
    onClick: handleClick,
  });

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: "-3px!important",
            ml: "7px!important",
          },
        }}
      >
        <MenuItem
          onClick={() =>
            handleMenuClick((a, b) => a.name.localeCompare(b.name))
          }
        >
          A-Z
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleMenuClick((a, b) => b.name.localeCompare(a.name))
          }
        >
          Z-A
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuClick((a, b) => b.createdAt - a.createdAt)}
        >
          Newest to oldest
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuClick((a, b) => a.createdAt - b.createdAt)}
        >
          Oldest to newest
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleMenuClick(
              (a, b) => (new Date(a.due) as any) - (new Date(b.due) as any)
            )
          }
        >
          Due date (ascending)
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleMenuClick(
              (a, b) => (new Date(b.due) as any) - (new Date(a.due) as any)
            )
          }
        >
          Due date (descending)
        </MenuItem>
      </Menu>
      {trigger}
    </>
  );
}
