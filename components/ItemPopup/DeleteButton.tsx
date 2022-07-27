import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";

export function DeleteButton({
  id,
  deleted,
  setDeleted,
  setDrawerState,
  setOpen,
}: any): JSX.Element {
  return (
    <Tooltip title="Move to trash">
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
        }}
        onClick={() => {
          fetch(
            "/api/inventory/trash?" +
              new URLSearchParams({
                token:
                  global.session.user.SyncToken || global.session.accessToken,
                id: id.toString(),
                lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              }),
            {
              method: "POST",
            }
          );
          setOpen(true);
          setDeleted(true);
          setDrawerState(false);
        }}
      >
        <span className="material-symbols-rounded">delete</span>
      </IconButton>
    </Tooltip>
  );
}
