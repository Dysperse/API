"use client";
import { Task } from "@/app/(app)/tasks/Task";
import { ErrorHandler } from "@/components/Error";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useDarkMode } from "@/lib/client/useColor";
import { colors } from "@/lib/colors";
import {
  Box,
  CardActionArea,
  CircularProgress,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/legacy/image";
import { useState } from "react";
import useSWR from "swr";
import { TaskNavbar } from "../navbar";

export default function ColoredTasks() {
  const { data, mutate, error } = useSWR([
    "space/tasks/color-coded",
    {
      params: {
        date: dayjs().startOf("day").subtract(1, "day").toISOString(),
      },
    },
  ]);
  const [color, setColor] = useState("all");

  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);

  const emptyPlaceholder = (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        userSelect: "none",
        height: {
          xs: "calc(100dvh - var(--navbar-height) - var(--bottom-nav-height))",
          sm: "100dvh",
        },
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Image
          src="/images/colorCoded.png"
          width={256}
          height={256}
          alt="Backlog"
          style={{
            ...(isDark && {
              filter: "invert(100%)",
            }),
          }}
        />
      </motion.div>
      <Box sx={{ width: "300px", maxWidth: "calc(100vw - 40px)", mb: 2 }}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Typography variant="h6" gutterBottom sx={{ mt: -2 }}>
            Add some color!!
          </Typography>
        </motion.div>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Typography variant="body1">
            Try adding a color to an incomplete task, and it&apos;ll appear
            here.
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );

  if (!data) {
    return (
      <Box
        sx={{
          width: "100%",
          height: {
            xs: "calc(100dvh - var(--navbar-height) - var(--bottom-nav-height))",
            sm: "100dvh",
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
      <TaskNavbar
        title={"Color coded"}
        subTitle={capitalizeFirstLetter(color)}
      />
      {data && data.length > 0 && (
        <Box sx={{ p: 3, pb: 1, pt: 15 }}>
          <Typography className="font-heading" variant="h3">
            Color coded
          </Typography>
          <Typography sx={{ mb: 2 }}>
            {data.length} task{data.length !== 1 && "s"}
          </Typography>
          {error && (
            <ErrorHandler
              callback={() => mutate()}
              error="Yikes! An error occured while trying to fetch your color coded tasks. Please try again later."
            />
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
      )}
      <Box
        sx={{ px: { sm: 2 }, pb: data.length == 0 ? 0 : 15, maxWidth: "100vw" }}
      >
        {data.length === 0 && emptyPlaceholder}

        {[
          ...data
            .filter((task) => color === "all" || task.color === color)
            .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1)),
        ].map((task) => (
          <Task
            key={task.id}
            board={task.board || false}
            columnId={task.column ? task.column.id : -1}
            mutate={mutate}
            task={task}
          />
        ))}
        {!data.find((task) => color === "all" || task.color === color) &&
          data.length >= 1 &&
          emptyPlaceholder}
      </Box>
    </Box>
  );
}
