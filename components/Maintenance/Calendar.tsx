import React from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import { colors } from "../../lib/colors";
import Typography from "@mui/material/Typography";

function Day({ i, date, currentDate, setCurrentDate, data }) {
  const eventsMatchingDate = data.filter(
    (reminder) =>
      dayjs(reminder.lastDone.split("T")[0]).format("YYYY-MM-DD") ===
      date.format("YYYY-MM-DD")
  );

  return (
    <Box
      key={Math.random().toString()}
      onClick={() => {
        setCurrentDate(date.format("DD/MM/YYYY"));
      }}
      sx={{
        py: 1.5,
        display: "inline-flex",
        ...(currentDate === date.format("DD/MM/YYYY") && {
          backgroundColor: colors[themeColor][900],
        }),
        transition: "transform .2s",
        "&:active": {
          transform: "scale(0.95)",
          transition: "none",
        },
        borderRadius: 6,
        width: "55px",
        flexDirection: "column",
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="body2">
        {date.format("ddd").substring(0, 1)}
      </Typography>
      <Typography
        sx={{
          fontWeight: "900",
        }}
      >
        {date.format("D")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 0.25,
        }}
      >
        {[
          ...new Array(
            eventsMatchingDate.length > 2 ? 2 : eventsMatchingDate.length
          ),
        ].map(() => (
          <Box
            key={Math.random().toString()}
            sx={{
              mb: -1,
              mt: 0.5,
              width: 4,
              height: 4,
              backgroundColor: colors[themeColor][100],
              borderRadius: "50%",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export function Calendar({ data, currentDate, setCurrentDate }) {
  return (
    <Box
      sx={{
        whiteSpace: "nowrap",
        width: { xs: "100vw", sm: "auto" },
        px: 3,
        overflowX: "auto",
      }}
    >
      {Array.from({ length: 69 }, (_, i) => i).map((i) => {
        const date = dayjs().add(i - 1, "day");
        return (
          <Day
            i={i}
            date={date}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            data={data}
          />
        );
      })}
    </Box>
  );
}
