import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Circle } from "./Circle";

export function Year({ year }) {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#eee",
        border: "1px solid #eee",
        ...(year === new Date().getFullYear() && {
          borderColor: "#606060",
        }),
        p: 2,
        borderRadius: 5,
      }}
    >
      <Box
        sx={{
          // width: progress in a year
          ...(year === new Date().getFullYear() && {
            width: `${
              ((new Date().getTime() % 31556952000) / 31556952000) * 100
            }%`,
          }),
          backgroundColor: "#aaa",
          position: "absolute",
          height: "100%",
          top: 0,
          left: 0,
          opacity: 0.2,
          pointerEvents: "none",
          borderRadius: 5,
        }}
      />
      <Box sx={{ display: "flex" }}>
        <Typography
          variant="body2"
          sx={{
            textTransform: "uppercase",
            mb: 1,
          }}
        >
          {year}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            ml: "auto",
            textTransform: "uppercase",
            mb: 1,
          }}
        >
          {year - 2008} years
        </Typography>
      </Box>
      <Box
        sx={{
          gap: 1,
          display: "flex",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <Circle key={i} year={year} number={i} />
        ))}
      </Box>
    </Box>
  );
}
