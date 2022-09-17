import ListItem from "@mui/material/ListItem";

/**
 * Description
 * @param {any} {styles
 * @param {any} item
 * @param {any} handleItemStar}
 * @returns {any}
 */
export function StarButton({ styles, item, handleItemStar }: any) {
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
