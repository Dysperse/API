import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import * as dayjs from "dayjs";
import ItemPopup from "../ItemPopup";

export function RecentItem(props: any) {
  const capitalizeFirstLetter = (
    [first, ...rest],
    locale = navigator.language
  ) => first.toLocaleUpperCase(locale) + rest.join("");

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
