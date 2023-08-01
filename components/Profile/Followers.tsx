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
import { useRouter } from "next/router";
import { useState } from "react";
import { Virtuoso } from "react-virtuoso";

export function Followers({ styles, data }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(data.color, isDark);

  return (
    <>
      <CardActionArea
        sx={styles}
        disabled={data.followers.length == 0}
        onClick={() => setOpen((e) => !e)}
      >
        <Typography variant="h6">{data.followers.length}</Typography>
        follower
        {data.followers.length !== 1 && "s"}
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
            {data.followers.length} followers
          </Typography>
        </Box>
        <Virtuoso
          style={{
            height: "100%",
          }}
          totalCount={data.followers.length}
          itemContent={(i) => {
            const follower = data.followers[i];
            return (
              <ListItemButton
                sx={{ borderRadius: 0 }}
                onClick={() => {
                  router.push(
                    `/users/${
                      follower.follower.username || follower.follower.email
                    }`
                  );
                }}
              >
                <ListItemText
                  primary={follower.follower.name}
                  secondary={
                    (follower.follower.username ? "@" : "") +
                    (follower.follower.username || follower.follower.email)
                  }
                />
              </ListItemButton>
            );
          }}
        />
      </SwipeableDrawer>
    </>
  );
}
