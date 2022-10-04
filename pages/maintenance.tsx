import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import { MaintenanceReminder as ReminderType } from "@prisma/client";
import dayjs from "dayjs";
import { useState } from "react";
import { ErrorHandler } from "../components/ErrorHandler";
import { Header } from "../components/Maintenance/Header";
import { Reminder } from "../components/Maintenance/Reminder";
import { getSuggestions } from "../components/Maintenance/suggestions";
import { Puller } from "../components/Puller";
import { useApi } from "../hooks/useApi";
import { colors } from "../lib/colors";
import type { ApiResponse } from "../types/client";

function Suggestion({ reactKey, suggestion, currentReminders, misc = false }) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        mb: 2,
      }}
    >
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            maxWidth: "700px",
            mx: "auto",
            borderRadius: "20px 20px 0 0",
            backgroundColor: colors[themeColor][900],
            color: colors[themeColor][50],
            maxHeight: "90vh",
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 3, mt: 5, overflow: "scroll" }}>
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            {suggestion.name}
          </Typography>
          <Typography sx={{ mt: 1, mb: 2, color: colors[themeColor][100] }}>
            {suggestion.description}
          </Typography>
          {suggestion.warning && (
            <Alert
              severity="warning"
              variant="filled"
              sx={{
                mb: 2,
                borderRadius: 3,
                borderWidth: "2px!important",
              }}
              // variant="outlined"
            >
              {suggestion.warning}
            </Alert>
          )}
          {suggestion.fact && (
            <Alert
              severity="info"
              variant="filled"
              sx={{
                mb: 2,
                borderRadius: 3,
                borderWidth: "2px!important",
              }}
              // variant="outlined"
            >
              {suggestion.fact}
            </Alert>
          )}
          <Typography
            sx={{
              display: "flex",
              mb: 1.5,
              gap: 1.5,
              alignItems: "center",
              mt: 3,
            }}
          >
            <span className="material-symbols-rounded">schedule</span>{" "}
            {suggestion.time} min
          </Typography>
          <Typography
            sx={{ display: "flex", mb: 1.5, gap: 1.5, alignItems: "center" }}
          >
            <span className="material-symbols-rounded">today</span>{" "}
            {suggestion.frequency}
          </Typography>
          <Typography
            sx={{
              textTransform: "capitalize",
              display: "flex",
              gap: 1.5,
              mb: 1.5,
              alignItems: "center",
            }}
          >
            <span className="material-symbols-rounded">lightbulb</span>{" "}
            {suggestion.difficulty}
          </Typography>
          <Typography
            sx={{
              textTransform: "capitalize",
              display: "flex",
              gap: 1.5,
              mb: 1.5,
              alignItems: "center",
            }}
          >
            <span className="material-symbols-rounded">payments</span> $
            {suggestion.cost}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Materials needed
          </Typography>
          {suggestion.supplies.map((item) => (
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                gap: 1.5,
                my: 1,
                alignItems: "center",
                textTransform: "capitalize",
              }}
            >
              <span className="material-symbols-outlined">
                radio_button_unchecked
              </span>{" "}
              {item}
            </Typography>
          ))}

          {suggestion.steps && (
            <>
              {
                <>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Steps
                  </Typography>
                  {suggestion.steps.map((item) => (
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        my: 1,
                        alignItems: "center",
                      }}
                    >
                      <span className="material-symbols-outlined">
                        radio_button_unchecked
                      </span>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Typography>
                  ))}
                </>
              }
            </>
          )}
        </Box>
      </SwipeableDrawer>
      <Card
        sx={{
          height: "100%",
          width: "100%",
          backgroundColor: colors.orange[50],
          color: colors.orange[900],
          borderRadius: 5,
        }}
      >
        <CardActionArea
          onClick={() => setOpen(true)}
          sx={{
            height: "100%",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {suggestion.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {suggestion.description.length > 55
                ? suggestion.description.slice(0, 55) + "..."
                : suggestion.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}

/**
 * Suggested maintenance reminders
 */
function Suggested({ currentReminders }: { currentReminders: ReminderType[] }) {
  const suggestions = getSuggestions();

  return (
    <Box>
      {suggestions.misc.map((suggestion: any, id) => (
        <Suggestion
          key={suggestion.id}
          reactKey={id}
          currentReminders={currentReminders}
          suggestion={suggestion}
          misc
        />
      ))}
    </Box>
  );
}

/**
 * Top-level component for the maintenance page
 */
export default function Maintenance() {
  const { error, data }: ApiResponse = useApi("property/maintenance/reminders");

  const [currentDate, setCurrentDate] = useState(dayjs().format("MM/DD/YYYY"));

  return (
    <Box sx={{ mb: 4 }}>
      <Header
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        data={data}
      />
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
      <Box sx={{ p: 3 }}>
        {data ? (
          <>
            <Typography
              sx={{
                my: 1,
                fontWeight: "600",
              }}
              variant="h6"
            >
              {dayjs(new Date(currentDate).toISOString()).format(
                "MMMM D, YYYY"
              )}
            </Typography>
            {data
              .filter(
                (reminder: ReminderType) =>
                  dayjs(reminder.lastDone.toString().split("T")[0]).format(
                    "MM/DD/YYYY"
                  ) ===
                  dayjs(new Date(currentDate).toISOString()).format(
                    "MM/DD/YYYY"
                  )
              )
              .map((reminder: ReminderType) => (
                <Reminder key={reminder.id} reminder={reminder} />
              ))}

            {data.filter(
              (reminder: ReminderType) =>
                dayjs(reminder.lastDone.toString().split("T")[0]).format(
                  "MM/DD/YYYY"
                ) ===
                dayjs(new Date(currentDate).toISOString()).format("MM/DD/YYYY")
            ).length === 0 && (
              <Box
                sx={{
                  borderRadius: 5,
                  background: "rgba(200,200,200,.3)",
                  p: 3,
                  mb: 4,
                }}
              >
                Great job! You don&apos;t have any maintenance tasks today!
              </Box>
            )}

            {data.filter((reminder: ReminderType) =>
              dayjs(reminder.nextDue).isBefore(dayjs())
            ).length > 0 && (
              <Typography
                sx={{
                  my: 1,
                  color: colors.red[900],
                  fontWeight: "600",
                }}
                variant="h6"
              >
                Overdue maintenance tasks
              </Typography>
            )}
            {data
              .filter((reminder: ReminderType) =>
                dayjs(reminder.nextDue).isBefore(dayjs())
              )
              .map((reminder: ReminderType) => (
                <Reminder key={reminder.id} reminder={reminder} />
              ))}

            {/* Get reminders to the currentDate*/}
            {data
              .filter((reminder: ReminderType) =>
                dayjs(reminder.nextDue).isSame(dayjs(currentDate), "day")
              )
              .map((reminder: ReminderType) => (
                <Reminder key={reminder.id} reminder={reminder} />
              ))}

            <Typography
              variant="h6"
              sx={{ fontWeight: "600", mb: 1, color: colors.orange[900] }}
            >
              Suggested
            </Typography>
            <Suggested currentReminders={data ? data : []} />
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
