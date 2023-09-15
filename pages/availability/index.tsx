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
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";

function EventCard({ event }) {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const createdRecently = useMemo(
    () =>
      dayjs().diff(dayjs(event.createdAt), "minute") < 15 &&
      event.createdBy == session.user.identifier,
    [event, session]
  );

  const handleShare = () => {
    navigator.share({
      title: event.name,
      text: `What's your availability from ${dayjs(event.startDate).format(
        "MMMM Do"
      )} to ${dayjs(event.endDate).format("MMMM Do")}? Tap to respond.`,
      url: `${process.env.NEXT_PUBLIC_URL}/availability/${event.id}`,
    });
  };

  return (
    <Box key={event.id} sx={{ pb: 2, maxWidth: "500px", mx: "auto" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
              onClick={() => router.push(`/availability/${event.id}`)}
              sx={{
                ml: "auto",
                flexShrink: 0,
                color: palette[11],
                background: palette[4],
              }}
            >
              <Icon>east</Icon>
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
            <Button
              sx={{
                background: palette[4] + "!important",
                ...(createdRecently && {
                  background: palette[9] + "!important",
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
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs().endOf("day"));

  const [name, setName] = useState(
    `${session.user?.name?.split(" ")[0]}'s meeting`
  );

  const [submitted, setSubmitted] = useState(false);

  const chipStyles = {
    background: palette[4],
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    await fetchRawApi(session, "availability/create", {
      name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      timeZone: session.user.timeZone,
    });
    await mutate();
    setShowMargin(false);
    setOpen(false);
    setTimeout(() => setSubmitted(false), 200);
  };

  useEffect(() => {
    setShowMargin(submitted);
  }, [submitted, setShowMargin]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.nativeEvent.touches[0].pageY);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.nativeEvent.touches[0].pageY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    if (touchStart - touchEnd > minSwipeDistance) {
      setOpen(true);
    }
  };

  return (
    <>
      <Box
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        sx={{
          zIndex: 9999,
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
          transition: "bottom .5s cubic-bezier(.17,.67,.08,1)!important",
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
          className="font-heading"
          sx={{
            pb: 3,
            px: 3,
            mt: -1,
            color: palette[11],
          }}
        >
          Gather availability
        </Typography>
      </Box>
      <SwipeableDrawer
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
            },
          },
        }}
        PaperProps={{
          sx: {
            maxWidth: !submitted ? "100%" : "calc(100dvw - 64px)",
            width: "550px",
            background: submitted ? palette[3] : addHslAlpha(palette[4], 0.5),
            backdropFilter: submitted ? "" : "blur(10px)",
            borderRadius: submitted ? 5 : "20px 20px 0 0",
            ...(submitted && {
              transition: "all .5s cubic-bezier(.17,.67,.08,1)!important",
              bottom: "calc(100dvh - 320px) !important",
            }),
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
            transition: "all .5s cubic-bezier(.17,.67,.08,1)!important",
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
          <Toolbar>
            <IconButton
              sx={{
                mr: submitted ? 0 : "auto",
                display: submitted ? "none" : "flex",
                background: palette[4],
                transition: "all .5s cubic-bezier(.17,.67,.08,1)!important",
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
              }}
            >
              {submitted ? name : "Gather availability"}
            </Typography>
            <IconButton
              sx={{
                ml: "auto",
                mr: submitted ? -1 : 0,
                background: palette[4],
                color: palette[11],
                transition: "all .5s cubic-bezier(.17,.67,.08,1)!important",
                ...(submitted && {
                  transform: "rotate(90deg)",
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
            <Chip
              sx={chipStyles}
              icon={<Icon sx={{ ml: "18px!important" }}>tune</Icon>}
            />
            <Chip sx={chipStyles} icon={<Icon>check</Icon>} label="Today" />
            <Chip sx={chipStyles} label="This weekend" />
            <Chip sx={chipStyles} label="Weekends this month" />
            <Chip sx={chipStyles} label="Weekdays this month" />
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
  const session = useSession();
  const router = useRouter();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [showMargin, setShowMargin] = useState(false);

  const { data, error, mutate } = useSWR(["availability"]);

  useEffect(() => {
    document.documentElement.classList.remove("allow-scroll");
    document.body.style.background = palette[2];
  }, [palette]);

  return (
    <Box sx={{ pb: "270px" }}>
      <AppBar
        sx={{
          zIndex: 99999,
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
            paddingTop: showMargin ? "218px" : "0px",
            overflow: "hidden",
            ...(showMargin && {
              transition: "all .5s cubic-bezier(.17,.67,.08,1)!important",
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
              }}
            >
              <Typography variant="h4" className="font-heading">
                Availability
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.6 }}>
                Plan your next meetup time in under 3 clicks
              </Typography>
            </Box>
          ) : (
            <Virtuoso
              useWindowScroll
              customScrollParent={containerRef.current}
              totalCount={data.length}
              itemContent={(index) => <EventCard event={data[index]} />}
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
