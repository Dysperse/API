import { useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useRef } from "react";
import { ErrorHandler } from "../../Error";
import { CreateRoutine } from "./Create";
import { Routine } from "./Routine";

export function Routines({ isCoach = false }: any) {
  const { data, url, error } = useApi("user/routines/custom-routines");
  const ref: any = useRef();

  const loading = (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "center", sm: "" },
        overflowX: "hidden",
        ...(isCoach && { flexDirection: { sm: "column" }, mt: { sm: -4 } }),
        px: { xs: 2, sm: isCoach ? 1 : 4 },
      }}
    >
      {[...new Array(7)].map((_, i) =>
        isCoach ? (
          <Box
            key={i}
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
        ) : (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: isCoach ? "row" : "column",
              gap: isCoach ? 2 : 0,
              p: 1,
              ...(isCoach && {
                width: "100%",
              }),
            }}
          >
            <Skeleton
              variant="circular"
              width={58}
              height={58}
              animation={false}
              sx={{ flexShrink: 0 }}
            />
            <Skeleton width={isCoach ? "100%" : 60} animation={false} />
          </Box>
        )
      )}
    </Box>
  );

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
            px: isCoach ? 0 : { xs: 2, sm: 4 },
          }}
        >
          {data?.length === 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                ...(isCoach && {
                  width: "100%",
                  mb: 2,
                }),
                flexDirection: isCoach ? "column" : "row",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "100%",
                  flexDirection: "column",
                  display: "flex",
                  zIndex: 9,
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  transform: "translate(-50%,-50%)",
                }}
              >
                Routines will appear here
                <Button
                  size="small"
                  sx={{ color: "inherit" }}
                  onClick={() => ref.current?.click()}
                >
                  Create one
                </Button>
              </Typography>
              {[...new Array(4)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: isCoach ? "row" : "column",
                    gap: isCoach ? 2 : 0,
                    p: 1,
                    ...(isCoach && {
                      width: "100%",
                    }),
                  }}
                >
                  <Skeleton
                    variant="circular"
                    width={58}
                    height={58}
                    animation={false}
                    sx={{ filter: "blur(5px)", flexShrink: 0 }}
                  />
                  <Skeleton
                    width={isCoach ? "100%" : 60}
                    animation={false}
                    sx={{ filter: "blur(5px)" }}
                  />
                </Box>
              ))}
            </Box>
          )}
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
          <CreateRoutine mutationUrl={url} isCoach={isCoach} buttonRef={ref} />
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
