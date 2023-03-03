/**
 * Description
 * @param {any} {handleItemDelete
 * @param {any} styles}
 * @returns {any}
 */
import { Icon, ListItemButton } from "@mui/material";
import { useSession } from "../../pages/_app";

export default function DeleteButton({
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
  const session = useSession();
  return (
    <ListItemButton
      sx={styles}
      onClick={handleItemDelete}
      disabled={session?.permission === "read-only"}
    >
      <Icon>delete</Icon>
      Delete
    </ListItemButton>
  );
}
