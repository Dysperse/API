import ListItem from "@mui/material/ListItem";
import type { Item } from "../../types/item";
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
  styles: any;
  item: Item;
  handleItemStar: () => void;
}) {
  return (
    <ListItem button sx={styles} onClick={handleItemStar}>
      {item.starred ? (
        <span className="material-symbols-rounded">grade</span>
      ) : (
        <span className="material-symbols-outlined">grade</span>
      )}{" "}
      {!item.starred ? "Star" : "Unstar"}
    </ListItem>
  );
}
