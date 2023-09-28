import { containerRef } from "@/components/Layout";
import { Navbar } from "@/components/Navbar";
import { AvailabilityTrigger } from "@/components/Start/AvailabilityTrigger";
import { Friend } from "@/components/Start/Friend";
import { SearchFriend } from "@/components/Start/SearchFriend";
import { StatusSelector } from "@/components/Start/StatusSelector";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Toolbar, Typography, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";
import { HeadingComponent } from "../components/Start/HeadingComponent";
const ContactSync = dynamic(() => import("@/components/Start/ContactSync"));

export default function Home() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const { data, mutate } = useSWR([
    "user/profile/friends",
    {
      email: session.user.email,
      date: dayjs().startOf("day").toISOString(),
    },
  ]);

  const { data: profileData } = useSWR([
    "user/profile",
    {
      email: session.user.email,
    },
  ]);

  const sortedFriends = useMemo(() => {
    return (
      data?.friends &&
      data.friends.sort(({ following: friend }) => {
        if (
          friend?.Status?.status &&
          dayjs(friend?.Status?.until).isAfter(dayjs())
        )
          return -1;
        else return 1;
      })
    );
  }, [data]);

  return (
    <Box sx={{ mt: "env(titlebar-area-height)" }}>
      <Navbar
        showLogo={isMobile}
        showRightContent={true}
        hideSettings={!isMobile}
      />
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }}>
        <Box
          sx={{
            pt: { xs: 7, sm: 15 },
          }}
        >
          <Box
            sx={{
              mb: { xs: 2, sm: 2 },
              px: { xs: 4, sm: 6 },
              textAlign: { sm: "center" },
            }}
          >
            <HeadingComponent palette={palette} isMobile={isMobile} />
            <Typography
              sx={{ fontWeight: 700, color: palette[11], opacity: 0.4 }}
              variant="h6"
            >
              {dayjs().format("MMMM D")}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: { sm: "center" },
            overflowX: "scroll",
            maxWidth: "100dvw",
            px: 4,
            overflowY: "visible",
            mb: 2,
            gap: 2,
            "& *": {
              flexShrink: 0,
            },
          }}
        >
          <AvailabilityTrigger />
          <StatusSelector mutate={mutate} profile={profileData} />
          <SearchFriend mutate={mutate} />
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "500px",
            maxWidth: "calc(100% - 40px)",
            mx: "auto",
            flexDirection: "column",
          }}
        >
          <Box>
            {data && sortedFriends?.length === 0 && (
              <Box sx={{ p: 1 }}>
                <Box
                  sx={{
                    mb: 1,
                    borderRadius: 5,
                    p: 2,
                    background: palette[2],
                    textAlign: "center",
                  }}
                >
                  Friends you add will appear here.
                </Box>
              </Box>
            )}
            {data && sortedFriends?.length > 0 ? (
              <Virtuoso
                customScrollParent={containerRef.current}
                useWindowScroll
                totalCount={sortedFriends.length}
                itemContent={(i) => (
                  <Friend
                    mutate={mutate}
                    friend={sortedFriends[i].following}
                    key={sortedFriends[i].following.email}
                  />
                )}
              />
            ) : (
              <></>
            )}
          </Box>
          <ContactSync />
        </Box>
        <Toolbar />
      </motion.div>
    </Box>
  );
}
