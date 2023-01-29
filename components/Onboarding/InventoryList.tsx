import dayjs from "dayjs";
import React from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook } from "../../hooks/useApi";

import { Box, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { colors } from "../../lib/colors";
import { toastStyles } from "../../lib/useCustomTheme";

/**
 * Inventory list
 * @param {any} {data}:{data:Array<any>}
 * @returns {any}
 */
export function InventoryList({ data }: { data: Array<any> }) {
  const [inventory, setInventory] = React.useState<any>([]);
  return (
    <Box>
      {data.map((item) => (
        <ListItem
          key={item.name.toString()}
          button
          sx={{
            borderRadius: 5,
            transition: "none",
            ...(inventory.includes(item.name) && {
              pointerEvents: "none",
            }),
          }}
          onClick={() => {
            setInventory([...inventory, item.name]);

            fetchApiWithoutHook("property/inventory/create", {
              name: item.name,
              qty: "1",
              category: JSON.stringify([]),
              lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              room: item.room,
            }).then(() => {
              toast.success("Added to inventory!", toastStyles);
            });
          }}
        >
          <ListItemIcon>
            <span
              className="material-symbols-rounded"
              style={{
                ...(inventory.includes(item.name) && {
                  color: colors.green["A700"],
                }),
              }}
            >
              {inventory.includes(item.name) ? "check" : item.icon}
            </span>
          </ListItemIcon>
          <ListItemText
            sx={{
              ...(inventory.includes(item.name) && {
                color: colors.green["A700"],
              }),
            }}
            primary={item.name}
          />
        </ListItem>
      ))}
    </Box>
  );
}
