import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Year } from "./Year";
import dayjs from "dayjs";

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
  // List 1 day previous and 10 day after relative to today
  const days = Array.from({ length: 100 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i - 2);
    return date;
  });

  return (
    <Box className="max-w-[100vw]">
      <Box ref={emblaRef}>
        <div
          className="embla__container"
          style={{ gap: "10px", paddingLeft: "15px" }}
        >
          {days.map((day) => (
            <div key={day.getTime()}>
              <div
                className={
                  "relative p-4 rounded-2xl px-5 h-15 text-center select-none cursor-pointer active:scale-95 transition-transform active:duration-[0s] active:opacity-70 overflow-hidden  " +
                  (dayjs(day).format("YYYY-MM-DD") ===
                  dayjs().format("YYYY-MM-DD")
                    ? "bg-gray-300"
                    : "bg-gray-200")
                }
              >
                <h5 className="text-uppercase text-xs font-light">
                  {dayjs(day).format("ddd")}
                </h5>
                <h5 className="text-uppercase text-lg font-medium font-secondary">
                  {dayjs(day).format("D")}
                </h5>
              </div>
            </div>
          ))}
        </div>
      </Box>
    </Box>
  );
}
