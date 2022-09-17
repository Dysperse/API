import ListItem from "@mui/material/ListItem";

/**
 * Description
 * @param {any} {handleItemDelete
 * @param {any} styles}
 * @returns {any}
 */
export function DeleteButton({ handleItemDelete, styles }: any): JSX.Element {
  return (
    <ListItem button sx={styles} onClick={handleItemDelete}>
      <span className="material-symbols-rounded">delete</span>
      Delete
    </ListItem>
  );
}
