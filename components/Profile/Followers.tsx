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

export function Followers({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="small"
        sx={{ color: "inherit" }}
        disabled={data.followers.length == 0}
        onClick={() => setOpen((e) => !e)}
      >
        <b>{data.followers.length}</b> follower
        {data.followers.length !== 1 && "s"}
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
              <Link
                href={`/users/${follower.followerId}`}
                style={{ color: "inherit" }}
              >
                <ListItemButton sx={{ borderRadius: 0 }}>
                  <ListItemText primary={follower.followerId} />
                </ListItemButton>
              </Link>
            );
          }}
        />
      </SwipeableDrawer>
    </>
  );
}
