import { ErrorHandler } from "@/components/Error";
import { isEmail } from "@/components/Group/Members/isEmail";
import { Logo } from "@/components/Logo";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { LoadingButton } from "@mui/lab";
import {
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  Grid,
  Icon,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";

function AvailabilityViewSelector({ view, setView }) {
  const { session } = useSession();
  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  const styles = (active) => ({
    flexShrink: 0,
    borderWidth: "2px!important",
    color: `${palette[10]}!important`,
    ...(active && {
      color: `${palette[11]}!important`,
      background: `${palette[4]}!important`,
      borderColor: `${palette[6]}!important`,
      "&:hover": {
        background: { sm: `${palette[5]}!important` },
        borderColor: `${palette[7]}!important`,
      },
      "&:active": {
        background: `${palette[6]}!important`,
        borderColor: `${palette[8]}!important`,
      },
    }),
  });

  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        mr: -3,
        ml: -3,
        px: 3,
        mt: { xs: 2, sm: 0 },
        gap: 2,
        maxWidth: "100dvw",
        flexShrink: 0,
      }}
    >
      <Button
        variant="outlined"
        onClick={() => setView(0)}
        sx={{
          ml: { sm: "auto" },
          ...styles(view === 0),
        }}
      >
        My availability
      </Button>
      <Button
        variant="outlined"
        onClick={() => setView(1)}
        sx={{
          mr: { sm: "auto" },
          ...styles(view === 1),
        }}
      >
        Everyone else
      </Button>
    </Box>
  );
}

function ParticipantMissingError({ userData, id, mutate }) {
  const { session } = useSession();
  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await fetch(
        "/api/availability/event/add-participant?" +
          new URLSearchParams({
            isAuthenticated: String(!!session),
            ...(session
              ? {
                  email: session?.user?.email,
                }
              : {
                  userData: JSON.stringify(userData),
                }),
            eventId: id,
          })
      );
      await mutate();
    } catch (e) {
      toast.error("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <LoadingButton
      loading={loading}
      onClick={handleSubmit}
      sx={{
        position: "absolute",
        top: { xs: "100px", sm: "50%" },
        left: "50%",
        transform: {
          xs: "translateX(-50%)",
          sm: "translate(-50%, -50%)",
        },
        background: palette[5] + "!important",
        zIndex: 999,
      }}
    >
      Add your availability
    </LoadingButton>
  );
}

function IdentityModal({ mutate, userData, setUserData }) {
  const router = useRouter();
  const { session, isLoading } = useSession();
  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  const [showPersonPrompt, setShowPersonPrompt] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isLoading && !session && !userData?.email) {
      setShowPersonPrompt(true);
    }
  }, [isLoading, session, userData]);

  useEffect(() => {
    if (localStorage.getItem("name")) {
      setName(String(localStorage.getItem("name")));
    }
    if (localStorage.getItem("email")) {
      setEmail(String(localStorage.getItem("email")));
    }
  }, []);

  const disabled = !name.trim() || !email.trim() || !isEmail(email);

  const handleSubmit = () => {
    if (disabled) return;
    setUserData({ name, email });
    setShowPersonPrompt(false);
  };

  useHotkeys("enter", () => !disabled && handleSubmit(), {
    enableOnFormTags: true,
  });

  return (
    <>
      <div
        id="identity"
        style={{ display: "none" }}
        onClick={() => setShowPersonPrompt(true)}
      />
      <Dialog
        open={showPersonPrompt}
        onClose={() => {
          setShowPersonPrompt(disabled);
          setTimeout(handleSubmit, 200);
        }}
        PaperProps={{
          sx: {
            p: 5,
            border: `2px solid ${palette[3]}`,
          },
        }}
      >
        <Typography
          variant="h3"
          sx={{ textAlign: "center" }}
          className="font-heading"
        >
          Who are you?
        </Typography>
        <Typography sx={{ mb: 2, textAlign: "center" }}>
          Enter your name and email so that others can see your availability.
          This won&apos;t create an account.
        </Typography>
        <TextField
          autoFocus
          onChange={(e) => {
            setName(e.target.value);
            localStorage.setItem("name", e.target.value);
          }}
          value={name}
          required
          name="name"
          label="Name"
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          onChange={(e) => {
            setEmail(e.target.value);
            localStorage.setItem("email", e.target.value);
          }}
          value={email}
          required
          label="Email"
          name="email"
          size="small"
        />
        <Box
          sx={{
            display: "flex",
            mt: 2,
            alignItems: "center",
          }}
        >
          <Button
            size="small"
            onClick={() =>
              router.push(
                "/auth?next=" + encodeURIComponent(window.location.href)
              )
            }
          >
            I have an account
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ ml: "auto" }}
            disabled={disabled}
          >
            Continue <Icon>east</Icon>
          </Button>
        </Box>
      </Dialog>
    </>
  );
}

function AvailabilityViewer({ data: eventData }) {
  const { session } = useSession();
  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  const { data, mutate, error } = useSWR([
    "availability/event/others",
    { id: eventData.id },
  ]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="motion"
      style={{
        overflowY: "scroll",
        flexDirection: "column",
        padding: "30px",
        gap: "7px",
      }}
    >
      {data ? (
        <>
          {data.overlappingAvailability?.length === 0 ? (
            <Box
              sx={{
                borderRadius: 4,
              }}
            >
              <Typography variant="h4" className="font-heading">
                Yikes!
              </Typography>
              <Typography>
                Nobody you&apos;ve invited is available at the same time
              </Typography>

              <TableContainer
                component={Box}
                sx={{
                  mt: 3,
                  background: palette[3],
                  borderRadius: 4,
                }}
              >
                <Table
                  aria-label="All overlapping availability"
                  sx={{
                    "& *": {
                      borderBottomColor: palette[5] + "!important",
                      borderBottomWidth: "2px!important",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="h6">All availability</Typography>
                        <Typography variant="body2">
                          {eventData.participants.length} people responded
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Person</TableCell>
                      <TableCell align="center">Availability</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.data.participants.map((participant) => (
                      <TableRow
                        key={participant.name}
                        sx={{
                          borderColor: palette[3],
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            {participant.user.Profile && (
                              <ProfilePicture
                                data={participant.user}
                                size={30}
                              />
                            )}
                            {participant.user?.name ||
                              participant.userData?.name}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              flexWrap: "wrap",
                              gap: 2,
                            }}
                          >
                            {participant.availability.map(
                              (availability, index) => (
                                <Chip
                                  label={dayjs(availability.date)
                                    .set("hour", availability.hour)
                                    .format("MM/D [at] hA")}
                                  sx={{ background: palette[5] }}
                                  key={index}
                                />
                              )
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  p: 3,
                  background: palette[3],
                  borderRadius: 4,
                }}
              >
                <Typography variant="h4" className="font-heading">
                  <u>
                    {dayjs(data.overlappingAvailability?.[0]?.date).format(
                      "dddd, MMMM Do"
                    )}
                  </u>{" "}
                  at{" "}
                  <u>
                    {data.overlappingAvailability[0]?.hour % 12 || 12}{" "}
                    {data.overlappingAvailability[0]?.hour > 11 ? "PM" : "AM"}
                  </u>
                </Typography>
                <Typography>Best time to meet</Typography>
              </Box>

              <TableContainer
                component={Box}
                sx={{
                  mt: 3,
                  background: palette[3],
                  borderRadius: 4,
                }}
              >
                <Table
                  aria-label="All overlapping availability"
                  sx={{
                    "& *": {
                      borderBottomColor: palette[5] + "!important",
                      borderBottomWidth: "2px!important",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="h6">
                          All overlapping availability
                        </Typography>
                        <Typography variant="body2">
                          {eventData.participants.length} people responded
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="center">Time</TableCell>
                      <TableCell align="center">People</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.overlappingAvailability.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          borderColor: palette[3],
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {dayjs(row.date).format("dddd, MMMM Do")}
                        </TableCell>
                        <TableCell align="center">
                          {dayjs(row.date).set("hour", row.hour).format("hA")}
                        </TableCell>
                        <TableCell align="center">
                          {row.overlappingParticipants}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {error && (
        <ErrorHandler
          callback={mutate}
        />
      )}
    </motion.div>
  );
}

const AvailabilityButton = React.memo(function AvailabilityButton({
  showEarlyHours,
  hour,
  col,
  handleSelect,
  disabled,
  shouldHide,
}: any) {
  const { session } = useSession();
  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );
  const greenPalette = useColor(
    "green",
    useDarkMode(session?.darkMode || "system")
  );
  return (
    <Button
      disabled={disabled}
      size="small"
      onClick={() => handleSelect(hour, col.date)}
      sx={{
        ...(shouldHide && {
          display: "none!important",
        }),
        // If the user has marked their availability for this time slot, make it green
        "&:hover": {
          background: { sm: palette[4] + "!important" },
        },
        ...(col.availability && {
          background: greenPalette[6] + "!important",
          "&:hover": {
            background: { sm: greenPalette[7] + "!important" },
          },
          color: greenPalette[12] + "!important",
        }),
        height: "35px",
        borderRadius: 0,
        flexShrink: 0,
        ...(hour === 12 && {
          borderBottom: `2px solid ${palette[5]}`,
          ...(col.availability && {
            borderBottom: `2px solid ${greenPalette[5]}`,
          }),
        }),
        ...(hour < 8 && !showEarlyHours && { display: "none" }),
      }}
    >
      <span>
        {col.date.format("h")}
        <span style={{ opacity: 0.7 }}>{col.date.format("A")}</span>
      </span>
    </Button>
  );
});

function EarlyHoursToggle({ showEarlyHours, setShowEarlyHours }) {
  const isMobile = useMediaQuery(`(max-width: 600px)`);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowTooltip(false);
    }, 1000);
  }, []);

  return (
    <Tooltip
      open={showTooltip}
      title={showEarlyHours ? "Hide early hours" : "Show early hours"}
      placement="right"
    >
      <IconButton
        onClick={() => setShowEarlyHours((e) => !e)}
        {...(isMobile
          ? {
              onTouchStart: () => setShowTooltip(true),
              onTouchEnd: () => setShowTooltip(false),
            }
          : {
              onMouseEnter: () => setShowTooltip(true),
              onMouseLeave: () => setShowTooltip(false),
            })}
      >
        <Icon sx={{ fontSize: "30px!important" }} className="outlined">
          {!showEarlyHours ? "wb_twilight" : "expand_less"}
        </Icon>
      </IconButton>
    </Tooltip>
  );
}

function AvailabilityCalendar({ setIsSaving, mutate, data, userData }) {
  const { session } = useSession();
  const isMobile = useMediaQuery(`(max-width: 600px)`);

  const identity = session?.user?.email || userData?.email;
  const participant = data.participants.find(
    (p) => (p.user || p.userData).email === identity
  );

  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  const startDate = dayjs(data.startDate).tz(data.timeZone).startOf("day");
  const endDate = dayjs(data.endDate).tz(data.timeZone).startOf("day");
  const days = endDate.diff(startDate, "day") + 1;
  const times = 24;

  const grid = [...Array(days)].map((_, i) => {
    return [...Array(times)].map((_, j) => {
      const date = startDate.add(i, "day").set("hour", j);

      const availability = data.participants
        .find(
          (p) =>
            (p?.userData?.email || p?.user?.email) ===
            (userData?.email || session?.user?.email)
        )
        ?.availability?.find((a) =>
          dayjs(a.date).set("hour", a.hour).isSame(date)
        );

      return {
        date,
        availability,
      };
    });
  });

  const handleScroll = (e) => {
    // sync scroll all `.scroller` elements
    const scrollers = document.querySelectorAll(".scroller");
    scrollers.forEach((scroller) => {
      if (scroller !== e.currentTarget) {
        scroller.scrollTop = e.currentTarget.scrollTop;
      }
    });
  };

  const headerStyles = {
    p: 2,
    mb: 2,
    px: 3,
    top: 0,
    zIndex: 9,
    position: "sticky",
    height: "95px",
    display: "flex",
    flex: "0 0 95px",
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: "column",
    justifyContent: "center",
    color: palette[11],
    backdropFilter: { sm: "blur(3px)" },
    background: addHslAlpha(palette[3], 0.5),
    borderBottom: `2px solid ${addHslAlpha(palette[5], 0.5)}`,
    "&:hover": {
      background: addHslAlpha(palette[4], 0.5),
      borderBottom: `2px solid ${addHslAlpha(palette[6], 0.5)}`,
    },
  };

  const columnStyles = {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    flex: "0 0 90px",
    background: palette[3],
    borderRadius: 4,
    maxHeight: "100%",
    overflowY: "auto",
    overflowX: "hidden",
  };

  const [showEarlyHours, setShowEarlyHours] = useState(false);

  const handleRowSelect = (hour) => {
    // repeat `handleSelect` for cells in the hour row of the grid
    grid.forEach((row) => {
      handleSelect(hour, row[hour].date);
    });
  };

  const handleColumnSelect = (dayIndex: number) => {
    // repeat `handleSelect` for cells in the day column of the grid
    grid[dayIndex].forEach((col, j) => {
      handleSelect(j + 1, col.date);
    });
  };

  const handleSelect = async (hour, date) => {
    let availability = participant.availability || [];

    const availabilityIndex = availability.findIndex((a) =>
      dayjs(a.date)
        .startOf("day")
        .set("hour", a.hour)
        .isSame(dayjs(date).startOf("day").set("hour", hour))
    );

    if (availabilityIndex !== -1) {
      availability.splice(availabilityIndex, 1);
    } else {
      availability.push({
        date: dayjs(date).set("hour", 0).toISOString(),
        hour,
      });
    }

    // Remove all excluding dates from availability
    availability = availability.filter(
      (a) => !data.excludingDates.includes(a.date)
    );

    // Remove all excluding hours from availability
    availability = availability.filter(
      (a) => !data.excludingHours.includes(a.hour)
    );

    const newData = {
      ...data,
      participants: data.participants.map((p) => {
        if (
          (p.user || p.userData).email ===
          (userData?.email || session?.user?.email)
        ) {
          return {
            ...p,
            availability: [...availability],
          };
        } else {
          return p;
        }
      }),
    };

    const participantExists = newData.participants.find(
      (p) =>
        (p.user || p.userData).email ===
        (session?.user?.email || userData?.email)
    );

    mutate(newData, {
      populateCache: newData,
      revalidate: false,
    });

    setIsSaving("saving");
    await fetch(
      "/api/availability/event/set-availability?" +
        new URLSearchParams({
          eventId: data.id,
          ...(session && { email: session.user?.email }),
          ...(userData && { userData: JSON.stringify(userData) }),
          availability: JSON.stringify(
            participantExists
              ? newData.participants.find(
                  (p) =>
                    (p.user || p.userData).email ===
                    (session?.user?.email || userData?.email)
                )?.availability
              : participant.availability
          ),
        })
    );

    setIsSaving("saved");
  };
  const handleParentScrollTop = (e: any) =>
    (e.currentTarget.parentElement.scrollTop = 0);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="motion"
    >
      {!participant && (
        <ParticipantMissingError
          userData={userData}
          id={data.id}
          mutate={mutate}
        />
      )}
      <Box
        sx={{
          ...(!participant && {
            filter: "blur(5px)",
            opacity: 0.5,
            pointerEvents: "none",
          }),
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          alignItems: { xs: "start", sm: "center" },
          height: { xs: "auto", sm: "100%" },
          gap: 1.5,
          p: { xs: 3, sm: 5 },
          pt: 3,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Box
          sx={{
            ...columnStyles,
            flex: `0 0 60px`,
            position: "sticky",
            left: 0,
            ...(grid.length === 1 && { display: "none" }),
            zIndex: 99,
            background: addHslAlpha(palette[5], 0.6),
            backdropFilter: "blur(2px)",
            ml: "auto",
            mr: 1.5,
          }}
          className="scroller"
          onScroll={handleScroll}
        >
          <Box sx={headerStyles} onClick={handleParentScrollTop}>
            <EarlyHoursToggle
              showEarlyHours={showEarlyHours}
              setShowEarlyHours={setShowEarlyHours}
            />
          </Box>
          {[...new Array(times)].map((_, i) => (
            <Button
              size="small"
              disabled={!participant}
              onClick={() => handleRowSelect(i)}
              sx={{
                height: "35px",
                px: 0,
                flexShrink: 0,
                borderRadius: 0,
                ...(i === 12 && { borderBottom: `2px solid ${palette[6]}` }),
                ...(i < 8 && !showEarlyHours && { display: "none" }),
                ...(data.excludingHours.includes(i) && {
                  display: "none!important",
                }),
              }}
              key={i}
            >
              <Icon sx={{ ml: -0.5 }}>check_box_outline_blank</Icon>
            </Button>
          ))}
        </Box>
        {grid.map((row, i) => (
          <Box
            key={i}
            sx={{
              ...columnStyles,
              ...(data.excludingDates.includes(
                startDate.add(i, "day").toISOString()
              ) && {
                display: "none!important",
              }),
              ...(grid.length === 1 && { ml: "auto" }),
            }}
            className="scroller"
            onScroll={handleScroll}
          >
            <Box
              sx={headerStyles}
              onClick={(e) => {
                handleParentScrollTop(e);
                handleColumnSelect(i);
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  background: addHslAlpha(palette[7], 0.5),
                  color: palette[12],
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  fontWeight: 900,
                  fontSize: 20,
                }}
              >
                {startDate.add(i, "day").format("DD")}
              </Box>
              <Typography variant="body2" sx={{ mt: 0.5, mb: -0.5 }}>
                {startDate.add(i, "day").format("ddd").toUpperCase()}
              </Typography>
            </Box>
            {row.map((col, j) => (
              <AvailabilityButton
                shouldHide={data.excludingHours.includes(j)}
                disabled={!participant}
                key={j}
                hour={j}
                col={col}
                handleSelect={handleSelect}
                showEarlyHours={showEarlyHours}
              />
            ))}
          </Box>
        ))}
        <Box
          sx={{
            display: "flex",
            flex: "0 0 20px",
            ml: "auto",
            position: "sticky",
            right: { xs: "calc(0dvw - 30px)", sm: "-40px" },
            background: `linear-gradient(to left, ${palette[2]}, transparent)`,
            width: 40,
            height: "100vh",
            zIndex: 99,
          }}
        />
      </Box>
    </motion.div>
  );
}

export default function Page({ data: eventData }) {
  const { session, isLoading: isSessionLoading } = useSession();
  const router = useRouter();
  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  const [isSaving, setIsSaving] = useState("upToDate");
  const [view, setView] = useState(0);

  const { data, mutate, isLoading, error } = useSWR(
    router?.query?.id ? ["availability/event", { id: router.query.id }] : null
  );

  const { data: profileData } = useSWR(
    session?.user?.email
      ? ["user/profile", { email: session?.user?.email }]
      : null
  );

  useEffect(() => {
    document.documentElement.classList.add("allow-scroll");
    document.body.style.background = palette[1];
  }, [palette]);

  const [userData, setUserData] = useState(
    {
      name: session?.user?.name,
      email: session?.user?.email,
      color: session?.user?.color,
      Profile: session?.user?.Profile,
    } || { name: "", email: "" }
  );

  const isMobile = useMediaQuery(`(max-width: 600px)`);

  return (
    <Box
      sx={{
        color: palette[12],
        height: "auto",
      }}
    >
      <Head>
        <title>{`Availability for ${eventData.name} • Dysperse`}</title>
        <meta
          name="og:image"
          content={`/api/availability/event/og?id=` + eventData.id}
        />
        <meta
          name="twitter:image"
          content={`/api/availability/event/og?id=` + eventData.id}
        />
        <meta
          name="description"
          content={`What's your availability from ${dayjs(
            eventData.startDate
          ).format("MMMM Do")} to ${dayjs(eventData.endDate).format(
            "MMMM Do"
          )}? Tap to respond.`}
        />
      </Head>
      <IdentityModal
        mutate={mutate}
        setUserData={setUserData}
        userData={userData}
      />
      <AppBar
        sx={{
          position: "absolute",
          backdropFilter: "none",
          top: 0,
          left: 0,
          border: 0,
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Logo
            onClick={() =>
              window.open(`https:////dysperse.com?utm_source=availability`)
            }
          />
          {isSaving !== "upToDate" && (
            <Chip
              {...(isMobile && { variant: "outlined" })}
              sx={{
                color: palette[9] + "!important",
                background: palette[3],
              }}
              icon={
                <Icon sx={{ color: palette[9] + "!important" }}>
                  {isSaving === "saving" ? "cloud_sync" : "cloud_done"}
                </Icon>
              }
              label={isSaving === "saving" ? "Saving..." : "Saved"}
            />
          )}
          {session && (
            <IconButton
              onClick={() => (window.location.href = "/availability")}
              sx={{ ml: "auto" }}
            >
              <Icon className="outlined">home</Icon>
            </IconButton>
          )}
          {session &&
            (profileData ? (
              <Box>
                <ProfilePicture size={30} data={profileData} />
              </Box>
            ) : (
              <Skeleton variant="circular" width={30} height={30} />
            ))}
          {!session && (
            <Button
              variant="contained"
              disabled={isLoading}
              onClick={() => document.getElementById("identity")?.click()}
              sx={{ ml: "auto" }}
            >
              {userData?.name || "Sign in"} <Icon>edit</Icon>
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100dvh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {error && (
        <ErrorHandler
          callback={mutate}
        />
      )}
      {data && (
        <Grid
          container
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            height: { xs: "unset", sm: "100dvh" },
            overflow: "hidden",
            width: "100dvw",
            pt: "var(--navbar-height)",
          }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              width: "100%",
              display: "flex",
              mt: { xs: 5, sm: 0 },
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              pt: { sm: 6 },
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                p: { sm: 3 },
                background: { sm: palette[2] },
                border: { sm: `2px solid ${palette[4]}` },
                borderRadius: 5,
                position: "relative",
              }}
            >
              <Typography
                variant="h2"
                sx={{ color: palette[11] }}
                className="font-heading"
              >
                {data.name}
              </Typography>
              <Typography sx={{ color: palette[11], opacity: 0.7 }}>
                Tap on a time slot to mark your availability.
              </Typography>
            </Box>
            <Grid container columnSpacing={2}>
              {data.location && (
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      width: "100%",
                      p: { sm: 3 },
                      background: { sm: palette[2] },
                      border: { sm: `2px solid ${palette[4]}` },
                      borderRadius: 5,
                      position: "relative",
                    }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                      WHERE
                    </Typography>
                    <Typography variant="h5">{data.location}</Typography>
                  </Box>
                </Grid>
              )}
              {data.description && (
                <Grid item xs={12} sm={6} sx={{ mt: { xs: 1, sm: 0 } }}>
                  <Box
                    sx={{
                      width: "100%",
                      p: { sm: 3 },
                      background: { sm: palette[2] },
                      border: { sm: `2px solid ${palette[4]}` },
                      borderRadius: 5,
                      position: "relative",
                    }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                      DESCRIPTION
                    </Typography>
                    <Typography variant="h5">{data.description}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              height: { xs: "auto", sm: "100%" },
              gap: { xs: 2, sm: 4 },
              p: { sm: 3 },
              "& .motion": {
                display: "flex",
                overflow: "hidden",
                height: { xs: "auto", sm: "100%" },
                width: "100%",
                background: palette[2],
                border: `2px solid ${palette[4]}`,
                position: "relative",
                borderRadius: 4,
              },
            }}
          >
            <AvailabilityViewSelector view={view} setView={setView} />
            {view === 0 ? (
              <AvailabilityCalendar
                userData={userData}
                setIsSaving={setIsSaving}
                data={data}
                mutate={mutate}
              />
            ) : (
              <AvailabilityViewer data={data} />
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const url = `https://${req.headers["x-forwarded-host"]}/api/availability/event?id=${context.query.id}&basic=true`;

  const res = await fetch(url);
  const data = await res.json();

  return {
    props: { data },
  };
}
