import { Box, Button, CircularProgress, Icon, Typography } from "@mui/material";
import dayjs from "dayjs";
import { mutate } from "swr";
import { useApi } from "../../../lib/client/useApi";
import { ErrorHandler } from "../../Error";

export function RoutineEnd({ routineId = "-1", setCurrentIndex, handleClose }) {
  const { data, url, error } = useApi("user/routines/custom-routines/items", {
    ...(routineId !== "-1" && { id: routineId }),
  });

  const tasksRemaining = !data
    ? []
    : data[0].items.filter(
        (task) => task.lastCompleted !== dayjs().format("YYYY-MM-DD")
      );

  // If the data is available, the data returns an array of objects. Sort the array of objects by the `time` key, which can be a string containing the values: "morning", "afternoon", "evening", "night", "any". Sort them in the order: morning, any, afternoon, evening, night. This will ensure that the tasks are displayed in the correct order.
  const sortedTasks = !data
    ? []
    : data[0].items.filter((task) => task.durationDays - task.progress > 0);

  return data ? (
    <div
      style={{
        padding: 20,
        textAlign: "center",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          height: "100vh",
          width: "50%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        onClick={() => setCurrentIndex((i) => (i === 0 ? 0 : i - 1))}
      />
      <Box
        sx={{
          height: "100vh",
          width: "50%",
          position: "absolute",
          top: 0,
          right: 0,
        }}
        onClick={handleClose}
      />
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <picture>
          <img
            src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${
              tasksRemaining.length === 0 ? "1f389" : "1f449"
            }.png`}
            alt="Tada"
          />
        </picture>
      </Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {tasksRemaining.length === 0 ? (
          <>
            You worked towards
            <br /> {sortedTasks.length} goal{sortedTasks.length !== 1 && "s"}!
          </>
        ) : (
          <>
            You have {tasksRemaining.length} goal
            {tasksRemaining.length !== 1 && "s"} left to finish
          </>
        )}
      </Typography>
      {error && (
        <ErrorHandler
          error="Yikes! An error occured while trying to check your progress. Please try again later."
          callback={() => mutate(url)}
        />
      )}
      <Button
        onClick={handleClose}
        sx={{
          mt: 1,
          "&, &:hover": {
            background: "hsl(240,11%,20%)!important",
            color: "#fff!important",
          },
        }}
        variant="contained"
      >
        {tasksRemaining.length == 0 ? (
          <>
            <span>✌</span> Let&apos;s go &rarr;
          </>
        ) : (
          <>
            Gotcha!
            <Icon>east</Icon>
          </>
        )}
      </Button>
    </div>
  ) : (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  );
}
