import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import dayjs from "dayjs";
import toast from "react-hot-toast";

export function DeleteButton({
  handleItemDelete,
  styles,
  setDeleted,
  setDrawerState,
}: any): JSX.Element {
  return (
    <ListItem button sx={styles} onClick={handleItemDelete}>
      <span className="material-symbols-rounded">delete</span>
      Delete
    </ListItem>
  );
}
