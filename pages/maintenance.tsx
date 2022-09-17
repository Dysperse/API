import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import useSWR from "swr";
import { ErrorHandler } from "../components/ErrorHandler";
import { Reminder } from "../components/Maintenance/Reminder";
import { Header } from "../components/Maintenance/Header";
import type { Reminder as ReminderType } from "../types/maintenance";
/**
 * Top-level component for the maintenance page
 */
export default function Maintenance() {
  const url =
    "/api/property/maintenance/reminders?" +
    new URLSearchParams({
      property: global.property.propertyId,
      accessToken: global.property.accessToken,
    }).toString();
  alert(url);
  const { data, error } = useSWR(url, () => fetch(url).then((r) => r.json()));

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ px: { sm: 3 } }}>
        {data ? (
          <>
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
          </>
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
            {data.filter((reminder: ReminderType) => {
              return (
                dayjs(reminder.nextDue).isAfter(dayjs()) &&
                dayjs(reminder.nextDue).isBefore(dayjs().add(7, "day"))
              );
            }).length > 0 && (
              <Typography variant="h5" sx={{ fontWeight: "600", mb: 3 }}>
                This week
              </Typography>
            )}
            {/* Upcoming reminders */}
            {data
              .filter((reminder: ReminderType) => {
                return (
                  dayjs(reminder.nextDue).isAfter(dayjs()) &&
                  dayjs(reminder.nextDue).isBefore(dayjs().add(7, "day"))
                );
              })
              .map((reminder: ReminderType) => (
                <Reminder key={reminder.id} reminder={reminder} />
              ))}

            <Typography variant="h5" sx={{ fontWeight: "600", my: 3 }}>
              Later on
            </Typography>
            {/* Upcoming reminders */}
            {data
              .filter((reminder: ReminderType) => {
                return (
                  !(
                    dayjs(reminder.nextDue).isAfter(dayjs()) &&
                    dayjs(reminder.nextDue).isBefore(dayjs().add(7, "day"))
                  ) && !dayjs(reminder.nextDue).isBefore(dayjs())
                );
              })
              .map((reminder: ReminderType) => (
                <Reminder key={reminder.id} reminder={reminder} />
              ))}
          </>
        ) : (
          <>
            {[...new Array(5)].map((_, i) => (
              <Skeleton
                variant="rectangular"
                animation="wave"
                key={i}
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
