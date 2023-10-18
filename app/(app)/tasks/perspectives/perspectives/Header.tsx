import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Icon,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { memo, useContext, useEffect } from "react";
import { PerspectiveContext } from ".";
import { CreateTask } from "../../../../../components/Tasks/Task/Create";
import SelectDateModal from "../../../../../components/Tasks/Task/DatePicker";
import { ColumnMenu } from "./ColumnMenu";

interface ColumnHeaderProps {
  subheading: any;
  column: any;
  isToday: any;
  sortedTasks: any;
  heading: any;
  columnEnd: any;
  columnMap: any;
}

export function HeaderSkeleton() {
  return (
    <Box
      sx={{
        px: 3,
        mt: 1,
        mb: -1,
        py: { xs: 3, sm: 4.3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Skeleton
        animation={false}
        variant="circular"
        width={30}
        height={30}
        sx={{
          flexShrink: 0,
          mr: "auto",
        }}
      />
      <Skeleton
        animation={false}
        variant="circular"
        width={35}
        height={35}
        sx={{
          borderRadius: 3,
          flexShrink: 0,
        }}
      />
      <Skeleton
        animation={false}
        variant="rectangular"
        height={35}
        width={120}
      />
      <Skeleton
        animation={false}
        variant="circular"
        width={30}
        height={30}
        sx={{
          flexShrink: 0,
          ml: "auto",
        }}
      />
    </Box>
  );
}

export const Header = memo(function Header({
  subheading,
  column,
  isToday,
  sortedTasks,
  heading,
  columnEnd,
  columnMap,
}: ColumnHeaderProps) {
  const { session } = useSession();
  const router = useRouter();
  const isDark = useDarkMode(session.darkMode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: 1,
  });

  const { mutateList, type } = useContext(PerspectiveContext);

  const isPast = dayjs(column)
    .utc()
    .startOf(columnMap)
    .isBefore(dayjs().startOf(columnMap), type);

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
      >
        <Box ref={emblaRef} style={{ width: "100dvw" }}>
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                flex: "0 0 100%",
              }}
            >
              <HeaderSkeleton />
            </Box>
            <Box sx={{ flex: "0 0 100%" }}>
              <Box
                sx={{
                  p: { xs: 2, sm: 3 },
                  pt: { xs: 2, sm: 4 },
                  maxWidth: "100dvw",
                  mb: { xs: 0, sm: 2 },
                  borderBottom: { sm: "1.5px solid" },
                  borderColor: { sm: addHslAlpha(palette[4], 0.5) },
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
                          background: { xs: palette[2], sm: "transparent" },
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
                          {dayjs(column).utc().format(heading)}
                        </Typography>

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
            <Box
              sx={{
                flex: "0 0 100%",
              }}
            >
              <HeaderSkeleton />
            </Box>
          </Box>
        </Box>
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
              onSuccess={mutateList}
              defaultDate={dayjs(column).utc().toDate()}
              sx={{ flexGrow: 1 }}
            >
              <Button variant="contained" fullWidth sx={{ width: "100%" }}>
                <Icon>add_circle</Icon>
                New task
              </Button>
            </CreateTask>
          )}
          {sortedTasks.length > 0 && (
            <ColumnMenu data={sortedTasks} day={column}>
              <Button variant="outlined" size="small">
                <Icon>more_horiz</Icon>
              </Button>
            </ColumnMenu>
          )}
        </Box>
      </motion.div>
    </Box>
  );
});
