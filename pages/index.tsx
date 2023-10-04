import { containerRef } from "@/components/Layout";
import { Navbar } from "@/components/Navbar";
import { AvailabilityTrigger } from "@/components/Start/AvailabilityTrigger";
import { Friend } from "@/components/Start/Friend";
import { FriendsTrigger } from "@/components/Start/FriendsTrigger";
import { StatusSelector } from "@/components/Start/StatusSelector";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Alert,
  Box,
  Icon,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";
import { HeadingComponent } from "../components/Start/HeadingComponent";
const ContactSync = dynamic(() => import("@/components/Start/ContactSync"));

const useShadow = (scrollerRef) => {
  const [canScrollX, setCanScrollX] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollable =
        scrollerRef.current.scrollWidth > scrollerRef.current.clientWidth;
      const scrolledToEnd =
        scrollerRef.current.scrollLeft + scrollerRef.current.clientWidth >=
        scrollerRef.current.scrollWidth;

      if (!scrollable || scrolledToEnd) {
        setCanScrollX(false);
      } else {
        setCanScrollX(true);
      }
    };

    const scroller = scrollerRef.current;

    if (scroller) {
      scroller.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scroller) {
        scroller.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollerRef]);

  return canScrollX;
};

export default function Home() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const { data, mutate } = useSWR([
    "user/profile/friends",
    {
      spotify: true,
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

  const scrollerRef = useRef();

  const shadow = useShadow(scrollerRef);

  return (
    <Box sx={{ mt: "env(titlebar-area-height)" }}>
      <Navbar
        showLogo={isMobile}
        showRightContent={isMobile}
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
          ref={scrollerRef}
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
            position: "relative",
          }}
        >
          <AvailabilityTrigger />
          <StatusSelector mutate={mutate} profile={profileData} />
          <FriendsTrigger />
          <Box
            className="scrollGradient"
            sx={{
              transform: "translateX(34px)",
              opacity: shadow ? 1 : 0,
              background: `linear-gradient(90deg, transparent, ${palette[1]})`,
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100dvw",
            mx: "auto",
            maxWidth: "500px",
            px: 4,
            flexDirection: "column",
          }}
        >
          <Box sx={{ mb: 5 }}>
            {sortedFriends?.length === 0 && (
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
            {data && sortedFriends?.length > 0 ? (
              <Virtuoso
                customScrollParent={containerRef.current}
                useWindowScroll
                totalCount={sortedFriends.length}
                itemContent={(i) => (
                  <Friend
                    mutate={mutate}
                    friend={
                      sortedFriends[i].follower.email === session.user.email
                        ? sortedFriends[i].following
                        : sortedFriends[i].follower
                    }
                    key={i}
                  />
                )}
              />
            ) : (
              <></>
            )}
          </Box>
          <ContactSync showFriends={sortedFriends?.length === 0} />
        </Box>
        <Toolbar />
      </motion.div>
    </Box>
  );
}
