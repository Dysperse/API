import Button from "@mui/material/Button";
import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import toast from "react-hot-toast";

export function DeleteButton({
  item,
  setDeleted,
  setDrawerState,
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
                propertyToken: global.session.property.propertyToken,
                accessToken: global.session.property.accessToken,
                id: item.id.toString(),
                lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              }),
            {
              method: "POST",
            }
          );
          toast.success((t) => (
            <span>
              Item moved to trash
              <Button
                size="small"
                sx={{
                  ml: 2,
                  borderRadius: 999,
                  p: "0!important",
                  width: "auto",
                  minWidth: "auto",
                }}
                onClick={() => {
                  toast.dismiss(t.id);
                  fetch(
                    "/api/inventory/restore?" +
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
                  setDeleted(false);
                  setDrawerState(true);
                }}
              >
                Undo
              </Button>
            </span>
          ));
          setDeleted(true);
          setDrawerState(false);
        }}
      >
        <span className="material-symbols-rounded">delete</span>
      </IconButton>
    </Tooltip>
  );
}
