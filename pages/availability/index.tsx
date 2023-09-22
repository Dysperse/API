import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { containerRef } from "@/components/Layout";
import { Puller } from "@/components/Puller";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { vibrate } from "@/lib/client/vibration";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Icon,
  IconButton,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { DateCalendar, DatePicker, PickersDay } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { cloneElement, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";

function InviteAvailability({ children, event }) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);

  const trigger = cloneElement(children, {
    onClick: () => setOpen(true),
  });

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
      >
        <Puller showOnDesktop />
        <Box sx={{ p: 3 }}>
          <Typography variant="h3" className="font-heading">
            Invite
          </Typography>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

function CustomDateSelector({
  setStartDate,
  setEndDate,
  setExcludingDates,
  setExcludingHours,
  startDate,
  endDate,
  excludingDates,
  excludingHours,
  chipStyles,
}) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);
  const [excludeCalendarDatesOpen, setExcludeCalendarOpen] = useState(false);

  return (
    <>
      <Chip
        sx={chipStyles}
        icon={<Icon sx={{ ml: "18px!important" }}>tune</Icon>}
        onClick={() => setOpen(true)}
      />
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
      >
        <SwipeableDrawer
          anchor="bottom"
          open={excludeCalendarDatesOpen}
          onClose={() => setExcludeCalendarOpen(false)}
        >
          <Puller />
          <DateCalendar
            minDate={startDate}
            maxDate={endDate}
            value={null}
            slots={{
              day:
                // show indicator <Badge /> if date is excluded
                ({ day, ...rest }) => {
                  const isExcluded = excludingDates.includes(day.toISOString());

                  return (
                    <Badge
                      badgeContent={
                        isExcluded ? <Icon sx={{ mx: -1 }}>close</Icon> : 0
                      }
                      color="error"
                      sx={{
                        ...(isExcluded && {
                          opacity: 0.5,
                        }),
                      }}
                    >
                      <PickersDay
                        {...rest}
                        day={day}
                        onClick={() => {
                          if (excludingDates.includes(day.toISOString())) {
                            setExcludingDates(
                              excludingDates.filter(
                                (d) => d !== day.toISOString()
                              )
                            );
                          } else {
                            setExcludingDates([
                              ...excludingDates,
                              day.toISOString(),
                            ]);
                          }
                        }}
                        sx={{
                          ...(isExcluded && {
                            background: palette[9] + "!important",
                            color: palette[1] + "!important",
                          }),
                        }}
                      />
                    </Badge>
                  );
                },
            }}
          />
        </SwipeableDrawer>
        <Puller showOnDesktop />
        <Box sx={{ p: 3, pt: 0 }}>
          <Typography variant="h4" className="font-heading">
            Custom
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Typography>Measure availability from...</Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 2 }}>
              <DatePicker
                minDate={dayjs()}
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  setExcludingDates(
                    excludingDates.filter((date) =>
                      dayjs(date).isAfter(newValue)
                    )
                  );
                }}
              />
              <Box
                sx={{
                  background: palette[5],
                  width: 40,
                  height: 40,
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  borderRadius: 999,
                }}
              >
                to
              </Box>
              <DatePicker
                minDate={startDate}
                maxDate={dayjs().add(1, "month")}
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                  // Remove excluding dates that are after the new end date
                  setExcludingDates(
                    excludingDates.filter((date) =>
                      dayjs(date).isBefore(newValue)
                    )
                  );
                }}
              />
            </Box>
          </Box>
          {dayjs(endDate).diff(dayjs(startDate), "day") >= 1 && (
            <motion.div initial={{ y: 10 }} animate={{ y: 0 }}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography>Exclude dates...</Typography>
                <Button
                  onClick={() => setExcludeCalendarOpen(true)}
                  sx={{ ml: "auto" }}
                  variant="contained"
                  size="small"
                >
                  {excludingDates.length} date
                  {excludingDates.length !== 1 && "s"}
                </Button>
              </Box>
            </motion.div>
          )}
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography>Exclude hours...</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 1,
                gap: 2,
                overflowX: "scroll",
                mx: -3,
                px: 3,
              }}
            >
              {[...new Array(24)].map((_, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    if (excludingHours.includes(index + 1)) {
                      setExcludingHours(
                        excludingHours.filter((h) => h !== index + 1)
                      );
                    } else {
                      setExcludingHours([...excludingHours, index + 1]);
                    }
                  }}
                  sx={{
                    width: 45,
                    height: 45,
                    flexShrink: 0,
                    borderRadius: 99,
                    display: "flex",
                    fontSize: "13px",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      palette[excludingHours.includes(index + 1) ? 9 : 3],
                  }}
                >
                  {(index + 1) % 12 === 0 ? 12 : (index + 1) % 12}
                  {index < 11 || index > 21 ? "AM" : "PM"}
                </Box>
              ))}
            </Box>
          </Box>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => setOpen(false)}
          >
            <Icon>check</Icon>Done
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

function EventCard({ mutate, index, event }) {
  const router = useRouter();
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const [loading, setLoading] = useState(false);

  const createdRecently = useMemo(
    () =>
      dayjs().diff(dayjs(event.createdAt), "minute") < 15 &&
      event.createdBy == session.user.identifier &&
      index === 0,
    [event, session, index]
  );

  const handleShare = () => {
    navigator.share({
      url: `https://${window.location.hostname}/availability/${event.id}`,
    });
  };

  return (
    <Box key={event.id} sx={{ pb: 2, maxWidth: "500px", mx: "auto" }}>
      <motion.div
        initial={{ opacity: 0, ...(createdRecently && { scale: 0 }) }}
        animate={{ opacity: 1, ...(createdRecently && { scale: 1 }) }}
      >
        <Box
          sx={{
            borderRadius: 5,
            background: palette[3],
            color: palette[11],
            height: "220px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h4"
                className="font-heading"
                sx={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {event.name}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.6 }}>
                {dayjs(event.startDate).format("MMM D, YYYY")} -{" "}
                {dayjs(event.endDate).format("MMM D, YYYY")}
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                setLoading(true);
                vibrate(50);
                router.push(`/availability/${event.id}`);
              }}
              sx={{
                ml: "auto",
                flexShrink: 0,
                color: palette[11],
                background: palette[4] + "!important",
              }}
            >
              {loading ? (
                <CircularProgress sx={{ opacity: 0.5 }} />
              ) : (
                <Icon sx={{ transform: "rotate(45deg)" }}>north</Icon>
              )}
            </IconButton>
          </Box>

          <Box
            sx={{
              borderTop: `2px solid ${palette[4]}`,
              p: 3,
              py: 2,
              mt: "auto",
              display: "flex",
              gap: 2,
            }}
          >
            <ConfirmationModal
              callback={async () => {
                await fetchRawApi(session, "availability/delete", {
                  id: event.id,
                });
                await mutate();
              }}
              title="Delete event?"
              question="You won't be able to see responses. Others won't be able to respond as well"
            >
              <IconButton sx={{ opacity: 0.6, color: palette[8] }}>
                <Icon className="outlined">remove_circle</Icon>
              </IconButton>
            </ConfirmationModal>
            <InviteAvailability event={event}>
              <Button
                sx={{
                  ml: "auto",
                  borderWidth: "2px!important",
                  color: palette[8] + "!important",
                  ...(createdRecently && {
                    borderColor: palette[9] + "!important",
                    color: palette[9] + "!important",
                  }),
                }}
                variant="outlined"
              >
                Invite
              </Button>
            </InviteAvailability>
            <Button
              sx={{
                background: palette[4] + "!important",
                ...(createdRecently && {
                  "&, &:hover": {
                    background: palette[9] + "!important",
                  },
                  "&:active": {
                    background: `${palette[10]}!important`,
                  },
                  color: palette[1] + "!important",
                }),
              }}
              variant="contained"
              onClick={handleShare}
            >
              Share
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}

function CreateAvailability({ mutate, setShowMargin }) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs().endOf("day"));
  const [excludingDates, setExcludingDates] = useState<any[]>([]);
  const [excludingHours, setExcludingHours] = useState<number[]>([]);

  const [name, setName] = useState(
    `${session.user?.name?.split(" ")[0]}'s meeting`
  );

  const [showCloseAnimation, setShowCloseAnimation] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const chipStyles = {
    background: palette[4],
  };

  const handleSubmit = async () => {
    try {
      containerRef?.current?.scrollTo(0, 0);
      setSubmitted(true);

      if (endDate.isBefore(startDate)) {
        toast.error("Start date must be before end date");
        throw new Error("");
      }

      if (!name.trim()) {
        toast.error("Set a name for this event");
        throw new Error("");
      }

      if (excludingHours.length == 24) {
        toast.error("You can't exclude all hours in a day");
        throw new Error("");
      }

      await fetchRawApi(session, "availability/create", {
        name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        excludingDates: JSON.stringify(excludingDates),
        excludingHours: JSON.stringify(excludingHours),
        timeZone: session.user.timeZone,
      });
      await mutate();
      setShowCloseAnimation(false);
      setShowMargin(false);
      setSubmitted(false);
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setShowCloseAnimation(true);
        }, 200);
      }, 600);
    } catch (e) {
      toast.error("Something went wrong. Please try again later");
      setSubmitted(false);
    }
  };

  useEffect(() => {
    setShowMargin(submitted);
  }, [submitted, setShowMargin]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    e.preventDefault();
    setTouchEnd(null);
    setTouchStart(e.nativeEvent.touches[0].pageY);
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    setTouchEnd(e.nativeEvent.touches[0].pageY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    if (touchStart - touchEnd > minSwipeDistance) {
      setOpen(true);
    }
  };

  const todayStart = dayjs().startOf("day");
  const todayEnd = dayjs().endOf("day");
  const monthStart = dayjs().startOf("month");
  const weekStart = dayjs().startOf("week");
  const daysInMonth = dayjs().daysInMonth();

  const templates = {
    Today: {
      startDate: todayStart,
      endDate: todayEnd,
      excludingDates: [],
    },
    "This weekend": {
      startDate: weekStart.add(6, "day"),
      endDate: weekStart.add(7, "day"),
      excludingDates: [],
    },
    "Weekends this month": {
      startDate: monthStart,
      endDate: dayjs().endOf("month"),
      excludingDates: [...new Array(daysInMonth)]
        .map((_, index) => monthStart.add(index, "day"))
        .filter((day) => ![0, 6].includes(day.day()))
        .map((day) => day.toISOString()),
    },
    "Weekdays this month": {
      startDate: monthStart,
      endDate: dayjs().endOf("month"),
      excludingDates: [...new Array(daysInMonth)]
        .map((_, index) => monthStart.add(index, "day"))
        .filter((day) => [0, 6].includes(day.day()))
        .map((day) => day.toISOString()),
    },
  };

  return (
    <>
      <Box
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        sx={{
          zIndex: 999,
          position: "fixed",
          bottom: !open ? 0 : "-100px",
          width: "100%",
          textAlign: "center",
          left: "50%",
          transform: "translateX(-50%)",
          maxWidth: "550px",
          background: addHslAlpha(palette[4], 0.8),
          backdropFilter: "blur(10px)",
          overflow: "hidden",
          maxHeight: submitted ? "100px" : "100px",
          borderRadius: "20px 20px 0 0",
          transition: "bottom .4s cubic-bezier(.17,.67,.08,1)!important",
          "&:active": {
            background: addHslAlpha(palette[5], 0.8),
          },
        }}
        onClick={() => {
          setOpen(true);
          vibrate(50);
        }}
      >
        <Puller
          showOnDesktop
          sx={{
            "& .puller": {
              background: palette[6],
            },
          }}
        />
        <Typography
          variant="h4"
          sx={{
            pb: 3,
            px: 3,
            mt: -1,
            color: palette[11],
          }}
        >
          <span className="font-heading" style={{ fontWeight: 300 }}>
            Gather availability
          </span>
          <Icon
            sx={{
              ...(open && {
                ml: -3.5,
                opacity: 0,
              }),
              transition: "all .4s cubic-bezier(.17,.67,.08,1)!important",
            }}
          >
            arrow_forward_ios
          </Icon>
        </Typography>
      </Box>
      <SwipeableDrawer
        disableEscapeKeyDown={submitted}
        sx={{
          ...(!showCloseAnimation && {
            display: "none!important",
          }),
        }}
        disableScrollLock
        anchor="bottom"
        open={open}
        onClose={() => {
          setSubmitted(false);
          setOpen(false);
          vibrate(50);
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "none!important",
              ...(submitted && { opacity: "0!important" }),
            },
          },
        }}
        PaperProps={{
          sx: {
            width: "550px",
            background: submitted ? palette[3] : addHslAlpha(palette[4], 0.5),
            backdropFilter: submitted ? "" : "blur(10px)",
            borderRadius: submitted ? 5 : "20px 20px 0 0",
            ...(submitted && {
              transition: "all .4s cubic-bezier(.17,.67,.08,1)!important",
              bottom: "calc(100dvh - 310px) !important",
              height: "220px",
            }),
            maxWidth: {
              xs: submitted ? "calc(100dvw - 65px)" : "100dvw",
              sm: submitted ? "500px" : "550px",
            },
          },
        }}
      >
        {submitted && (
          <Skeleton
            variant="rectangular"
            sx={{
              height: "100%",
              position: "absolute",
              width: "100%",
              top: 0,
              left: 0,
              borderRadius: 5,
              zIndex: 9999,
              background: "transparent",
              pointerEvents: "none",
            }}
            animation="wave"
          />
        )}
        <Puller
          showOnDesktop
          sx={{
            opacity: submitted ? 0 : 1,
            mt: submitted ? "-50px" : "0px",
            transition: "all .4s cubic-bezier(.17,.67,.08,1)!important",
            overflow: "hidden",
            "& .puller": {
              background: palette[6],
            },
          }}
        />
        <AppBar
          sx={{
            px: 1,
            mt: -2.5,
            border: 0,
            background: "transparent!important",
            backdropFilter: "none",
          }}
        >
          <Toolbar
            sx={{
              gap: 2,
              ...(submitted && {
                mt: 1.2,
                ml: { sm: -1 },
                transition: "all .4s cubic-bezier(.17,.67,.08,1)!important",
              }),
            }}
          >
            <IconButton
              sx={{
                mr: submitted ? 0 : "auto",
                display: submitted ? "none" : "flex",
                background: palette[4],
                transition: "all .4s cubic-bezier(.17,.67,.08,1)!important",
                color: palette[11],
              }}
              onClick={() => {
                setOpen(false);
                vibrate(50);
              }}
            >
              <Icon>close</Icon>
            </IconButton>
            <Typography
              variant="h4"
              className="font-heading"
              sx={{
                color: palette[11],
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {submitted ? name : "Gather availability"}
            </Typography>
            <IconButton
              sx={{
                ml: "auto",
                mb: submitted ? -3.1 : 0,
                mr: submitted ? -1 : 0,
                background: palette[4] + "!important",
                color: palette[11],
                transition: "all .4s cubic-bezier(.17,.67,.08,1)!important",
                ...(submitted && {
                  transform: "rotate(45deg)",
                }),
              }}
              onClick={handleSubmit}
            >
              <Icon>north</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            px: 3,
            pb: 3,
            ...(submitted && {
              filter: "blur(10px)",
              pointerEvents: "none",
            }),
          }}
        >
          <Box
            sx={{
              mt: 1,
              mb: 2,
              display: "flex",
              gap: 1.5,
              overflowX: "scroll",
              px: 3,
              mr: -3,
              ml: -3,
            }}
          >
            <CustomDateSelector
              chipStyles={chipStyles}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              setExcludingDates={setExcludingDates}
              setExcludingHours={setExcludingHours}
              startDate={startDate}
              endDate={endDate}
              excludingDates={excludingDates}
              excludingHours={excludingHours}
            />
            {
              Object.entries(templates).map(([key, value]) => (
                <Chip
                  key={key}
                  sx={chipStyles}
                  label={key}
                  // if selected
                  {...(startDate.isSame(value.startDate) &&
                    endDate.isSame(value.endDate) && {
                      icon: (
                        <Icon sx={{ color: palette[1] + "!important" }}>
                          check
                        </Icon>
                      ),
                      sx: {
                        fontWeight: 900,
                        "&, &:hover": {
                          background: palette[9],
                          color: palette[1],
                        },
                      },
                    })}
                  onClick={() => {
                    setStartDate(value.startDate);
                    setEndDate(value.endDate);
                    setExcludingDates(value.excludingDates || []);
                  }}
                />
              )) as any
            }
          </Box>
          <TextField
            sx={{ mt: 1 }}
            placeholder="Event name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export default function Page() {
  const { session } = useSession();
  const router = useRouter();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [showMargin, setShowMargin] = useState(false);

  const { data, error, mutate } = useSWR(["availability"]);

  useEffect(() => {
    document.documentElement.classList.remove("allow-scroll");
    document.body.style.background = palette[2];
  }, [palette]);

  const bulletStyles = {
    display: "flex",
    gap: 2,
    mt: 2,
    "& .MuiIcon-root": {
      mt: 0.5,
      fontSize: "30px",
      fontVariationSettings:
        '"FILL" 0, "wght" 200, "GRAD" 0, "opsz" 40!important',
    },
  };

  return (
    <Box sx={{ pb: "100px" }}>
      <AppBar
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          border: 0,
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          <IconButton onClick={() => router.push("/")}>
            <Icon>arrow_back_ios_new</Icon>
          </IconButton>
          <Typography>Home</Typography>
        </Toolbar>
      </AppBar>
      <CreateAvailability mutate={mutate} setShowMargin={setShowMargin} />
      <Box
        sx={{
          p: 4,
          pt: 0,
          display: "flex",
          gap: "20px",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            mt: "var(--navbar-height)",
            paddingTop: showMargin ? "235px" : "0px",
            overflow: "hidden",
            ...(showMargin && {
              transition: "all .4s cubic-bezier(.17,.67,.08,1)!important",
            }),
          }}
        />
        {data ? (
          data.length === 0 ? (
            <Box
              sx={{
                p: 3,
                borderRadius: 5,
                background: palette[3],
                color: palette[11],
                width: "500px",
                mx: "auto",
                maxWidth: "calc(100dvw - 60px)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.4,
                }}
              >
                <Typography variant="h4" className="font-heading">
                  Availability
                </Typography>
                <Chip
                  label="BETA"
                  sx={{
                    fontWeight: 900,
                    background: `linear-gradient(90deg, hsla(113, 96%, 81%, 1) 0%, hsla(188, 90%, 51%, 1) 100%)`,
                    color: "#000!important",
                  }}
                  size="small"
                />
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.6 }}>
                Blazingly fast event coordination
              </Typography>
              {[
                {
                  name: "Create an event",
                  description: "Set up an event in under 3 clicks.",
                },
                {
                  name: "Share the link with others",
                  description: "No sign up required.",
                },
                {
                  name: "See everyone's availability",
                  description:
                    "Once others respond, we'll will calculate the best time for everyone to meet.",
                },
              ].map((bullet, index) => (
                <motion.div
                  key={bullet.name}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Typography sx={bulletStyles}>
                    <span className="material-symbols-outlined">counter_{index + 1}</span>{" "}
                    <Box>
                      <b>{bullet.name}</b>
                      <div>{bullet.description}</div>
                    </Box>
                  </Typography>
                </motion.div>
              ))}
            </Box>
          ) : (
            <Virtuoso
              useWindowScroll
              customScrollParent={containerRef.current}
              totalCount={data.length}
              itemContent={(index) => (
                <EventCard mutate={mutate} index={index} event={data[index]} />
              )}
            />
          )
        ) : error ? (
          <ErrorHandler
            error="Something went wrong. Please try again later"
            callback={mutate}
          />
        ) : (
          [...new Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height="220px"
              animation="wave"
              sx={{ borderRadius: 5, maxWidth: "500px", mx: "auto" }}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
