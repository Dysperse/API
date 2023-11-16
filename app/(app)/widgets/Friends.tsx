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
import dynamic from "next/dynamic";
import useSWR from "swr";
import { fetcher } from "../fetcher";
const ContactSync = dynamic(() => import("@/components/Start/ContactSync"));

export function Friends({ sectionHeaderStyles }) {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const params: any = ["user/friends", { email: session.user.email }];

  const { data, error, mutate } = useSWR(
    params,
    fetcher(params, session) as any,
    {
      refreshInterval: 2000,
    }
  );
  return (
    <>
      {data?.friends?.length !== 0 && (
        <Typography sx={sectionHeaderStyles}>Recent activity</Typography>
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
              <ListItemButton
                sx={{
                  mt: "auto",
                  background: palette[4] + "!important",
                  "&:active": {
                    background: palette[5] + "!important",
                  },
                }}
              >
                <Icon>group</Icon>All friends
                <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
              </ListItemButton>
            </Box>
          </>
        )
      ) : (
        <Skeleton variant="rectangular" height="400px" />
      )}
    </>
  );
}
