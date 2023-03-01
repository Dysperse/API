import { Icon, ListItemButton } from "@mui/material";
import type { Item } from "@prisma/client";
import { useAccountStorage } from "../../pages/_app";

/**
 * Description
 * @param {any} {styles
 * @param {any} item
 * @param {any} handleItemStar}
 * @returns {any}
 */
export default function StarButton({
  styles,
  item,
  handleItemStar,
}: {
  styles: {
    [key: string]:
      | string
      | number
      | boolean
      | {
          [key: string]: string | number | boolean;
        };
  };
  item: Item;
  handleItemStar: () => void;
}): JSX.Element {
  const storage = useAccountStorage();

  return (
    <ListItemButton
      sx={styles}
      onClick={handleItemStar}
      disabled={
        global.permission === "read-only" || storage?.isReached === true
      }
    >
      <Icon className={item.starred ? "" : "outlined"}>grade</Icon>
      {!item.starred ? "Star" : "Unstar"}
    </ListItemButton>
  );
}
