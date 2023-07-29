import { useSession } from "@/lib/client/session";
import { useBackButton } from "@/lib/client/useBackButton";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Icon,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import type { Item } from "@prisma/client";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

/**
 * Search bar
 */
function SearchBar({
  setItems,
  data,
}: {
  setItems: (items: Item[]) => void;
  data: Item[];
}) {
  /**
   * Handles blur event
   */
  const handleBlurEvent = (e: any) => {
    const target = e.target as HTMLInputElement;
    if (e.code === "Enter") target.blur();
    if (e.code === "Escape") {
      target.value = "";
      target.blur();
    }
  };
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <TextField
      placeholder="Search..."
      id="outlined-size-small"
      onKeyDown={handleBlurEvent}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
          setItems(data);
          return;
        }
        setItems([]);
        setTimeout(() => {
          setItems(
            data.filter(
              (item) =>
                item.name.toLowerCase().includes(value.toLowerCase()) ||
                item.quantity.toLowerCase().includes(value.toLowerCase()) ||
                JSON.parse(item.category)
                  .join(",")
                  .toLowerCase()
                  .includes(value.toLowerCase())
            )
          );
        }, 50);
      }}
      size="small"
      variant="standard"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Icon>search</Icon>
          </InputAdornment>
        ),
        disableUnderline: true,
        sx: {
          border: "0!important",
          mr: 0.5,
          px: 2,
          py: 1,
          borderRadius: 9,
          width: "100%",
          background: palette[3],
          "&:focus-within": {
            background: palette[4],
          },
        },
      }}
    />
  );
}

/**
 * Toolbar for a room
 * @param {any} {alias
 * @param {any} room
 * @param {any} items
 * @param {any} setItems
 * @param {any} data}
 * @returns {any}
 */
export function Toolbar({
  items,
  setItems,
  data,
}: {
  items: Item[];
  setItems: (items: Item[]) => void;
  data: Item[];
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /**
   * Handles the click for the filter menu
   * @param {React.MouseEvent<HTMLButtonElement>} event
   * @returns {any}
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setAnchorEl(null);
  };
  useBackButton(handleClose);

  const ref: any = React.useRef();
  useHotkeys(
    "s",
    (e) => {
      e.preventDefault();
      ref.current?.click();
    },
    [ref]
  );
  const session = useSession();

  const handleSort = (sortFunction) => {
    setItems([]);
    setTimeout(() => {
      setItems(sortFunction(items));
      handleClose();
    }, 50);
  };

  return (
    <Box
      sx={{
        textAlign: "right",
        my: { xs: 2, sm: 3 },
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
      }}
    >
      <SearchBar setItems={setItems} data={data} />
      <Button
        disableRipple
        variant="contained"
        ref={ref}
        sx={{
          borderRadius: 10,
          ml: 1,
          py: 1.3,
          px: 1,
          gap: 1.5,
          verticalAlign: "middle",
        }}
        onClick={handleClick}
      >
        <Icon className="outlined">filter_list</Icon>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() =>
            handleSort((items) =>
              items.sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
            )
          }
        >
          A-Z
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleSort((items) =>
              items
                .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
                .reverse()
            )
          }
        >
          Z-A
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleSort((items) =>
              items.sort((itemA, itemB) =>
                itemA.quantity.localeCompare(itemB.quantity)
              )
            )
          }
        >
          Quantity
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleSort((items) =>
              items.sort(
                (itemA, itemB) => itemB.lastModified - itemA.lastModified
              )
            )
          }
        >
          Newest to oldest
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleSort((items) =>
              items.sort(
                (itemA, itemB) => itemA.lastModified - itemB.lastModified
              )
            )
          }
        >
          Oldest to newest
        </MenuItem>
      </Menu>
    </Box>
  );
}
