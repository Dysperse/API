import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import dayjs from "dayjs";
import ItemPopup from "../../components/ItemPopup";

export function RecentItem(props: any) {
  return (
    <ItemPopup data={props.data}>
      <ListItemButton sx={{ py: "4px" }}>
        <ListItemText
          primary={props.data.title}
          secondary={dayjs(props.data.lastUpdated).fromNow()}
        />
      </ListItemButton>
    </ItemPopup>
  );
}
