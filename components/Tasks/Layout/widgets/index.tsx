import { ConfirmationModal } from "@/components/ConfirmationModal";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Icon, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import interact from "interactjs";
import { useEffect, useMemo, useState } from "react";
import { CreateTask } from "../../Task/Create";
import { FocusTimer } from "./FocusTimer";
import { WeatherWidget } from "./Weather";
import { Notes } from "./Notes";

export function WidgetBar({ view, setView }) {
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [wakeLock, setWakeLock] = useState<null | WakeLockSentinel>(null);

  const focusToolsStyles = useMemo(
    () => ({
      button: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "90px",
        py: 2,
        borderRadius: 0,
        background: palette[2],
        "&:hover": {
          background: palette[3],
        },
        "&[data-active='true'], &:active": {
          background: palette[4],
        },
        color: palette[11],
        fontSize: "13px",
        "& .MuiIcon-root": {
          color: addHslAlpha(palette[11], 0.8),
        },
      },
    }),
    [palette]
  );
  useEffect(() => {
    interact(".drag-widget").draggable({
      inertia: true,

      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "body",
          endOnly: true,
        }),
      ],

      listeners: {
        move(event) {
          var target = event.target;

          var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
          target.style.transform = "translate(" + x + "px, " + y + "px)";
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        },
      },
    });
  }, []);

  useEffect(() => {
    try {
      navigator.wakeLock.request("screen").then((e: any) => {
        setWakeLock(e);
        document.addEventListener("visibilitychange", async () => {
          if (wakeLock !== null && document.visibilityState === "visible") {
            const f = await navigator.wakeLock.request("screen");
            setWakeLock(f);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  }, [wakeLock]);

  useEffect(() => {
    document.body.classList[view === "priority" ? "add" : "remove"](
      "priorityMode"
    );
    window.onbeforeunload = () => {
      if (view === "priority") return false;
      else return null;
    };
    if (view !== "priority" && wakeLock) {
      wakeLock.release().then(() => {
        setWakeLock(null);
      });
    }
  }, [view, wakeLock]);

  return view === "priority" ? (
    <Box
      sx={{
        "& .container": {
          position: "fixed",
          top: 0,
          left: 0,
          height: "100dvh",
          background: palette[2],
          backdropFilter: "blur(10px)",
          width: "90px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          py: 2,
          borderRadius: "0 10px 10px 0",
          zIndex: 999,
        },
      }}
    >
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="container"
      >
        <ConfirmationModal
          callback={() => setView("all")}
          title="Exit focus mode?"
          question="Any timers set or notes created will be cleared."
        >
          <IconButton
            id="exitFocus"
            sx={{ background: palette[3], mb: "auto" }}
            size="large"
          >
            <Icon className="outlined">close</Icon>
          </IconButton>
        </ConfirmationModal>
        <FocusTimer>
          <Box sx={focusToolsStyles.button}>
            <Icon className="outlined">timer</Icon>
            Timer
          </Box>
        </FocusTimer>
        <Notes>
            <Box sx={focusToolsStyles.button}>
          <Icon className="outlined">sticky_note_2</Icon>
          Note
        </Box>
        </Notes>
        <Box sx={focusToolsStyles.button}>
          <Icon className="outlined">data_usage</Icon>
          Status
        </Box>
        <WeatherWidget>
          <Box sx={focusToolsStyles.button}>
            <Icon className="outlined">partly_cloudy_day</Icon>
            Weather
          </Box>
        </WeatherWidget>

        <CreateTask>
          <IconButton sx={{ mt: "auto", background: palette[3] }} size="large">
            <Icon className="outlined">add</Icon>
          </IconButton>
        </CreateTask>
      </motion.div>
    </Box>
  ) : (
    <></>
  );
}
