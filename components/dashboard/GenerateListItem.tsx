import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

export function GenerateListItem({ title }: any) {
  const [checked, setChecked] = React.useState(false);

  return (
    <ListItem
      key={Math.random().toString()}
      sx={{ py: 0, m: 0 }}
      disablePadding
    >
      <ListItemButton
        sx={{ py: 0, borderRadius: 15 }}
        onClick={() => setChecked(!checked)}
        dense
      >
        <ListItemIcon>
          <Checkbox edge="start" checked={checked} />
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
}
