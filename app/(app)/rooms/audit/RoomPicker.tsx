"use client";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  CircularProgress,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { cloneElement, useEffect, useState } from "react";
import useSWR from "swr";

export function RoomPicker({ room, setRoom, children }) {
  const [open, setOpen] = useState(false);
  const { data, error } = useSWR(["space/inventory/rooms"]);

  const { session } = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  const trigger = cloneElement(children, { onClick: () => setOpen(true) });

  useEffect(() => {
    if (!room && !open) {
      setOpen(true);
    }
  }, [room, open]);

  return (
    <>
      {trigger}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            background: addHslAlpha(palette[3], 0.8),
            m: 3,
            mx: { xs: 3, sm: "auto" },
            borderRadius: 5,
          },
        }}
      >
        <Typography variant="h3" className="font-heading" sx={{ p: 3, pb: 1 }}>
          Select a room
        </Typography>
        {data ? (
          data.map((_room) => (
            <ListItemButton
              key={_room.id}
              selected={room?.id === _room?.id}
              onClick={() => {
                setRoom(_room);
                setOpen(false);
              }}
            >
              <img
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${_room.emoji}.png`}
                alt="Emoji"
                width={30}
                height={30}
              />
              <ListItemText primary={_room.name} />
            </ListItemButton>
          ))
        ) : (
          <CircularProgress />
        )}
      </SwipeableDrawer>
    </>
  );
}
