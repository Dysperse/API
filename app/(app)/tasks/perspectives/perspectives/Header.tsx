import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Icon,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { memo, useContext, useEffect, useMemo } from "react";
import { PerspectiveContext } from ".";
import { CreateTask } from "../../Task/Create";
import SelectDateModal from "../../Task/DatePicker";
import { ColumnMenu } from "./ColumnMenu";
import { HeaderSkeleton } from "./HeaderSkeleton";

interface ColumnHeaderProps {
  column: any;
  isToday: any;
  sortedTasks: any;
  columnEnd: any;
  type: string;
}

export const Header = memo(function Header({
  column,
  isToday,
  sortedTasks,
  columnEnd,
}: ColumnHeaderProps) {
  const { session } = useSession();
  const router = useRouter();
  const isDark = useDarkMode(session.darkMode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: 1,
    active: isMobile,
  });

  const { mutateList, type } = useContext(PerspectiveContext);

  const heading = {
    days: "DD",
    weeks: "#W",
    months: "MMMM",
  }[type];

  const columnMap = {
    days: "day",
    weeks: "week",
    months: "month",
  }[type];

  const subheading = {
    days: "dddd",
    weeks: "D",
    months: "-",
  }[type];

  const isPast = useMemo(
    () =>
      dayjs(column)
        .utc()
        .startOf(columnMap)
        .isBefore(dayjs().startOf(columnMap), type),
    [column, columnMap, type]
  );

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("scroll", (e) => {
        if (e.selectedScrollSnap() == 0) {
          document.getElementById("agendaPrev")?.click();
        } else if (e.selectedScrollSnap() === 2) {
          document.getElementById("agendaNext")?.click();
        }
      });
    }
  }, [emblaApi]);

  return (
    <Box
      className="header"
      sx={{
        pt: isMobile ? "65px" : 0,
        backdropFilter: { sm: "blur(4px)" },
        position: { sm: "sticky" },
        top: 0,
        left: 0,
        maxWidth: "100dvw",
        display: "flex",
        background: { sm: addHslAlpha(palette[1], 0.7) },
        zIndex: 99,
        transition: "all .5s",
        ...(/\bCrOS\b/.test(navigator.userAgent) && {
          background: palette[1],
          backdropFilter: "none",
        }),
      }}
    >
      <motion.div
        key="header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ width: "100%" }}
      >
        <Box
          ref={emblaRef}
          sx={{ width: { xs: "100dvw", sm: "100%" }, overflow: "hidden" }}
        >
          <Box sx={{ display: "flex" }}>
            {isMobile && (
              <Box
                sx={{
                  flex: "0 0 100%",
                }}
              >
                <HeaderSkeleton />
              </Box>
            )}
            <Box sx={{ flex: "0 0 100%" }}>
              <Box
                sx={{
                  p: { xs: 2, sm: 3 },
                  pt: { xs: 2, sm: 4 },
                  maxWidth: "100dvw",
                  mb: { xs: 0, sm: 2 },
                  borderBottom: { sm: "2px solid" },
                  borderColor: { sm: addHslAlpha(palette[4], 0.8) },
                  height: "auto",
                }}
                ref={emblaRef}
                id="taskMutationTrigger"
                onClick={() => mutateList()}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isMobile && (
                    <IconButton
                      size="large"
                      sx={{ color: palette[8], p: 3 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById("agendaPrev")?.click();
                      }}
                    >
                      <Icon className="outlined">arrow_back_ios_new</Icon>
                    </IconButton>
                  )}
                  <SelectDateModal
                    disabled={!isMobile}
                    date={dayjs(column).utc().toDate()}
                    setDate={(date) => {
                      setTimeout(() => {
                        router.push(
                          "/tasks/perspectives/days/" +
                            dayjs(date).utc().format("YYYY-MM-DD")
                        );
                      }, 500);
                    }}
                    closeOnSelect
                    dateOnly
                  >
                    <Tooltip
                      {...(isMobile && { hidden: true })}
                      placement="bottom"
                      title={
                        <Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {isToday
                              ? "Today"
                              : capitalizeFirstLetter(
                                  dayjs(column).utc().fromNow()
                                )}
                          </Typography>
                          <Typography variant="body2">
                            {dayjs(column).utc().format("dddd, MMMM D, YYYY")}
                          </Typography>
                        </Typography>
                      }
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mx: "auto",
                          justifyContent: "cneter",
                          gap: 2,
                          maxWidth: "100%",
                          overflow: "hidden",
                          minWidth: 0,
                          background: { xs: palette[3], sm: "transparent" },
                          p: 1,
                          borderRadius: 3,
                          "&:active": {
                            opacity: { xs: 0.6, sm: 1 },
                          },
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            ...(isToday
                              ? {
                                  color: "#000!important",
                                  background: `linear-gradient(${palette[7]}, ${palette[9]})`,
                                  px: 0.5,
                                }
                              : {
                                  background: `linear-gradient(${palette[4]}, ${palette[4]})`,
                                  px: 0.5,
                                }),
                            borderRadius: 1,
                            width: "auto",
                            display: "inline-flex",
                            flexShrink: 0,
                            alignItems: "center",
                            justifyContent: "center",
                            ...(isPast && { opacity: 0.5 }),
                          }}
                        >
                          <span style={{ fontWeight: "600" }}>
                            {dayjs(column).utc().format(heading)}
                          </span>
                        </Typography>

                        {subheading !== "-" && (
                          <Typography
                            variant="h5"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "500",
                                ...(isPast && {
                                  textDecoration: "line-through",
                                  ...(isPast && { opacity: 0.5 }),
                                }),
                              }}
                            >
                              {dayjs(column).utc().format(subheading)}
                              {type === "weeks" &&
                                " - " + dayjs(columnEnd).utc().format("DD")}
                            </span>
                          </Typography>
                        )}
                      </Box>
                    </Tooltip>
                  </SelectDateModal>
                  {isMobile && (
                    <IconButton
                      size="large"
                      sx={{ color: palette[8], p: 3 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById("agendaNext")?.click();
                      }}
                    >
                      <Icon className="outlined">arrow_forward_ios</Icon>
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
            {isMobile && (
              <Box
                sx={{
                  flex: "0 0 100%",
                }}
              >
                <HeaderSkeleton />
              </Box>
            )}
          </Box>
        </Box>
        {sortedTasks.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              px: 3,
              pb: 2,
              justifyContent: "center",
            }}
          >
            {session.permission !== "read-only" && (
              <CreateTask
                onSuccess={()=>mutateList()}
                defaultDate={dayjs(column).utc().toDate()}
                sx={{ flexGrow: 1 }}
              >
                <Button variant="contained" fullWidth sx={{ width: "100%" }}>
                  <Icon>add_circle</Icon>
                  New task
                </Button>
              </CreateTask>
            )}
            {isMobile ? (
              <ColumnMenu data={sortedTasks} day={column}>
                <Button variant="outlined" size="small">
                  <Icon>more_horiz</Icon>
                </Button>
              </ColumnMenu>
            ) : (
              <ColumnMenu data={sortedTasks} day={column}>
                <IconButton
                  className="desktopColumnMenu"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    transition: "opacity .2s",
                    m: 2,
                    background: palette[3],
                  }}
                >
                  <Icon>more_vert</Icon>
                </IconButton>
              </ColumnMenu>
            )}
          </Box>
        )}
      </motion.div>
    </Box>
  );
});
