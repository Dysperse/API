"use client";

import { containerRef } from "@/app/(app)/container";
import { ErrorHandler } from "@/components/Error";
import { Navbar } from "@/components/Layout/Navigation/Navbar";
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
  NoSsr,
  Skeleton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";
import { HeadingComponent } from "../../components/Start/HeadingComponent";
import { fetcher } from "./fetcher";
import { swipeablePageStyles } from "./swipeablePageStyles";
const ContactSync = dynamic(() => import("@/components/Start/ContactSync"));

export default function Home() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const params: any = typeof window !== "undefined" && [
    "user/profile/friends",
    {
      email: session.user.email,
      date: dayjs().startOf("day").toISOString(),
      timezone: session.user.timeZone,
    },
  ];
  const { data, error, mutate } = useSWR(
    params,
    fetcher(params, session) as any,
    {
      refreshInterval: 5000,
    }
  );

  const router = useRouter();

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
          document.getElementById("link1")?.click();
          // router.push("/tasks/home");
        } else if (e.selectedScrollSnap() == 2) {
          setLoadingIndex(2);
          document.getElementById("link3")?.click();
          // router.push("/rooms");
        } else {
          setLoadingIndex(1);
        }
      });
    }
  }, [emblaApi, router]);

  return (
    // <NoSsr> cuz embla doesn't get initialized idk why
    <NoSsr>
      <Navbar
        showLogo={isMobile}
        showRightContent={isMobile}
        right={
          !isMobile ? undefined : (
            <StatusSelector mutate={() => {}} profile={session.user.Profile} />
          )
        }
      />
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
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: { sm: "center" },
                  mb: 2,
                  px: 4,
                }}
              >
                <AvailabilityTrigger />
                <FriendsTrigger />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  mx: "auto",
                  width: "100%",
                  maxWidth: { sm: "500px" },
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

                  {data ? (
                    data?.friends?.length > 0 && (
                      <Virtuoso
                        initialItemCount={
                          data.friends.length < 5 ? data.friends.length : 5
                        }
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
                    )
                  ) : error ? (
                    <ErrorHandler
                      callback={mutate}
                      error="Couldn't load your friends. Try again later."
                    />
                  ) : (
                    <>
                      {[...new Array(5)].map((_, i) => (
                        <Box
                          key={i}
                          sx={{
                            mb: 2,
                            px: 2,
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            background: palette[2],
                            borderRadius: 5,
                            height: 95,
                          }}
                        >
                          <Skeleton
                            variant="circular"
                            width={50}
                            height={50}
                            sx={{ mt: -1 }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Skeleton
                              width={"90%"}
                              height={35}
                              sx={{ mt: -1 }}
                            />
                            <Skeleton width={"50%"} sx={{ mt: -0.1 }} />
                          </Box>
                        </Box>
                      ))}
                    </>
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
    </NoSsr>
  );
}
