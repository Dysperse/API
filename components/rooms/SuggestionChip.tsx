import Chip from "@mui/material/Chip";
import { orange } from "@mui/material/colors";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";

export function SuggestionChip({ room, item, key }: any) {
  const [hide, setHide] = useState<boolean>(false);
  return (
    <>
      {!hide && (
        <Chip
          key={key}
          onClick={() => {
            setHide(true);
            fetch(
              "/api/inventory/create?" +
                new URLSearchParams({
                  token:
                    global.session.user.SyncToken || global.session.accessToken,
                  name: item,
                  qty: "1",
                  category: "[]",
                  room: room,
                  lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                }),
              {
                method: "POST",
              }
            )
              .then((res) => res.json())
              .then((res) => {
                toast.success("Created item!");
                global.setUpdateBanner(room);
              });
          }}
          sx={{
            mr: 1,
            px: 1,
            fontWeight: "600",
            transition: "background .05s !important",
            borderRadius: 3,
            boxShadow: "0!important",
            color: global.theme === "dark" ? orange[100] : orange[900],
            background:
              global.theme === "dark" ? "hsl(240, 11%, 30%)" : orange[100],
            "&:hover": {
              background:
                global.theme === "dark" ? "hsl(240, 11%, 35%)" : orange[200],
            },
            "&:active": {
              background:
                global.theme === "dark" ? "hsl(240, 11%, 40%)" : orange[300],
            },
          }}
          label={item}
        />
      )}
    </>
  );
}
