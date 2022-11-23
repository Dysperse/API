import Box from "@mui/material/Box";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Year } from "./Year";

export function Calendar() {
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
    <Box>
      <Box ref={emblaRef}>
        <div
          className="embla__container"
          style={{ gap: "10px", paddingLeft: "25px" }}
        >
          <Year year={new Date().getFullYear()} />
          {Array.from({ length: 75 }).map((_, index) => (
            <Year key={index} year={index + new Date().getFullYear() + 1} />
          ))}
        </div>
      </Box>
    </Box>
  );
}
