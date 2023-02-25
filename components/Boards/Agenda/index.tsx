import { Box, Button, Icon, IconButton, useScrollTrigger } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useApi } from "../../../hooks/useApi";
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
  const trigger = useScrollTrigger({
    threshold: 0,
    target: window ? window : undefined,
  });
  const e = view === "week" ? "day" : view === "month" ? "month" : "year";

  let startOfWeek = dayjs().add(navigation, view).startOf(view);
  let endOfWeek = dayjs().add(navigation, view).endOf(view);

  switch (view) {
    case "month":
      endOfWeek = endOfWeek.add(2, "month");
      break;
    case "year":
      endOfWeek = endOfWeek.add(3, "year");
      break;
  }

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

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          left: 0,
          height: "55px",
          width: "100%",
          top: "var(--navbar-height)",
          borderBottom: {
            xs: global.user.darkMode
              ? "1px solid hsla(240,11%,15%)"
              : "1px solid rgba(200,200,200,.3)",
            sm: "unset",
          },
          background: {
            xs: global.user.darkMode
              ? "hsla(240,11%,10%, .7)"
              : "rgba(255,255,255,.7)",
            sm: "transparent",
          },
          zIndex: 9,
          maxWidth: "100vw",
          p: 1,
          px: 3,
          backdropFilter: {
            xs: "blur(10px)",
            sm: "none",
          },
          alignItems: "center",
          display: { xs: "flex", sm: "none" },
          gap: 1,
        }}
      >
        <Button
          size="small"
          onClick={() => setDrawerOpen(true)}
          sx={{
            fontWeight: "700",
            display: { sm: "none" },
            fontSize: "15px",
            color: global.user.darkMode ? "#fff" : "#000",
            ...(view !== "week" && {
              textTransform: "capitalize",
            }),
          }}
        >
          {view === "week" && "This"} {view}
          <Icon>expand_more</Icon>
        </Button>
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: {
            xs: "70px",
            sm: "30px",
          },
          opacity: trigger ? 0 : 1,
          transform: trigger ? "scale(0.9)" : "scale(1)",
          mr: {
            xs: 2,
            sm: 3,
          },
          zIndex: 9,
          background: global.user.darkMode
            ? "hsla(240,11%,14%,0.5)"
            : "rgba(255,255,255,.5)",
          border: "1px solid",
          transition: "transform .2s, opacity .2s",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          borderRadius: 999,
          borderColor: global.user.darkMode
            ? "hsla(240,11%,25%, 0.5)"
            : "rgba(200,200,200, 0.5)",
          right: 0,
          color: global.user.darkMode ? "#fff" : "#000",
          display: "flex",
          alignItems: "center",
          p: 1,
          py: 0.5,
        }}
      >
        <IconButton
          onClick={handlePrev}
          disabled={navigation === 0 && view == "month"}
        >
          <Icon>west</Icon>
        </IconButton>
        <Button
          onClick={handleToday}
          disabled={navigation === 0}
          disableRipple
          sx={{
            "&:active": {
              background: `${
                global.user.darkMode
                  ? "hsla(240,11%,25%, 0.3)"
                  : "rgba(0,0,0,0.1)"
              }`,
            },
            py: 1,
            color: global.user.darkMode ? "#fff" : "#000",
            px: 1.7,
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
        className="snap-x snap-mandatory sm:snap-none"
        sx={{
          display: "flex",
          maxWidth: "100vw",
          overflowX: "scroll",
          mt: { xs: 4, sm: 0 },
          height: { sm: "100vh" },
        }}
      >
        {days.map((day) => (
          <Column
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
