import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import CardActionArea from "@mui/material/CardActionArea";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import toast from "react-hot-toast";
import SwipeableViews from "react-swipeable-views";
import * as colors from "@mui/material/colors";

// Generates a list item for shopping list / todo list
export function GenerateListItem({
  items,
  pinned,
  setItems,
  title,
  description,
  id,
}: any) {
  const [checked, setChecked] = React.useState<boolean>(false);
  const [index, setIndex] = React.useState<number>(0);
  const deleteItem = (id: any) => {
    fetch(
      "/api/lists/delete-item?" +
        new URLSearchParams({
          propertyToken: global.session.property.propertyToken,
          accessToken: global.session.property.accessToken,
          id: id,
        }),
      {
        method: "POST",
      }
    );
  };
  return checked ? null : (
    <Box sx={{ borderRadius: "15px!important", overflow: "hidden" }}>
      <SwipeableViews
        disabled={global.session.property.role === "read-only"}
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
              disabled={global.session.property.role === "read-only"}
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
                  ...(global.session.property.role !== "read-only" && {
                    transition: "none",
                    transform: "scale(.97)",
                    background: "rgba(200,200,200,.3)",
                  }),
                },
              }}
              onClick={() => {
                if (global.session.property.role !== "read-only") {
                  deleteItem(id);
                  toast.success("Task completed");
                  setChecked(true);
                }
              }}
            >
              <span
                style={{ marginLeft: "-2px" }}
                className="material-symbols-outlined"
              >
                radio_button_unchecked
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
            background: colors.red["800"],
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
          <span className="material-symbols-rounded">delete</span>
        </Box>
      </SwipeableViews>
    </Box>
  );
}
