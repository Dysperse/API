import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Circle } from "./Circle";

export function Year({ year }) {
  return (
    <div
      className={
        "relative p-4 rounded-xl " +
        (year === new Date().getFullYear() ? "bg-gray-200" : "bg-gray-100")
      }
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
        <h5 className="text-uppercase text-sm font-medium">{year}</h5>
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
    </div>
  );
}
