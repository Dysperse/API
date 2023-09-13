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
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";

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
    setSubmitted(false);
  };

  useEffect(() => {
    setShowMargin(submitted);
  }, [submitted, setShowMargin]);

  return (
    <>
      <Box
        sx={{
          zIndex: 9999,
          position: "fixed",
          bottom: !open ? 0 : "-100px",
          width: "100%",
          textAlign: "center",
          left: "50%",
          transform: "translateX(-50%)",
          background: addHslAlpha(palette[3], 0.5),
          backdropFilter: "blur(10px)",
          overflow: "hidden",
          maxHeight: submitted ? "100px" : "100px",
          borderRadius: "20px 20px 0 0",
          transition: "bottom .5s cubic-bezier(.17,.67,.08,1)!important",
          "&:active": {
            background: addHslAlpha(palette[3], 0.8),
          },
        }}
        onClick={() => {
          setOpen(true);
          vibrate(50);
        }}
      >
        <Puller />
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
        hideBackdrop
        PaperProps={{
          sx: {
            maxWidth: !submitted ? "100%" : "calc(100dvw - 64px)",
            width: "100%",
            background: submitted ? palette[3] : addHslAlpha(palette[3], 0.5),
            backdropFilter: submitted ? "" : "blur(10px)",
            maxHeight: submitted ? "220px" : "270px",
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
          sx={{
            opacity: submitted ? 0 : 1,
            mt: submitted ? "-50px" : "0px",
            transition: "all .5s cubic-bezier(.17,.67,.08,1)!important",
            overflow: "hidden",
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
                background: palette[3],
                transition: "all .5s cubic-bezier(.17,.67,.08,1)!important",
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
              Gather availability
            </Typography>
            <IconButton
              sx={{
                ml: "auto",
                mr: submitted ? -1 : 0,
                background: palette[3],
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
            <Chip icon={<Icon sx={{ ml: "18px!important" }}>tune</Icon>} />
            <Chip icon={<Icon>check</Icon>} label="Today" />
            <Chip label="This weekend" />
            <Chip label="Weekends this month" />
            <Chip label="Weekdays this month" />
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
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [showMargin, setShowMargin] = useState(false);

  const { data, error, mutate } = useSWR(["availability"]);

  return (
    <Box sx={{ pb: "270px" }}>
      <AppBar
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <Toolbar>
          <IconButton>
            <Icon>arrow_back_ios_new</Icon>
          </IconButton>
          <Typography>Availability</Typography>
        </Toolbar>
      </AppBar>
      <CreateAvailability mutate={mutate} setShowMargin={setShowMargin} />
      <Box
        sx={{
          p: 4,
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
              itemContent={(index) => {
                const event = data[index];
                return (
                  <Box key={event.id} sx={{ pb: 2 }}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 5,
                          background: palette[3],
                          color: palette[11],
                          height: "220px",
                        }}
                      >
                        <Typography variant="h4" className="font-heading">
                          {event.name}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.6 }}>
                          {dayjs(event.startDate).format("MMM D, YYYY")} -{" "}
                          {dayjs(event.endDate).format("MMM D, YYYY")}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>
                );
              }}
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
              sx={{ borderRadius: 5 }}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
