"use client";

import { containerRef } from "@/app/(app)/container";
import { ErrorHandler } from "@/components/Error";
import { Navbar } from "@/components/Layout/Navigation/Navbar";
import { Puller } from "@/components/Puller";
import { AvailabilityTrigger } from "@/components/Start/AvailabilityTrigger";
import { Friend } from "@/components/Start/Friend";
import { FriendsTrigger } from "@/components/Start/FriendsTrigger";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Alert,
  Box,
  Icon,
  IconButton,
  NoSsr,
  Skeleton,
  SwipeableDrawer,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
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
import airQuality from "./tasks/Layout/widgets/airQuality.json";
import { TodaysTasks } from "./widgets/TodaysTasks";
import { Weather } from "./widgets/Weather";
const ContactSync = dynamic(() => import("@/components/Start/ContactSync"));

export function getAirQualityInfo(index) {
  const result = airQuality.find(
    (category) => index >= category.index.min && index <= category.index.max
  );

  return result || null; // Return null if no matching category is found
}

function Time() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Puller />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          fontSize: "25px",
          p: 3,
          "& .MuiTypography-root": {
            px: 2,
            py: 1,
            display: "block",
            background: palette[3],
            borderRadius: 5,
          },
        }}
      >
        <Typography variant="h5">{dayjs(time).format("hh")}</Typography>:
        <Typography variant="h5">{dayjs(time).minute()}</Typography>:
        <Typography variant="h5">{dayjs(time).format("ss")}</Typography>
        <Typography variant="h5" sx={{ ml: 2 }}>
          {dayjs(time).format("A")}
        </Typography>
      </Box>
    </Box>
  );
}

function TodaysDate() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
      >
        <Time />
      </SwipeableDrawer>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          p: 2,
          height: "130px",
          borderRadius: 5,
          background: palette[3],
          color: palette[11],
        }}
      >
        <Icon sx={{ fontSize: "40px!important" }} className="outlined">
          calendar_today
        </Icon>
        <Typography sx={{ ml: 0.2 }} variant="h5">
          {dayjs().format("dddd")}
        </Typography>
        <Typography sx={{ ml: 0.2 }} variant="body2">
          {dayjs().format("MMM Do")}
        </Typography>
      </Box>
    </>
  );
}

function Home() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const params: any = ["user/friends", { email: session.user.email }];

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

  const sectionHeaderStyles = {
    textTransform: "uppercase",
    fontWeight: 900,
    fontSize: "14px",
    opacity: 0.6,
    mb: 1.5,
    mt: 3,
    color: palette[11],
  };

  return (
    <Box
      sx={{
        background: `radial-gradient(${addHslAlpha(palette[3], 0.8)} 4px, ${
          palette[1]
        } 5px, transparent 0)`,
        backgroundSize: "50px 50px",
        backgroundPosition: "-25px -25px",
      }}
    >
      {isMobile ? (
        <Navbar
          showLogo={isMobile}
          showRightContent={isMobile}
          right={
            <IconButton
              sx={{ background: palette[3] }}
              onClick={() => router.push("/spaces")}
            >
              <Icon className="outlined">workspaces</Icon>
            </IconButton>
          }
        />
      ) : (
        <Toolbar />
      )}
      <Box
        sx={{
          maxWidth: "100dvw",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            display: "none",
          },
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
                  }}
                >
                  <Typography
                    sx={{
                      ...sectionHeaderStyles,
                      mb: 0,
                      ml: 0.1,
                      textShadow: `0 0 40px ${palette[8]}`,
                    }}
                  >
                    Hey{" "}
                    {capitalizeFirstLetter(session.user.name.split(" ")?.[0])},
                  </Typography>
                  <HeadingComponent palette={palette} isMobile={isMobile} />
                  <Typography
                    sx={{
                      mt: -1,
                      ml: 0.2,
                      fontWeight: 700,
                      color: palette[11],
                      opacity: 0.8,
                      textShadow: `0 0 40px ${palette[8]}`,
                    }}
                    variant="h6"
                  >
                    Are you ready to seize the day?
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  px: 3,
                  maxWidth: "100dvw",
                  display: "flex",
                  gap: 2,
                  "& .button": {
                    background: palette[3],
                    borderRadius: 5,
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    gap: 2,
                    fontWeight: 700,
                    color: palette[11],
                    "& .MuiIcon-root": {
                      fontSize: "30px!important",
                    },
                  },
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
                  px: 3,
                  flexDirection: "column",
                }}
              >
                <Typography sx={sectionHeaderStyles}>
                  Today&apos;s rundown
                </Typography>
                <Box>
                  <Grid container sx={{ mb: 2 }} spacing={2}>
                    <Grid xs={6}>
                      <Weather />
                    </Grid>
                    <Grid xs={6}>
                      <TodaysDate />
                    </Grid>
                    <Grid xs={12}>
                      <TodaysTasks />
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mb: 5 }}>
                  <Typography sx={sectionHeaderStyles}>
                    Recent activity
                  </Typography>
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
                        customScrollParent={
                          isMobile ? undefined : containerRef.current
                        }
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
                            border: "2px solid",
                            borderColor: palette[3],
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
          {isMobile && session.space.info.type !== "study group" && (
            <Box sx={{ flex: "0 0 100dvw" }}>
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
    </Box>
  );
}

export default function Page() {
  return (
    <NoSsr>
      <Home />
    </NoSsr>
  );
}
