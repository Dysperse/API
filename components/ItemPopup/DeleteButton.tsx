/**
 * Description
 * @param {any} {handleItemDelete
 * @param {any} styles}
 * @returns {any}
 */
import { Icon, ListItemButton } from "@mui/material";

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
    <ListItemButton
      sx={styles}
      onClick={handleItemDelete}
      disabled={global.permission === "read-only"}
    >
      <Icon>delete</Icon>
      Delete
    </ListItemButton>
  );
}
