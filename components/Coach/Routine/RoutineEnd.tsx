import { Box, Button, Typography } from "@mui/material";

export function RoutineEnd({
  setCurrentIndex,
  sortedTasks,
  tasksRemaining,
  handleClose,
}) {
  return (
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
        onClick={() => setCurrentIndex((i) => (i == 0 ? 0 : i - 1))}
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
      {tasksRemaining == 0 ? (
        <>
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
                src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f389.png"
                alt="Tada"
              />
            </picture>
          </Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            You worked towards
            <br /> {sortedTasks.length} goal{sortedTasks.length !== 1 && "s"}!
          </Typography>
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
            <span>✌</span> Let&apos;s go &rarr;
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h1" gutterBottom>
            👉
          </Typography>
          <Typography variant="h6">
            You have {tasksRemaining.length} goal
            {tasksRemaining.length !== 1 && "s"} left to finish
          </Typography>
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
            <span>🎯</span> Gotcha &rarr;
          </Button>
        </>
      )}
    </div>
  );
}
