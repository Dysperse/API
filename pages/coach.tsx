import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

const Circle = () => (
  <Box
    sx={{
      width: "7px",
      height: "7px",
      flex: "0 0 auto",
      borderRadius: "50%",
      backgroundColor: "#aaa",
    }}
  />
);
const Year = ({ year }) => (
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
        18 years
      </Typography>
    </Box>
    <Box
      sx={{
        gap: 1,
        display: "flex",
      }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <Circle key={i} />
      ))}
    </Box>
  </Box>
);

export default function Coach() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      containScroll: "keepSnaps",
      dragFree: true,
      align: "center",
    },
    [WheelGesturesPlugin()]
  );
  return (
    <Box
      sx={{
        mt: 5,
      }}
    >
      <Box ref={emblaRef}>
        <div className="embla__container" style={{ gap: "10px" }}>
          <Year year={new Date().getFullYear()} />
          {Array.from({ length: 75 }).map((_, index) => (
            <Year key={index} year={index + new Date().getFullYear() + 1} />
          ))}
        </div>
      </Box>
    </Box>
  );
}
