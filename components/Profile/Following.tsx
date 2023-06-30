import { Puller } from "@/components/Puller";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  CardActionArea,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { Virtuoso } from "react-virtuoso";

export function Following({ styles, data }): JSX.Element {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(data.color, isDark);

  return (
    <>
      <CardActionArea
        sx={styles}
        disabled={data.following.length == 0}
        onClick={() => setOpen((e) => !e)}
      >
        <Typography variant="h6">{data.following.length}</Typography>
        following
      </CardActionArea>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        BackdropProps={{
          sx: {
            background: addHslAlpha(palette[1], 0.5) + " !important",
          },
        }}
        PaperProps={{
          sx: {
            background: palette[1],
            height: "calc(100vh - 200px)",
          },
        }}
      >
        <Puller
          showOnDesktop
          sx={{
            "& .puller": {
              background: palette[4],
            },
          }}
        />
        <Box sx={{ p: 2, pt: 0 }}>
          <Typography variant="h6">
            {data.following.length} following
          </Typography>
        </Box>
        <Virtuoso
          style={{
            height: "100%",
          }}
          totalCount={data.following.length}
          itemContent={(i) => {
            const follower = data.following[i];
            return (
              <Link
                href={`/users/${follower.following.email}`}
                style={{ color: "inherit" }}
              >
                <ListItemButton sx={{ borderRadius: 0 }}>
                  <ListItemText
                    primary={follower.following.name}
                    secondary={follower.following.email}
                  />
                </ListItemButton>
              </Link>
            );
          }}
        />
      </SwipeableDrawer>
    </>
  );
}
