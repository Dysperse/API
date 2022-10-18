import Box from "@mui/material/Box";
import CardActionArea from "@mui/material/CardActionArea";
import { colors } from "../../lib/colors";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import React from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import type { ListItem as Item } from "@prisma/client";

/**
 * @description Generates a list item for shopping list / todo list
 * @param items Items
 * @returns JSX.Element
 */
export function GenerateListItem({
  items,
  setItems,
  itemData,
}: {
  items: Item[];
  setItems: (items: Item[]) => void;
  itemData: Item;
}): JSX.Element {
  const [index, setIndex] = React.useState<number>(1);

  /**
   * Handles an item delete button click trigger
   * @param {boolean} completed
   * @param {any} id
   * @returns {any}
   */
  const deleteItem = (completed: boolean, id: string | number) => {
    fetchApiWithoutHook("property/lists/toggleCompleted", {
      id: id.toString(),
      completed: completed === true ? "false" : "true",
    });
  };

  /**
   * @description Copies text to clipboard
   */
  const copyToClipboard = (e) => {
    navigator.clipboard.writeText(e.target.innerText);
    toast.success("Copied to clipboard");
  };

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  /**
   * Overrides default context menu and opens the custom one
   * @param {React.MouseEvent} event
   * @returns {any}
   */
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setContextMenu(null);
  };

  return (
    <Box sx={{ borderRadius: "15px!important", overflow: "hidden" }}>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem>
          <span
            className="material-symbols-rounded"
            style={{ marginRight: "20px" }}
          >
            move_to_inbox
          </span>
          Add to inventory
        </MenuItem>
        <MenuItem>
          <span
            className="material-symbols-rounded"
            style={{ marginRight: "20px" }}
          >
            delete
          </span>
          Delete
        </MenuItem>
      </Menu>
      <ListItem
        onContextMenu={handleContextMenu}
        key={Math.random().toString()}
        sx={{
          py: 0,
        }}
        dense
      >
        <ListItemIcon sx={{ ml: -1.3 }}>
          <IconButton
            disabled={global.property.role === "read-only"}
            sx={{
              transition: "transform .2s",
            }}
            onClick={() => {
              if (global.property.role !== "read-only") {
                deleteItem(
                  itemData.completed,
                  parseInt(itemData.id.toString(), 10)
                );
                setItems(
                  items.map((item: Item) => {
                    if (item.id === itemData.id) {
                      item.completed = !item.completed;
                    }
                    return item;
                  })
                );
              }
            }}
          >
            <span className="material-symbols-outlined">
              {itemData.completed ? "task_alt" : "radio_button_unchecked"}
            </span>
          </IconButton>
        </ListItemIcon>
        <ListItemText
          sx={{ ml: -1 }}
          primary={
            <CardActionArea
              sx={{
                borderRadius: 3,
                p: 1,
                py: 0.5,
                ml: -1,
                transition: "none!important",
                "& *:not(.MuiTouchRipple-child)": {
                  background: "transparent!important",
                },
              }}
              onClick={copyToClipboard}
            >
              {itemData.name}
            </CardActionArea>
          }
          secondary={
            itemData.details ? (
              <CardActionArea
                sx={{
                  borderRadius: 3,
                  p: 1,
                  py: 0.5,
                  ml: -1,
                  transition: "none!important",
                  "& *:not(.MuiTouchRipple-child)": {
                    background: "transparent!important",
                  },
                }}
                onClick={copyToClipboard}
              >
                {itemData.details}
              </CardActionArea>
            ) : null
          }
        />
        {itemData.pinned && (
          <ListItemIcon sx={{ ml: -1 }}>
            <IconButton
              disableRipple
              sx={{
                borderRadius: 3,
                ml: 5,
              }}
            >
              <span
                className="material-symbols-rounded"
                style={{ transform: "rotate(45deg)" }}
              >
                push_pin
              </span>
            </IconButton>
          </ListItemIcon>
        )}
      </ListItem>
    </Box>
  );
}
