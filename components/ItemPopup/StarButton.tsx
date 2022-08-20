import * as colors from "@mui/material/colors";
import { orange } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";

export function StarButton({ item, setItemData }: any) {
  return (
    <Tooltip title={item.star === 0 ? "Star" : "Unstar"}>
      <IconButton
        disableRipple
        size="large"
        edge="end"
        color="inherit"
        aria-label="menu"
        sx={{
          transition: "none",
          mr: 1,
          color: global.theme === "dark" ? "hsl(240, 11%, 90%)" : "#606060",
          "&:hover": {
            background: "rgba(200,200,200,.3)",
            color: global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
          },
          "&:focus-within": {
            background:
              (global.theme === "dark"
                ? colors[themeColor]["900"]
                : colors[themeColor]["100"]) + "!important",
            color: global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
          },
          ...(parseInt(item.star, 10) === 1 && {
            "&:hover": {
              background: global.theme === "dark" ? orange[900] : orange[50],
              color: "#000",
            },
            "&:active": {
              boxShadow: "none!important",
            },
            "&:focus-within": {
              background:
                orange[global.theme === "dark" ? 900 : 100] + "!important",
              color: "#000",
            },
          }),
        }}
        onClick={() => {
          setItemData({
            ...item,
            lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            star: +!item.star,
          });
          fetch(
            "/api/inventory/star?" +
              new URLSearchParams({
                propertyToken: global.session.property.propertyToken,
                accessToken: global.session.property.accessToken,
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
          <span
            className="material-symbols-rounded"
            style={{
              color: global.theme === "dark" ? orange[200] : orange[600],
            }}
          >
            grade
          </span>
        ) : (
          <span className="material-symbols-outlined">grade</span>
        )}
      </IconButton>
    </Tooltip>
  );
}
