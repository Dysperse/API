import {
  Box,
  CardActionArea,
  CircularProgress,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import { useApi } from "../../lib/client/useApi";
import { useSession } from "../../lib/client/useSession";
import { colors } from "../../lib/colors";
import { ErrorHandler } from "../Error";
import { Task } from "./Board/Column/Task";

export function ColoredTasks({ setDrawerOpen }) {
  const { data, url, error } = useApi("property/boards/color-coded", {
    date: dayjs().startOf("day").subtract(1, "day").toISOString(),
  });
  const [color, setColor] = useState("all");

  const session = useSession();

  if (!data) {
    return (
      <Box
        sx={{
          width: "100%",
          height: {
            xs: "calc(100vh - var(--navbar-height) - 55px)",
            sm: "100vh",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <IconButton
        size="large"
        onContextMenu={() => {
          navigator.vibrate(50);
          setDrawerOpen(true);
        }}
        onClick={() => {
          navigator.vibrate(50);
          setDrawerOpen(true);
        }}
        sx={{
          transition: "transform .2s",
          "&:active": {
            transition: "none",
            transform: "scale(0.9)",
          },
          position: "fixed",
          bottom: {
            xs: "65px",
            md: "30px",
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

      {!data ||
        (data && data.length !== 0 && (
          <Box sx={{ p: 3, pb: 1, pt: 5 }}>
            <Typography className="font-heading" variant="h4" gutterBottom>
              Color coded
            </Typography>
            <Typography sx={{ mb: 2 }}>{data.length} tasks</Typography>
            {error && (
              <ErrorHandler error="Yikes! An error occured while trying to fetch your color coded tasks. Please try again later." />
            )}
            {[
              "all",
              "orange",
              "red",
              "pink",
              "purple",
              "indigo",
              "teal",
              "green",
              "grey",
            ].map((c) => (
              <CardActionArea
                key={c}
                onClick={() => setColor(c)}
                sx={{
                  width: 36,
                  height: 36,
                  cursor: "unset",
                  borderRadius: "50%",
                  display: "inline-flex",
                  mr: 1,
                  mb: 1,
                  backgroundColor: `${
                    colors[c === "all" ? "blueGrey" : c][
                      c === "all" ? "100" : "400"
                    ]
                  }!important`,
                  "&:hover": {
                    backgroundColor: `${
                      colors[c === "all" ? "blueGrey" : c][
                        c === "all" ? "200" : "500"
                      ]
                    }!important`,
                  },
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    margin: "auto",
                    opacity:
                      color === c || (color === "all" && c === "all") ? 1 : 0,
                    color: "#000",
                  }}
                >
                  {c === "all" ? "close" : "check"}
                </span>
              </CardActionArea>
            ))}
          </Box>
        ))}
      <Box sx={{ px: { sm: 2 }, pb: 15, maxWidth: "100vw" }}>
        {data.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              userSelect: "none",
              height: {
                xs: "calc(100vh - var(--navbar-height) - 55px)",
                sm: "100vh",
              },
            }}
          >
            <Image
              src="/images/colorCoded.png"
              width={256}
              height={256}
              alt="Backlog"
              style={{
                ...(session.user.darkMode && {
                  filter: "invert(100%)",
                }),
              }}
            />
            <Box sx={{ width: "300px", maxWidth: "calc(100vw - 40px)", mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ mt: -2 }}>
                Add some color!
              </Typography>
              <Typography variant="body1">
                Try adding a color to an incomplete task, and it&apos;ll appear
                here.
              </Typography>
            </Box>
          </Box>
        )}
        {[
          ...data.filter((task) => task.pinned),
          ...data.filter((task) => !task.pinned),
        ]
          .filter((task) => color === "all" || task.color === color)
          .map((task) => (
            <Task
              key={task.id}
              board={task.board || false}
              columnId={task.column ? task.column.id : -1}
              isAgenda
              mutationUrl={url}
              task={task}
            />
          ))}
        {!data.find((task) => color === "all" || task.color === color) && (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Box
              sx={{
                textAlign: "center",
                display: "inline-flex",
                mx: "auto",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                background: `hsl(240,11%,${session.user.darkMode ? 30 : 95}%)`,
                borderRadius: 5,
                userSelect: "none",
              }}
            >
              <Image
                src="/images/colorCoded.png"
                width={256}
                height={256}
                alt="Backlog"
                style={{
                  ...(session.user.darkMode && {
                    filter: "invert(100%)",
                  }),
                }}
              />
              <Box
                sx={{ width: "300px", maxWidth: "calc(100vw - 40px)", mb: 2 }}
              >
                <Typography variant="h6" gutterBottom sx={{ mt: -2 }}>
                  Add some color!
                </Typography>
                <Typography variant="body1">
                  Try adding a color to an incomplete task, and it&apos;ll
                  appear here.
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
