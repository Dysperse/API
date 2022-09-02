import * as colors from "@mui/material/colors";
import { orange } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import ListItem from "@mui/material/ListItem";

export function StarButton({ styles, item, setItemData }: any) {
  return (
    <ListItem
      button
      sx={styles}
      onClick={() => {
        setItemData({
          ...item,
          lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          star: +!item.star,
        });
        fetch(
          "/api/inventory/star?" +
            new URLSearchParams({
              propertyToken:
                global.session.property[global.session.propertyIndex]
                  .propertyToken,
              accessToken:
                global.session.property[global.session.propertyIndex]
                  .accessToken,
              id: item.id.toString(),
              lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            }),
          {
            method: "POST",
          }
        );
      }}
    >
      {item.star === 1 ? (
        <span className="material-symbols-rounded">grade</span>
      ) : (
        <span className="material-symbols-outlined">grade</span>
      )}{" "}
      {item.star === 0 ? "Star" : "Unstar"}
    </ListItem>
  );
}
