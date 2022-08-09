import Checkbox from "@mui/material/Checkbox";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

// Generates a list item for shopping list / todo list
export function GenerateListItem({ items, setItems, title, id }: any) {
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
    <ListItemButton
      disableRipple
      key={id.toString()}
      sx={{
        py: 0,
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
      dense
      onClick={() => {
        if (global.session.property.role !== "read-only") {
          deleteItem(id);
          setChecked(true);
        }
      }}
    >
      <ListItemIcon>
        <span
          style={{ marginLeft: "-2px" }}
          className="material-symbols-outlined"
        >
          {checked ? "task_alt" : "radio_button_unchecked"}
        </span>
      </ListItemIcon>
      <ListItemText sx={{ my: 1.4 }} primary={title} />
    </ListItemButton>
  );
}
