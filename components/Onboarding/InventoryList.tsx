import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import toast from "react-hot-toast";
import { useRawApi } from "../../lib/client/useApi";
import { toastStyles } from "../../lib/client/useTheme";
import { colors } from "../../lib/colors";

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
        <ListItemButton
          key={item.name.toString()}
          sx={{
            borderRadius: 5,
            transition: "none",
            ...(inventory.includes(item.name) && {
              pointerEvents: "none",
            }),
          }}
          onClick={() => {
            setInventory([...inventory, item.name]);
            useRawApi("property/inventory/items/create", {
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
        </ListItemButton>
      ))}
    </Box>
  );
}
