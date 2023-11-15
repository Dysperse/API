"use client";
import { Friend } from "@/components/Start/Friend";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Alert, Box, Icon, ListItemButton, Skeleton } from "@mui/material";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { fetcher } from "../fetcher";
const ContactSync = dynamic(() => import("@/components/Start/ContactSync"));

export function Friends() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const params: any = ["user/friends", { email: session.user.email }];

  const { data, error, mutate } = useSWR(
    params,
    fetcher(params, session) as any,
    {
      refreshInterval: 5000,
    }
  );
  return data ? (
    <>
      <Box
        sx={{
          background: palette[3],
          borderRadius: 5,
          height: "400px",
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {data.friends.slice(0, 5).map((friend, i) => (
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
        <ListItemButton sx={{ mt: "auto", background: palette[4] }}>
          <Icon>group</Icon>All friends
          <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
        </ListItemButton>
      </Box>
      <ContactSync showFriends={data?.friends?.length === 0} />
    </>
  ) : (
    <Skeleton variant="rectangular" height="400px" />
  );
}
