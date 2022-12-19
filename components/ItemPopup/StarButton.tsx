import { ListItem } from "@mui/material";
import type { Item } from "@prisma/client";

/**
 * Description
 * @param {any} {styles
 * @param {any} item
 * @param {any} handleItemStar}
 * @returns {any}
 */
export function StarButton({
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
  return (
    <ListItem
      button
      sx={styles}
      onClick={handleItemStar}
      disabled={global.permission == "read-only"}
    >
      {item.starred ? (
        <span className="material-symbols-rounded">grade</span>
      ) : (
        <span className="material-symbols-outlined">grade</span>
      )}{" "}
      {!item.starred ? "Star" : "Unstar"}
    </ListItem>
  );
}
