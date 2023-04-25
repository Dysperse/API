import {
  Box,
  Button,
  Icon,
  IconButton,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import dayjs from "dayjs";
import Head from "next/head";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { capitalizeFirstLetter } from "../../../lib/client/capitalizeFirstLetter";
import { useApi } from "../../../lib/client/useApi";
import { useSession } from "../../../lib/client/useSession";
import { Column } from "./Column";

export function Agenda({
  setDrawerOpen,
  view,
}: {
  setDrawerOpen: any;
  view: "week" | "month" | "year";
}) {
  const [navigation, setNavigation] = useState(0);
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
  const trigger1 = useScrollTrigger({
    threshold: 0,
    target: window ? window : undefined,
  });

  const trigger = useDeferredValue(trigger1);

  const isMobile = useMediaQuery("(max-width: 600px)");

  const e = useMemo(() => {
    if (view === "week") return "day";
    if (view === "month") return "month";
    return "year";
  }, [view]);

  const startOfWeek = useMemo(() => {
    const modifier = isMobile ? e : view;
    return dayjs().add(navigation, modifier).startOf(modifier);
  }, [navigation, e, isMobile, view]);

  const endOfWeek = useMemo(() => {
    const modifier = isMobile ? e : view;
    let endOfWeek = dayjs().add(navigation, modifier).endOf(modifier);

    switch (view) {
      case "month":
        endOfWeek = endOfWeek.add(isMobile ? 0 : 2, "month");
        break;
      case "year":
        endOfWeek = endOfWeek.add(isMobile ? 0 : 3, "year");
        break;
    }

    return endOfWeek;
  }, [navigation, e, isMobile, view]);

  const days: any = [];

  for (let i = 0; i <= endOfWeek.diff(startOfWeek, e); i++) {
    const currentDay = startOfWeek.add(i, e);
    const heading = view === "week" ? "D" : view === "month" ? "MMMM" : "YYYY";

    days.push({
      unchanged: currentDay,
      heading,
      date: currentDay.format(heading),
      day: currentDay.format("dddd"),
    });
  }

  const handlePrev = useCallback(() => {
    setNavigation(navigation - 1);
    document.getElementById("agendaContainer")?.scrollTo(0, 0);
  }, [navigation]);

  const handleNext = useCallback(() => {
    setNavigation(navigation + 1);
    document.getElementById("agendaContainer")?.scrollTo(0, 0);
  }, [navigation]);

  const handleToday = useCallback(() => {
    if (navigation == 0 && window.innerWidth <= 600) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
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
  }, []);

  const { data, url } = useApi("property/boards/agenda", {
    startTime: startOfWeek.toISOString(),
    endTime: endOfWeek.toISOString(),
  });

  useEffect(() => {
    if (navigation === 0 && data) {
      setTimeout(() => {
        const activeHighlight = document.getElementById("activeHighlight");
        if (activeHighlight)
          activeHighlight.scrollIntoView({
            block: "nearest",
            inline: "center",
          });
        window.scrollTo(0, 0);
      }, 1);
    }
  }, [data, navigation]);

  const session = useSession();
  const handleOpen = () => {
    navigator.vibrate(50);
    setDrawerOpen(true);
  };

  return (
    <>
      <Head>
        <title>
          {capitalizeFirstLetter(view == "week" ? "day" : view)} &bull; Agenda
        </title>
      </Head>
      <IconButton
        size="large"
        onClick={handleOpen}
        onContextMenu={handleOpen}
        sx={{
          position: "fixed",
          bottom: {
            xs: "65px",
            md: "30px",
          },
          transition: "transform .2s",
          "&:active": {
            transition: "none",
            transform: "scale(0.9)",
          },
          left: "10px",
          zIndex: 9,
          background: session.user.darkMode
            ? "hsla(240,11%,14%,0.5)!important"
            : "rgba(255,255,255,.5)!important",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          backdropFilter: "blur(10px)",
          border: {
            xs: session.user.darkMode
              ? "1px solid hsla(240,11%,15%)"
              : "1px solid rgba(200,200,200,.3)",
            md: "unset",
          },
          fontWeight: "700",
          display: { md: "none" },
          fontSize: "15px",
          color: session.user.darkMode ? "#fff" : "#000",
        }}
      >
        <Icon>menu</Icon>
      </IconButton>

      <Box
        sx={{
          position: "fixed",
          bottom: {
            xs: "65px",
            md: "30px",
          },
          opacity: trigger ? 0 : 1,
          transform: trigger ? "scale(0.9)" : "scale(1)",
          mr: {
            xs: 1.5,
            md: 3,
          },
          zIndex: 9,
          background: session.user.darkMode
            ? "hsla(240,11%,14%,0.5)"
            : "rgba(255,255,255,.5)",
          border: "1px solid",
          transition: "transform .2s, opacity .2s",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          borderRadius: 999,
          borderColor: session.user.darkMode
            ? "hsla(240,11%,25%, 0.5)"
            : "rgba(200,200,200, 0.3)",

          right: 0,
          color: session.user.darkMode ? "#fff" : "#000",
          display: "flex",
          alignItems: "center",
          p: 0.5,
        }}
      >
        <IconButton
          onClick={handlePrev}
          disabled={navigation === 0 && view === "month"}
        >
          <Icon>west</Icon>
        </IconButton>
        <Button
          onClick={handleToday}
          disabled={navigation == 0}
          disableRipple
          sx={{
            "&:active": {
              background: `${
                session.user.darkMode
                  ? "hsla(240,11%,25%, 0.3)"
                  : "rgba(0,0,0,0.1)"
              }`,
            },
            color: session.user.darkMode ? "#fff" : "#000",
            px: navigation == 0 ? 1 : 1.7,
            minWidth: "unset",
          }}
          color="inherit"
        >
          Today
        </Button>
        <IconButton onClick={handleNext}>
          <Icon>east</Icon>
        </IconButton>
      </Box>

      <Box
        id="agendaContainer"
        sx={{
          scrollSnapType: { xs: "x mandatory", sm: "unset" },
          display: "flex",
          maxWidth: "100vw",
          overflowX: "scroll",
          height: { md: "100vh" },
          mt: { xs: -2, md: 0 },
          ...(!data && { pointerEvents: "none", filter: "blur(10px)" }),
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
