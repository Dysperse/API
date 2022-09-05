import * as colors from "@mui/material/colors";
import { orange } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import ListItem from "@mui/material/ListItem";

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
