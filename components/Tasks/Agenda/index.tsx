import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { vibrate } from "@/lib/client/vibration";
import { Box, Button, Icon, IconButton, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Column } from "./Column";

export function Agenda({ setDrawerOpen, view }) {
  const [navigation, setNavigation] = useState(
    window.location.hash ? parseInt(window.location.hash.replace("#", "")) : 0,
  );

  useEffect(() => {
    const set = () => {
      if (window.location.hash) {
        const hash = window.location.hash.replace("#", "");
        if (hash) setNavigation(parseInt(hash));
      }
    };

    set();

    window.addEventListener("hashchange", set);
  }, []);

  useEffect(() => {
    window.location.hash = `#${navigation}`;
  }, [navigation]);

  useHotkeys("alt+n", (e) => {
    e.preventDefault();
    setNavigation((n) => n + 1);
  });
  useHotkeys("alt+p", (e) => {
    e.preventDefault();
    setNavigation((n) => n - 1);
  });
  useHotkeys("alt+t", (e) => {
    e.preventDefault();
    setNavigation(0);
  });

  const isMobile = useMediaQuery("(max-width: 600px)");
  const viewModifier = isMobile ? "day" : view;

  const startOfWeek = dayjs()
    .add(navigation, viewModifier)
    .startOf(viewModifier);
  const endOfWeek = dayjs().add(navigation, viewModifier).endOf(viewModifier);

  const days: any[] = [];
  const heading =
    view === "week" || view === "day"
      ? "dddd"
      : view === "month"
      ? "MMMM"
      : "YYYY";

  for (let i = 0; i <= endOfWeek.diff(startOfWeek, viewModifier); i++) {
    const currentDay = startOfWeek.add(i, viewModifier);
    days.push({
      unchanged: currentDay,
      heading,
      date: currentDay.format(heading),
      day: currentDay.format("dddd"),
    });
  }

  const handlePrev = () => {
    setNavigation(navigation - 1);
    document.getElementById("agendaContainer")?.scrollTo(0, 0);
  };

  const handleNext = () => {
    setNavigation(navigation + 1);
    document.getElementById("agendaContainer")?.scrollTo(0, 0);
  };

  const handleToday = () => {
    setNavigation(0);
    setTimeout(() => {
      const activeHighlight = document.getElementById("activeHighlight");
      if (activeHighlight)
        activeHighlight.scrollIntoView({
          block: "nearest",
          inline: "center",
        });
      window.scrollTo(0, 0);
    }, 1);
  };

  const { data, loading, url } = useApi("property/tasks/agenda", {
    startTime: startOfWeek.toISOString(),
    endTime: endOfWeek.toISOString(),
  });

  const [alreadyScrolled, setAlreadyScrolled] = useState(false);

  useEffect(() => {
    if (navigation === 0 && data && !alreadyScrolled) {
      setTimeout(() => {
        setAlreadyScrolled(true);
        const activeHighlight = document.getElementById("activeHighlight");
        if (activeHighlight)
          activeHighlight.scrollIntoView({
            block: "nearest",
            inline: "center",
          });
        window.scrollTo(0, 0);
      }, 1);
    }
  }, [data, navigation, alreadyScrolled]);

  const session = useSession();
  const handleOpen = () => {
    vibrate(50);
    setDrawerOpen(true);
  };

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  return (
    <>
      <Head>
        <title>
          {capitalizeFirstLetter(view === "week" ? "day" : view)} &bull; Agenda
        </title>
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.4 }}
      >
        <Box
          sx={{
            position: "fixed",
            bottom: { xs: "70px", md: "30px" },
            ".hideBottomNav &": { bottom: { xs: "30px", md: "30px" } },
            mr: { xs: 1.5, md: 3 },
            zIndex: 9,
            background: addHslAlpha(palette[3], 0.5),
            border: "1px solid",
            transition: "transform .2s, opacity .2s, bottom .3s",
            backdropFilter: "blur(10px)",
            borderRadius: 999,
            borderColor: addHslAlpha(palette[3], 0.5),
            right: "0",
            color: isDark ? "#fff" : "#000",
            display: "flex",
            alignItems: "center",
            p: 0.5,
          }}
        >
          <IconButton
            onClick={handlePrev}
            disabled={navigation === 0 && view === "month"}
            sx={{ color: palette[9] }}
          >
            <Icon>west</Icon>
          </IconButton>
          <motion.div
            animate={{
              opacity: navigation === 0 ? 0 : 1,
              width: navigation === 0 ? 0 : "auto",
            }}
          >
            <Button
              onClick={handleToday}
              disableRipple
              sx={{
                "&:active": {
                  background: `${
                    isDark ? "hsla(240,11%,25%, 0.3)" : "rgba(0,0,0,0.1)"
                  }`,
                },
                color: palette[9],
                px: 1,
                minWidth: "unset",
              }}
              color="inherit"
            >
              Today
            </Button>
          </motion.div>
          <IconButton onClick={handleNext} sx={{ color: palette[9] }}>
            <Icon>east</Icon>
          </IconButton>
        </Box>
      </motion.div>

      <Box
        id="agendaContainer"
        sx={{
          scrollSnapType: { xs: "x mandatory", sm: "unset" },
          display: "flex",
          maxWidth: "100vw",
          overflowX: "scroll",
          height: { md: "100vh" },
          ...(loading && { pointerEvents: "none", filter: "blur(10px)" }),
        }}
      >
        {days.map((day) => (
          <Column
            navigation={navigation}
            key={day.day}
            day={day}
            view={view}
            data={data}
            mutationUrl={url}
          />
        ))}
      </Box>
    </>
  );
}
