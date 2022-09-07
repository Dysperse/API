import Chip from "@mui/material/Chip";
import { orange } from "@mui/material/colors";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";

export function SuggestionChip({ room, item }: any) {
  const [hide, setHide] = useState<boolean>(false);
  return (
    <>
      {!hide && (
        <Chip
          onClick={() => {
            setHide(true);
            fetch(
              "/api/inventory/create?" +
                new URLSearchParams({
                  propertyToken: global.property.propertyId,
                  accessToken: global.property.accessToken,
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
            borderRadius: 3,
            transition: "transform .2s",
            boxShadow: "none !important",
            color: global.theme === "dark" ? orange[100] : orange[900],
            background:
              global.theme === "dark" ? "hsl(240, 11%, 30%)" : orange[100],
            "&:hover": {
              background:
                global.theme === "dark" ? "hsl(240, 11%, 35%)" : orange[200],
            },
            "&:active": {
              transform: "scale(.95)",
              transition: "none",
            },
          }}
          label={item}
        />
      )}
    </>
  );
}
