import Box from "@mui/material/Box";
import CardActionArea from "@mui/material/CardActionArea";
import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import toast from "react-hot-toast";
import SwipeableViews from "react-swipeable-views";

// Generates a list item for shopping list / todo list
export function GenerateListItem({
  items,
  completed,
  pinned,
  setItems,
  title,
  description,
  id,
}: any) {
  const [index, setIndex] = React.useState<number>(0);
  const deleteItem = (completed: boolean, id: any) => {
    fetch(
      "/api/property/lists/toggleCompleted?" +
        new URLSearchParams({
          propertyToken: global.property.id,
          accessToken: global.property.accessToken,
          id: id,
          completed: completed ? "false" : "true",
        }),
      {
        method: "POST",
      }
    );
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
            setIndex(0);
          }, 200);
        }}
      >
        <ListItem
          key={id.toString()}
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
                  background:
                    global.theme == "dark"
                      ? "hsl(240, 11%, 20%)"
                      : "rgba(200,200,200,.3)",
                },
                "&:active": {
                  transition: "none",
                  transform: "scale(.97)",
                  background:
                    global.theme == "dark"
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
                  deleteItem(completed, id);
                  toast.success("Task completed");
                  // Set completed to true from items array
                  setItems(
                    items.map((item: any) => {
                      if (item.id === id) {
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
                {completed ? "task_alt" : "radio_button_unchecked"}
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
                {title}
              </CardActionArea>
            }
            secondary={
              description ? (
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
                  {description}
                </CardActionArea>
              ) : null
            }
          />
          {pinned === "true" && (
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
        <Box
          sx={{
            background: colors[completed ? "red" : "blue"]["800"],
            width: "100%",
            height: "100%",
            color: "#fff",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            px: 2,
            mr: 1,
          }}
        >
          <span className="material-symbols-rounded">
            {completed ? "delete" : "check"}
          </span>
        </Box>
      </SwipeableViews>
    </Box>
  );
}
