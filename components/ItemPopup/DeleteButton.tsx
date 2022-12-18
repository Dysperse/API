/**
 * Description
 * @param {any} {handleItemDelete
 * @param {any} styles}
 * @returns {any}
 */
import { ListItem } from "@mui/material";

export function DeleteButton({
  handleItemDelete,
  styles,
}: {
  handleItemDelete: () => void;
  styles: {
    [key: string]:
      | string
      | number
      | boolean
      | {
          [key: string]: string | number | boolean;
        };
  };
}): JSX.Element {
  return (
    <ListItem button sx={styles} onClick={handleItemDelete}>
      <span className="material-symbols-rounded">delete</span>
      Delete
    </ListItem>
  );
}
