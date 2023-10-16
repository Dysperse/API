"use client";

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
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";
import { HeadingComponent } from "../components/Start/HeadingComponent";
import { containerRef } from "./container";
import { swipeablePageStyles } from "./swipeablePageStyles";
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
      email: session.user.email,
      date: dayjs().startOf("day").toISOString(),
      timezone: session.user.timeZone,
    },
  ]);

  const { data: profileData } = useSWR([
    "user/profile",
    { email: session.user.email },
  ]);

  const scrollerRef = useRef();
  const router = useRouter();
  const shadow = useShadow(scrollerRef);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: 1,
    active: isMobile,
  });
  const [loadingIndex, setLoadingIndex] = useState(1);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("scroll", (e) => {
        if (e.selectedScrollSnap() == 0) {
          setLoadingIndex(0);
          router.push("/tasks/home");
        } else if (e.selectedScrollSnap() == 2) {
          setLoadingIndex(2);
          router.push("/rooms");
        } else {
          setLoadingIndex(1);
        }
      });
    }
  }, [emblaApi, router]);

  return (
    <>
      <Navbar showLogo={isMobile} showRightContent={isMobile} />
      <Box
        sx={{
          mt: "env(titlebar-area-height)",
          ...(loadingIndex !== 1 && {
            pointerEvents: "none",
          }),
        }}
        ref={emblaRef}
      >
        <Box sx={{ display: "flex" }}>
          {isMobile && (
            <Box
              sx={{
                flex: "0 0 100dvw",
              }}
            >
              <Box
                sx={{
                  transform: `scale(${loadingIndex === 0 ? 1.5 : 1})`,
                  transition: "all .4s cubic-bezier(.17,.67,.57,1.39)",
                }}
              >
                <Box sx={swipeablePageStyles(palette, "left")}>
                  <Icon>check_circle</Icon>
                  <Typography variant="h4" className="font-heading">
                    Tasks
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          <Box sx={{ flex: "0 0 100dvw" }}>
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

                  {data && data?.friends?.length > 0 ? (
                    <Virtuoso
                      customScrollParent={containerRef.current}
                      useWindowScroll
                      totalCount={data.friends.length}
                      itemContent={(i) => (
                        <Friend
                          mutate={mutate}
                          friend={
                            data.friends[i].follower ||
                            data.friends[i].following
                          }
                          key={i}
                        />
                      )}
                    />
                  ) : (
                    <></>
                  )}
                </Box>
                <ContactSync showFriends={data?.friends?.length === 0} />
              </Box>
              <Toolbar />
            </motion.div>
          </Box>
          {isMobile && (
            <Box
              sx={{
                flex: "0 0 100dvw",
              }}
            >
              <Box
                sx={{
                  transform: `scale(${loadingIndex === 2 ? 1.5 : 1})`,
                  transition: "all .4s cubic-bezier(.17,.67,.57,1.39)",
                }}
              >
                <Box sx={swipeablePageStyles(palette, "right")}>
                  <Icon>package_2</Icon>
                  <Typography variant="h4" className="font-heading">
                    Inventory
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
