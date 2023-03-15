import { Box, Skeleton } from "@mui/material";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useRouter } from "next/router";
import { useApi } from "../../../hooks/useApi";
import { ErrorHandler } from "../../Error";
import { DailyRoutine } from "../DailyRoutine";
import { CreateRoutine } from "./CreateRoutine";
import { Routine } from "./Routine";

export function Routines() {
  const { data, url, error } = useApi("user/routines/custom-routines");
  const loading = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        overflowX: "hidden",
        gap: 2,
        px: 2,
        mb: 2,
      }}
    >
      {[...new Array(20)].map((_, index) => (
        <Skeleton
          key={index}
          variant="circular"
          animation="wave"
          height={65}
          width={65}
          sx={{ flexShrink: 0 }}
        />
      ))}
    </Box>
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
      containScroll: "trimSnaps",
      loop: false,
    },
    [WheelGesturesPlugin()]
  );
  const router = useRouter();
  return (
    <Box
      ref={emblaRef}
      sx={{
        maxWidth: "100vw",
      }}
      className="embla"
    >
      {data ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ...(router.asPath === "/zen" && {
              justifyContent: { md: "center" },
            }),
            gap: 1,
            px: 2,
            mb: 2,
          }}
        >
          <DailyRoutine />
          {[
            ...data.filter(
              (routine) => JSON.parse(routine.daysOfWeek)[dayjs().day()]
            ),
            ...data.filter(
              (routine) => !JSON.parse(routine.daysOfWeek)[dayjs().day()]
            ),
          ]
            .sort((a, b) => {
              if (a.timeOfDay < b.timeOfDay) {
                return -1;
              }
              if (a.timeOfDay > b.timeOfDay) {
                return 1;
              }
              return 0;
            })
            .map((routine) => (
              <Routine routine={routine} key={routine.id} mutationUrl={url} />
            ))}
          <CreateRoutine mutationUrl={url} emblaApi={emblaApi} />
        </Box>
      ) : (
        loading
      )}
      {error && (
        <ErrorHandler error="Oh no! An error occured while trying to fetch your routines! Please try again later." />
      )}
    </Box>
  );
}
