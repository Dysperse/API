import Box from "@mui/material/Box";
import CardActionArea from "@mui/material/CardActionArea";
import { colors } from "../../lib/colors";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import toast from "react-hot-toast";
import SwipeableViews from "react-swipeable-views";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import type { Item } from "../../types/list";

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

  return (
    <Box sx={{ borderRadius: "15px!important", overflow: "hidden" }}>
      <SwipeableViews
        disabled={global.property.role === "read-only"}
        enableMouseEvents
        index={index}
        slideStyle={{
          borderRadius: "15px!important",
        }}
        onChangeIndex={(changedIndex) => {
          setIndex(changedIndex);
          setTimeout(() => {
            setIndex(1);
          }, 200);
        }}
      >
        <Box
          sx={{
            background: colors[itemData.completed ? "red" : "blue"]["800"],
            width: "100%",
            height: "100%",
            color: "#fff",
            borderRadius: 3,
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            px: 2,
            mr: 1,
          }}
        >
          <span className="material-symbols-rounded">
            {itemData.completed ? "delete" : "check"}
          </span>
        </Box>
        <ListItem
          key={Math.random().toString()}
          sx={{
            py: 0,
          }}
          dense
        >
          <ListItemIcon sx={{ ml: -1 }}>
            <IconButton
              disableRipple
              disabled={global.property.role === "read-only"}
              sx={{
                borderRadius: 3,
                transition: "transform .2s",
                "&:hover": {
                  background: global.user.darkMode
                    ? "hsl(240, 11%, 20%)"
                    : "rgba(200,200,200,.3)",
                },
                "&:active": {
                  transition: "none",
                  transform: "scale(.97)",
                  background: global.user.darkMode
                    ? "hsl(240, 11%, 20%)"
                    : "rgba(200,200,200,.3)",
                  ...(global.property.role !== "read-only" && {
                    transition: "none",
                    transform: "scale(.97)",
                    background: "rgba(200,200,200,.3)",
                  }),
                },
              }}
              onClick={() => {
                if (global.property.role !== "read-only") {
                  deleteItem(
                    itemData.completed,
                    parseInt(itemData.id.toString(), 10)
                  );
                  setItems(
                    items.map((item: any) => {
                      if (item.id === itemData.id) {
                        item.completed = !item.completed;
                      }
                      return item;
                    })
                  );
                }
              }}
            >
              <span
                style={{ marginLeft: "-2px" }}
                className="material-symbols-outlined"
              >
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
                  ml: -1,
                  transition: "none!important",
                  "& *:not(.MuiTouchRipple-child)": {
                    background: "transparent!important",
                  },
                }}
                onClick={(e: any) => {
                  navigator.clipboard.writeText(e.target.innerText);
                  toast.success("Copied to clipboard");
                }}
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
                    ml: -1,
                    mt: -1,
                    transition: "none!important",
                    "& *:not(.MuiTouchRipple-child)": {
                      background: "transparent!important",
                    },
                  }}
                  onClick={(e: any) => {
                    navigator.clipboard.writeText(e.target.innerText);
                    toast.success("Copied to clipboard");
                  }}
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
      </SwipeableViews>
    </Box>
  );
}
