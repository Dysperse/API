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

  const [currentFilter, setCurrentFilter] = useState("priority");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (sortingFunction, filter) => {
    setColumnTasks(originalTasks.sort(sortingFunction));
    handleClose();
    handleParentClose();
    setCurrentFilter(filter);
  };

  const trigger = cloneElement(children, {
    onClick: handleClick,
    selected: Boolean(anchorEl),
  });

  return (
    <>
      <Menu
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
            handleMenuClick((a, b) => (a.pinned ? -1 : 1), "priority")
          }
          selected={currentFilter === "priority"}
        >
          Priority
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleMenuClick((a, b) => a.name.localeCompare(b.name), "a-z")
          }
          selected={currentFilter === "a-z"}
        >
          A-Z
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleMenuClick((a, b) => b.name.localeCompare(a.name), "z-a")
          }
          selected={currentFilter === "z-a"}
        >
          Z-A
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleMenuClick((a, b) => b.createdAt - a.createdAt, "new-old")
          }
          selected={currentFilter === "new-old"}
        >
          Newest to oldest
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleMenuClick((a, b) => a.createdAt - b.createdAt, "old-new")
          }
          selected={currentFilter === "old-new"}
        >
          Oldest to newest
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleMenuClick(
              (a, b) => (new Date(a.due) as any) - (new Date(b.due) as any),
              "due-asc"
            )
          }
          selected={currentFilter === "due-asc"}
        >
          Due date (ascending)
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleMenuClick(
              (a, b) => (new Date(b.due) as any) - (new Date(a.due) as any),
              "due-desc"
            )
          }
          selected={currentFilter === "due-desc"}
        >
          Due date (descending)
        </MenuItem>
      </Menu>
      {trigger}
    </>
  );
}
