import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

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
  return (
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
          sx={{
            borderRadius: 3,
            transition: "transform .2s",
            "&:active": {
              transition: "none",
              transform: "scale(.97)",
              background: "rgba(200,200,200,.3)",
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
              setChecked(true);
            }
          }}
        >
          <span
            style={{ marginLeft: "-2px" }}
            className="material-symbols-outlined"
          >
            {checked ? "task_alt" : "radio_button_unchecked"}
          </span>
        </IconButton>
      </ListItemIcon>
      <ListItemText sx={{ my: 1.4 }} primary={title} secondary={description} />
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
  );
}
