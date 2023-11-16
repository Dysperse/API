"use client";

import { Navbar } from "@/components/Layout/Navigation/Navbar";
import { Puller } from "@/components/Puller";
import { AvailabilityTrigger } from "@/components/Start/AvailabilityTrigger";
import { FriendsTrigger } from "@/components/Start/FriendsTrigger";
import { StatusSelector } from "@/components/Start/StatusSelector";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  NoSsr,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HeadingComponent } from "../../components/Start/HeadingComponent";
import { swipeablePageStyles } from "./swipeablePageStyles";
import airQuality from "./tasks/Layout/widgets/airQuality.json";
import { Friends } from "./widgets/Friends";
import { HomePageCustomization } from "./widgets/HomePageCustomization";
import { TodaysDate } from "./widgets/TodaysDate";
import { TodaysTasks } from "./widgets/TodaysTasks";
import { Weather } from "./widgets/Weather";

import patterns from "@/app/(app)/settings/patterns.json";

export function getAirQualityInfo(index) {
  const result = airQuality.find(
    (category) => index >= category.index.min && index <= category.index.max
  );

  return result || null; // Return null if no matching category is found
}

export function hslToHex([h, s, l]) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function Time() {
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

function Home() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: 1,
    active: isMobile,
  });

  useEffect(() => {
    emblaApi?.reInit({
      startIndex: 1,
      active: isMobile,
    });
  }, [emblaApi, isMobile]);

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

  const customizeTrigger = (
    <Box
      sx={{
        mt: { xs: 4, sm: 0 },
        mb: { xs: 15, sm: 2 },
        display: "flex",
        justifyContent: { xs: "center", sm: "flex-end" },
      }}
    >
      <HomePageCustomization>
        <Button variant="outlined">
          <Icon>palette</Icon>
          Customize
        </Button>
      </HomePageCustomization>
    </Box>
  );

  const shortcuts = (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 2,
        mt: { xs: 2, sm: 0 },
        "& .button": {
          background: palette[3],
          "&:hover": { background: { sm: palette[5] } },
          "&:active": { background: palette[5] },
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
  );

  return (
    <Box
      sx={
        session.user.homePagePattern && patterns[session.user.homePagePattern]
          ? {
              transition: "background 1s",
              backgroundPosition: "center",
              background: `url("/api/user/homePagePattern?${new URLSearchParams(
                {
                  color: hslToHex(
                    palette[3]
                      .replaceAll(/hsl\(|\)|%/g, "")
                      .split(",")
                      .map((e) => +e) as any
                  ),
                  pattern: session.user.homePagePattern,
                }
              )}")`,
            }
          : undefined
      }
    >
      {isMobile && (
        <Navbar
          showLogo={isMobile}
          showRightContent={isMobile}
          right={
            <>
              <StatusSelector mutate={() => {}} profile={session.user} />
              <IconButton
                sx={{ background: palette[3] }}
                onClick={() => router.push("/spaces")}
              >
                <Icon className="outlined">workspaces</Icon>
              </IconButton>
            </>
          }
        />
      )}
      <Box
        sx={{
          maxWidth: "100dvw",
          "&::-webkit-scrollbar": {
            display: "none",
          },
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
                position: "sticky",
                top: 0,
                left: 0,
                height: "100dvh",
              }}
            >
              <Box
                sx={{
                  transform: `scale(${loadingIndex === 0 ? 1.5 : 1})`,
                  transition: "all .4s cubic-bezier(.17,.67,.57,1.39)",
                }}
              >
                <Box sx={swipeablePageStyles(palette, "left")}>
                  <Icon className={loadingIndex === 0 ? "filled" : "undefined"}>
                    check_circle
                  </Icon>
                  <Typography variant="h4" className="font-heading">
                    Tasks
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          <Grid
            container
            sx={{
              width: "100%",
              height: { sm: "100dvh" },
              flex: { xs: "0 0 100dvw", sm: "0 0 100%" },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              py: 2,
              "&>div": {
                "&:first-child": {
                  pl: { xs: 4, sm: 5 },
                  pr: { xs: 4, sm: 2.5 },
                },
                "&:last-child": {
                  pr: { xs: 4, sm: 5 },
                  pl: { xs: 4, sm: 2.5 },
                },
              },
              "& .card": {
                borderRadius: 5,
                color: palette[11],
                background: palette[3],
                "&:hover": { background: { sm: palette[4] } },
                "&:active": { background: palette[5] },
              },
            }}
          >
            <Grid
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: "100%", mt: { xs: 5, sm: 0 } }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                </motion.div>
                <HeadingComponent palette={palette} isMobile={isMobile} />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
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
                </motion.div>
                {isMobile && shortcuts}
                <Typography sx={sectionHeaderStyles}>
                  Today&apos;s rundown
                </Typography>
                <Box>
                  <Grid container spacing={2}>
                    <Grid xs={6}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Weather />
                      </motion.div>
                    </Grid>
                    <Grid xs={6}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <TodaysDate />
                      </motion.div>
                    </Grid>
                    <Grid xs={12}>
                      <TodaysTasks />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
            <Grid
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: "100%" }}>
                {!isMobile && customizeTrigger}
                {!isMobile && shortcuts}
                <Typography sx={sectionHeaderStyles}>
                  Recent activity
                </Typography>
                <Friends />
                {isMobile && customizeTrigger}
              </Box>
            </Grid>
          </Grid>
          {isMobile && session.space.info.type !== "study group" && (
            <Box
              sx={{
                flex: "0 0 100dvw",
                position: "sticky",
                top: 0,
                left: 0,
                height: "100dvh",
              }}
            >
              <Box
                sx={{
                  transform: `scale(${loadingIndex === 2 ? 1.5 : 1})`,
                  transition: "all .4s cubic-bezier(.17,.67,.57,1.39)",
                }}
              >
                <Box sx={swipeablePageStyles(palette, "right")}>
                  <Icon className={loadingIndex === 2 ? "filled" : undefined}>
                    package_2
                  </Icon>
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
    <NoSsr
      fallback={
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100dvh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <Home />
    </NoSsr>
  );
}
