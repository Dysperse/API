import ListItem from "@mui/material/ListItem";

export function DeleteButton({ handleItemDelete, styles }: any): JSX.Element {
  return (
    <ListItem button sx={styles} onClick={handleItemDelete}>
      <span className="material-symbols-rounded">delete</span>
      Delete
    </ListItem>
  );
}
