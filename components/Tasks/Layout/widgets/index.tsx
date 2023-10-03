import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Logo } from "@/components/Logo";
import { StatusSelector } from "@/components/Start/StatusSelector";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Avatar,
  Box,
  Icon,
  IconButton,
  ListItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import interact from "interactjs";
import Markdown from "markdown-to-jsx";
import { cloneElement, useEffect, useMemo, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";
import { CreateTask } from "../../Task/Create";
import { FocusTimer } from "./FocusTimer";
import { Notes } from "./Notes";
import { WeatherWidget } from "./Weather";

function Assistant({ children }) {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any>([]);

  const virtuosoRef: any = useRef();

  const dotVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.6, // Adjust the duration as needed
        yoyo: Infinity, // This will loop the animation indefinitely
      },
    },
  };

  const handleSubmit = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: draft },
    ]);
    setMessages((prevMessages) => [...prevMessages, "loading"]);

    const d = await fetch("/api/ai/assistant", {
      method: "POST",
      body: JSON.stringify(
        [
          messages[messages.length - 2]
            ? messages[messages.length - 2]
            : undefined,
          { role: "user", content: draft },
        ].filter((e) => e)
      ),
    }).then((res) => res.json());

    const r = { role: "system", content: d[0].response.response };

    setMessages((prevMessages) => [...prevMessages, r]);
    setMessages((prevMessages) => prevMessages.filter((e) => e !== "loading"));

    virtuosoRef.current.scrollToIndex({
      index: messages.length - 1,
      behavior: "smooth",
    });
  };

  const trigger = cloneElement(children, {
    onClick: () => setOpen(true),
  });

  return (
    <>
      {trigger}
      <Box
        className="drag-widget"
        sx={{
          position: "fixed",
          display: "none",
          background: palette[2],
          border: `2px solid ${palette[3]}`,
          borderRadius: 5,
          overflow: "hidden",
          ".priorityMode &": {
            display: "block",
          },
          zIndex: 999,
          width: "400px",
          "& #close": {
            display: "none",
          },
          "&:hover #close": {
            display: "flex",
          },
          ...(!open && { display: "none" }),
        }}
      >
        <AppBar>
          <Toolbar>
            <Typography variant="h6">Assistant</Typography>
            <IconButton sx={{ ml: "auto" }} onClick={() => setOpen(false)}>
              <Icon>close</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: "300px" }}
          totalCount={messages.length}
          followOutput="auto"
          itemContent={(i) => {
            const message = messages[i];
            if (message === "loading") {
              return (
                <ListItem key={i}>
                  <Avatar>
                    <Logo size={30} intensity={8} />
                  </Avatar>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {[...new Array(3)].map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 13,
                          height: 13,
                          borderRadius: 999,
                          background: palette[9],
                          animation: "fade 1s infinite",
                          animationDelay: `.${index * 3}s`,
                        }}
                      />
                    ))}
                  </Box>
                </ListItem>
              );
            } else {
              return (
                <ListItem key={i} sx={{ alignItems: "start" }}>
                  <Avatar sx={{ mt: 1 }}>
                    {message.role === "user" ? (
                      <Icon>account_circle</Icon>
                    ) : (
                      <Logo size={30} intensity={8} />
                    )}
                  </Avatar>
                  <Box sx={{ pt: 2 }}>
                    <Markdown>
                      {message.content || "*(empty message?)*"}
                    </Markdown>
                  </Box>
                </ListItem>
              );
            }
          }}
        />
        <Box sx={{ display: "flex", gap: 2, p: 2 }}>
          <TextField
            label="Send message..."
            size="small"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <IconButton onClick={handleSubmit}>
            <Icon>send</Icon>
          </IconButton>
        </Box>
      </Box>
    </>
  );
}

export function WidgetBar({ view, setView }) {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [wakeLock, setWakeLock] = useState<null | WakeLockSentinel>(null);

  const focusToolsStyles = useMemo(
    () => ({
      button: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "80px",
        py: 2,
        borderRadius: 0,
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

  const { data: profileData, mutate } = useSWR([
    "user/profile",
    {
      email: session.user.email,
    },
  ]);

  useEffect(() => {
    if (
      document.hasFocus() &&
      process.env.NODE_ENV === "production" &&
      view === "priority"
    ) {
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
      } catch (e) {}
    }
  }, [wakeLock, view]);

  useEffect(() => {
    document.body.classList[view === "priority" ? "add" : "remove"](
      "priorityMode"
    );
    window.onbeforeunload = () => {
      if (view === "priority") return false;
      else return null;
    };
    if (view !== "priority" && wakeLock && document.hasFocus()) {
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
          WebkitAppRegion: "no-drag",
          height: "100dvh",
          width: "80px",
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
            sx={{ background: palette[4], mb: "auto" }}
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
        <Assistant>
          <Box sx={focusToolsStyles.button}>
            <Icon className="outlined">auto_awesome</Icon>
            Assistant
          </Box>
        </Assistant>
        {profileData && (
          <StatusSelector profile={profileData} mutate={mutate}>
            <Box sx={focusToolsStyles.button}>
              <Icon className="outlined">data_usage</Icon>
              Status
            </Box>
          </StatusSelector>
        )}
        <WeatherWidget>
          <Box sx={focusToolsStyles.button}>
            <Icon className="outlined">partly_cloudy_day</Icon>
            Weather
          </Box>
        </WeatherWidget>

        <CreateTask>
          <IconButton sx={{ mt: "auto", background: palette[4] }} size="large">
            <Icon className="outlined">add</Icon>
          </IconButton>
        </CreateTask>
      </motion.div>
    </Box>
  ) : (
    <></>
  );
}
