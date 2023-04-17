import { Box, Skeleton } from "@mui/material";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useRouter } from "next/router";
import { useApi } from "../../../lib/client/useApi";
import { useSession } from "../../../lib/client/useSession";
import { ErrorHandler } from "../../Error";
import { CreateRoutine } from "./Create";
import { Routine } from "./Routine";

export function Routines({ isCoach = false }: any) {
  const { data, url, error } = useApi("user/routines/custom-routines");

  const loading = (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "center", sm: "" },
        overflowX: "hidden",
        flexDirection: { sm: "column" },
        gap: 2,
        px: { xs: 2, sm: 1 },
        mt: { sm: -4 },
        mb: 2,
      }}
    >
      {[...new Array(7)].map((_, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Skeleton
            variant="circular"
            animation="wave"
            height={65}
            width={65}
            sx={{ flexShrink: 0 }}
          />
          <Skeleton sx={{ width: "100%" }} animation="wave" />
        </Box>
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

  const sorted =
    data &&
    data.sort((a, b) => {
      const currentHour = new Date().getHours();

      const diffA = Math.abs(a.timeOfDay - currentHour);
      const diffB = Math.abs(b.timeOfDay - currentHour);
      return diffA - diffB;
    });

  const session = useSession();

  return (
    <Box
      sx={{
        overflow: isCoach ? { md: "scroll" } : "scroll",
        maxWidth: "100vw",
        flexGrow: 1,
        postition: "relative",
        borderRadius: 3,
      }}
    >
      {isCoach && (
        <Box
          sx={{
            width: "100%",
            display: { xs: "none!important", sm: "block!important" },
            height: 25,
            background: `linear-gradient(180deg, hsl(240,11%,${
              session.user.darkMode ? 15 : 93
            }%), transparent)`,
            zIndex: 999,
            position: "sticky",
            top: 0,
            left: 0,
          }}
        />
      )}
      {isCoach && (
        <Box
          sx={{
            width: "100%",
            display: { xs: "none!important", sm: "block!important" },
            height: 25,
            background: `linear-gradient(180deg, transparent, hsl(240,11%,${
              session.user.darkMode ? 15 : 93
            }%))`,
            zIndex: 999,
            position: "sticky",
            top: "calc(100% - 25px)",
            left: 0,
          }}
        />
      )}
      {data ? (
        <Box
          sx={{
            display: "flex",
            ...(isCoach && { mt: { xs: 2, md: -5 } }),
            alignItems: "center",
            ...(isCoach && {
              flexDirection: "column",
            }),
            gap: isCoach ? 0 : 1,
            px: isCoach ? 0 : 3,
            mb: 2,
          }}
        >
          {[
            ...sorted.filter(
              (routine) => JSON.parse(routine.daysOfWeek)[dayjs().day()]
            ),
            ...sorted.filter(
              (routine) => !JSON.parse(routine.daysOfWeek)[dayjs().day()]
            ),
          ].map((routine) => (
            <Routine
              routine={routine}
              key={routine.id}
              mutationUrl={url}
              isCoach={isCoach}
            />
          ))}
          <CreateRoutine
            mutationUrl={url}
            emblaApi={emblaApi}
            isCoach={isCoach}
          />
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
