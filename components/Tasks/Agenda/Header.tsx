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
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { memo, useContext } from "react";
import { AgendaContext } from ".";
import { CreateTask } from "../Task/Create";
import SelectDateModal from "../Task/DatePicker";
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

  const { mutateList, type } = useContext(AgendaContext);

  const isPast = dayjs(column).isBefore(dayjs().startOf(columnMap), type);

  return (
    <Box
      sx={{
        pt: isMobile ? "65px" : 0,
        backdropFilter: { sm: "blur(4px)" },
        position: { sm: "sticky" },
        top: 0,
        left: 0,
        maxWidth: "100dvw",
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
                <Icon className="outlined">west</Icon>
              </IconButton>
            )}
            <SelectDateModal
              disabled={!isMobile}
              date={dayjs(column).toDate()}
              setDate={(date) => {
                setTimeout(() => {
                  router.push(
                    "/tasks/agenda/days/" + dayjs(date).format("YYYY-MM-DD")
                  );
                }, 500);
              }}
              closeOnSelect
              dateOnly
            >
              <Tooltip
                placement="bottom-start"
                title={
                  <Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {isToday
                        ? "Today"
                        : capitalizeFirstLetter(dayjs(column).fromNow())}
                    </Typography>
                    <Typography variant="body2">
                      {dayjs(column).format("dddd, MMMM D, YYYY")}
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
                    {dayjs(column).format(heading)}
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
                      {dayjs(column).format(subheading)}
                      {type === "weeks" &&
                        " - " + dayjs(columnEnd).format("DD")}
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
                <Icon className="outlined">east</Icon>
              </IconButton>
            )}
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
              defaultDate={dayjs(column).startOf(type).toDate()}
              sx={{ flexGrow: 1 }}
            >
              <Button variant="contained" fullWidth sx={{ width: "100%" }}>
                <Icon>add_circle</Icon>
                New task
              </Button>
            </CreateTask>
          )}
          <ColumnMenu data={sortedTasks} day={column}>
            <Button variant="outlined" size="small">
              <Icon>more_horiz</Icon>
            </Button>
          </ColumnMenu>
        </Box>
      </motion.div>
    </Box>
  );
});
