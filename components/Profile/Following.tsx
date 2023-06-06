import { Puller } from "@/components/Puller";
import {
  Box,
  Button,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { Virtuoso } from "react-virtuoso";

export function Following({ data }): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="small"
        sx={{ color: "inherit" }}
        disabled={data.following.length == 0}
        onClick={() => setOpen((e) => !e)}
      >
        <b>{data.following.length}</b> following
      </Button>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        anchor="bottom"
        PaperProps={{
          sx: {
            height: "calc(100vh - 200px)",
          },
        }}
      >
        <Puller showOnDesktop />
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
                href={`/users/${follower.followingId}`}
                style={{ color: "inherit" }}
              >
                <ListItemButton sx={{ borderRadius: 0 }}>
                  <ListItemText primary={follower.followingId} />
                </ListItemButton>
              </Link>
            );
          }}
        />
      </SwipeableDrawer>
    </>
  );
}
