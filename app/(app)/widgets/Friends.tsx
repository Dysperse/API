"use client";
import { Friend } from "@/components/Start/Friend";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Alert,
  Box,
  Icon,
  ListItemButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../fetcher";
const ContactSync = dynamic(() => import("@/components/Start/ContactSync"));

export function Friends() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const [viewAll, setViewAll] = useState(false);

  const params: any = ["user/friends", { email: session.user.email }];

  const { data, error, mutate } = useSWR(
    params,
    fetcher(params, session) as any,
    {
      refreshInterval: 2000,
    }
  );
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      {data?.friends?.length !== 0 && (
        <Typography variant="overline">Recent activity</Typography>
      )}
      <ContactSync showFriends={data?.friends?.length === 0} />
      {data ? (
        data.friends.length !== 0 && (
          <>
            <Box
              className="card"
              sx={{
                background: palette[3] + "!important",
                height: "400px",
                p: 2,
                display: "flex",
                flexDirection: "column",
                overflowY: "scroll",
              }}
            >
              {data.friends.slice(0, viewAll ? 99999 : 5).map((friend, i) => (
                <Friend
                  friend={friend.follower || friend.following}
                  mutate={() => {}}
                  key={i}
                />
              ))}
              {data?.length === 0 && (
                <Alert
                  sx={{
                    mb: -2,
                    mt: 2,
                    background: palette[3],
                    color: palette[12],
                  }}
                  severity="info"
                  icon={
                    <Icon sx={{ color: palette[12] }} className="outlined">
                      info
                    </Icon>
                  }
                >
                  Friends will appear here!
                </Alert>
              )}
              <Box>
                <ListItemButton
                  onClick={() => setViewAll((s) => !s)}
                  sx={{
                    mt: "auto",
                    background: palette[4] + "!important",
                    "&:active": {
                      background: palette[5] + "!important",
                    },
                  }}
                >
                  <Icon>group</Icon>All friends
                  <Icon sx={{ ml: "auto" }}>
                    {!viewAll ? "expand_more" : "expand_less"}
                  </Icon>
                </ListItemButton>
              </Box>
            </Box>
          </>
        )
      ) : (
        <Skeleton variant="rectangular" height="400px" />
      )}
    </motion.div>
  );
}
