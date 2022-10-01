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
import { getSuggestions } from "../components/Maintenance/suggestions";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import useEmblaCarousel from "embla-carousel-react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import AutoHeight from "embla-carousel-auto-height";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Puller } from "../components/Puller";
import Autoplay from "embla-carousel-autoplay";

function Suggestion({ reactKey, suggestion, currentReminders, misc = false }) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        height: "100%",
        flex: {
          xs: "0 0 90%",
          sm: "0 0 33.333333%",
        },
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
          backgroundColor: "rgba(200,200,200,0.3)",
          borderRadius: 5,
          ml: reactKey === 0 ? -3 : 0,
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
              {suggestion.description}
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
  const trigger = useMediaQuery("(max-width: 600px)");
  const autoplay = Autoplay({ delay: 4000, stopOnLastSnap: true });

  const [emblaRef] = useEmblaCarousel(
    {
      slidesToScroll: trigger ? 1 : 3,
    },
    [WheelGesturesPlugin(), AutoHeight(), autoplay]
  );

  return (
    <Box
      sx={{
        borderRadius: 5,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mb: 2,
      }}
    >
      <div className="embla" ref={emblaRef} style={{ width: "100%" }}>
        <div
          className="embla__container"
          style={{
            width: "100%",
            gap: "10px",
            alignItems: "flex-start",
            transition: "height .2s",
          }}
        >
          {suggestions.misc.map((suggestion: any, id) => (
            <Suggestion
              key={suggestion.id}
              reactKey={id}
              currentReminders={currentReminders}
              suggestion={suggestion}
              misc
            />
          ))}
        </div>
      </div>
    </Box>
  );
}

/**
 * Top-level component for the maintenance page
 */
export default function Maintenance() {
  const { error, data }: ApiResponse = useApi("property/maintenance/reminders");
  const [viewBy, setViewBy] = useState<"all" | "upcoming">("upcoming");

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
        <Suggested currentReminders={data ? data : []} />
        <ButtonGroup
          variant="outlined"
          sx={{
            p: 0.2,
            mb: 2,
            maxWidth: { sm: "400px" },
            mx: "auto",
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
                return (
                  dayjs(reminder.nextDue).isAfter(dayjs()) &&
                  dayjs(reminder.nextDue).isBefore(dayjs().add(30, "day"))
                );
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
                  return (
                    dayjs(reminder.nextDue).isAfter(dayjs()) &&
                    dayjs(reminder.nextDue).isBefore(dayjs().add(30, "day"))
                  );
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
