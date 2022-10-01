import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { ErrorHandler } from "../components/ErrorHandler";
import { Header } from "../components/Maintenance/Header";
import { colors } from "../lib/colors";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Reminder } from "../components/Maintenance/Reminder";
import { useApi } from "../hooks/useApi";
import type { ApiResponse } from "../types/client";
import { MaintenanceReminder as ReminderType } from "@prisma/client";
import { useState } from "react";

/**
 * Top-level component for the maintenance page
 */
export default function Maintenance() {
  const { error, data }: ApiResponse = useApi("property/maintenance/reminders");
  const [viewBy, setViewBy] = useState<"all" | "upcoming">("all");

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ px: { sm: 3 } }}>
        {data ? (
          <div>
            {data.filter((reminder: ReminderType) =>
              dayjs(reminder.nextDue).isBefore(dayjs())
            ).length > 0 && (
              <Alert
                severity="warning"
                sx={{ mb: { sm: 3 }, borderRadius: { xs: 0, sm: 999 } }}
                variant="filled"
              >
                You have{" "}
                {
                  data.filter((reminder: ReminderType) =>
                    dayjs(reminder.nextDue).isBefore(dayjs())
                  ).length
                }{" "}
                overdue maintenance task
                {data.filter((reminder: ReminderType) =>
                  dayjs(reminder.nextDue).isBefore(dayjs())
                ).length == 1
                  ? ""
                  : "s"}
              </Alert>
            )}
          </div>
        ) : null}
      </Box>
      {/* Calculate upcoming tasks this week */}
      <Header
        count={
          data
            ? data.filter((reminder: ReminderType) => {
                return (
                  dayjs(reminder.nextDue).isAfter(dayjs()) &&
                  dayjs(reminder.nextDue).isBefore(dayjs().add(7, "day"))
                );
              }).length
            : 0
        }
      />
      <Box sx={{ p: 4 }}>
        <ButtonGroup
          variant="outlined"
          sx={{
            p: 0.2,
            mb: 2,
            borderRadius: "15px!important",
            width: "100%",
            background: `${
              colors[themeColor][global.theme !== "dark" ? 100 : 900]
            }!important`,
          }}
          aria-label="outlined primary button group"
        >
          <Button
            variant="contained"
            disableElevation
            onClick={() => setViewBy("upcoming")}
            sx={{
              px: 5,
              mr: 0.1,
              borderRadius: "15px!important",
              borderWidth: "2px!important",
              transition: "none!important",
              width: "50%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              ...(viewBy !== "upcoming" && {
                background: `${
                  colors[themeColor][global.theme !== "dark" ? 100 : 900]
                }!important`,

                color: `${
                  colors[themeColor][global.user.darkMode ? 50 : 900]
                }!important`,
              }),
            }}
          >
            Upcoming
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => setViewBy("all")}
            sx={{
              px: 5,
              borderRadius: "15px!important",
              transition: "none!important",
              width: "50%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              ...(viewBy !== "all" && {
                background: `${
                  colors[themeColor][global.theme !== "dark" ? 100 : 900]
                }!important`,
                color: `${
                  colors[themeColor][global.user.darkMode ? 50 : 900]
                }!important`,
              }),
            }}
          >
            All
          </Button>
        </ButtonGroup>
        {data ? (
          <>
            {/* Past reminders */}
            {data.filter((reminder: ReminderType) =>
              dayjs(reminder.nextDue).isBefore(dayjs())
            ).length > 0 && (
              <Typography variant="h5" sx={{ fontWeight: "600", mb: 3 }}>
                Overdue
              </Typography>
            )}
            {data
              .filter((reminder: ReminderType) =>
                dayjs(reminder.nextDue).isBefore(dayjs())
              )
              .map((reminder: ReminderType) => (
                <Reminder key={reminder.id} reminder={reminder} />
              ))}
            {/* Upcoming reminders */}
            {viewBy === "upcoming" &&
              data.filter((reminder: ReminderType) => {
                return dayjs(reminder.nextDue).isAfter(dayjs());
              }).length === 0 && (
                <Box
                  sx={{
                    p: 2,
                    background: "rgba(200,200,200,.3)",
                    borderRadius: 5,
                  }}
                >
                  You don&apos;t have any upcoming tasks
                </Box>
              )}

            {viewBy === "upcoming" &&
              data
                .filter((reminder: ReminderType) => {
                  return dayjs(reminder.nextDue).isAfter(dayjs());
                })
                .map((reminder: ReminderType) => (
                  <Reminder key={reminder.id} reminder={reminder} />
                ))}

            {viewBy === "all" &&
              data.map((reminder: ReminderType) => (
                <Reminder key={reminder.id} reminder={reminder} />
              ))}

            {viewBy === "all" && data.length === 0 && (
              <Box
                sx={{
                  p: 2,
                  background: "rgba(200,200,200,.3)",
                  borderRadius: 5,
                }}
              >
                You haven&apos;t created any reminders yet
              </Box>
            )}
          </>
        ) : (
          <>
            {[...new Array(5)].map(() => (
              <Skeleton
                variant="rectangular"
                animation="wave"
                key={Math.random().toString()}
                height={130}
                sx={{ mb: 3, borderRadius: 10 }}
              />
            ))}
          </>
        )}
        {error && (
          <ErrorHandler
            error={
              "An error occured while trying to fetch your upcoming maintenance tasks."
            }
          />
        )}
      </Box>
    </Box>
  );
}
