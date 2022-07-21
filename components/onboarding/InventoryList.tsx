import * as React from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

export function InventoryList({
  data,
}: {
  data: Array<{ name: string; icon: string }>;
}) {
  const [inventory, setInventory] = React.useState<any>([]);
  return (
    <Box>
      {data.map((item) => (
        <ListItem
          key={item.name}
          button
          sx={{
            borderRadius: 5,
            transition: "none",
            ...(inventory.includes(item.name) && {
              pointerEvents: "none",
            }),
          }}
          onClick={() => setInventory([...inventory, item.name])}
        >
          <ListItemIcon>
            <span
              className="material-symbols-rounded"
              style={{
                ...(inventory.includes(item.name) && {
                  color: "green",
                }),
              }}
            >
              {inventory.includes(item.name) ? "check" : item.icon}
            </span>
          </ListItemIcon>
          <ListItemText
            sx={{
              ...(inventory.includes(item.name) && {
                color: "green",
              }),
            }}
            primary={item.name}
          />
        </ListItem>
      ))}
    </Box>
  );
}
