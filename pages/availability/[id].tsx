import { ErrorHandler } from "@/components/Error";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Logo } from "..";

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

function AvailabilityCalendar({ data }) {
  const session = useSession();
  const isMobile = useMediaQuery(`(max-width: 600px)`);

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
      const availability = data.participants?.find((a) =>
        dayjs(a.date).isSame(date)
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
  };

  const columnStyles = {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    flexGrow: "0 0 100px",
    background: palette[3],
    borderRadius: 4,
    maxHeight: {
      xs: "auto",
      sm: "100%",
    },
    overflowY: "auto",
  };

  const [showEarlyHours, setShowEarlyHours] = useState(false);

  const handleMultiSelect = (i) => {};
  const handleParentScrollTop = (e: any) =>
    (e.currentTarget.parentElement.scrollTop = 0);

  return (
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
      }}
    >
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          mr: -3,
          ml: -3,
          px: 3,
          gap: 2,
          maxWidth: "100dvw",
          flexShrink: 0,
        }}
      >
        <Button
          variant="outlined"
          {...(isMobile && { size: "small" })}
          sx={{
            ml: { sm: "auto" },
            flexShrink: 0,
            borderWidth: "2px!important",
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
          }}
        >
          My availability
        </Button>
        <Button
          {...(isMobile && { size: "small" })}
          variant="outlined"
          sx={{
            mr: { sm: "auto" },
            flexShrink: 0,
            borderWidth: "2px!important",
            color: `${palette[8]}!important`,
          }}
        >
          Everyone else
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          background: palette[2],
          border: `2px solid ${palette[4]}`,
          alignItems: { xs: "start", sm: "center" },
          borderRadius: 4,
          gap: 3,
          p: { xs: 3, sm: 5 },
          pt: 3,
          width: "auto",
          maxWidth: "100%",
        }}
      >
        <Box
          sx={{
            ...columnStyles,
            flex: `0 0 60px`,
            position: "sticky",
            left: 0,
            zIndex: 99,
            background: addHslAlpha(palette[5], 0.6),
            backdropFilter: "blur(2px)",
            ml: "auto",
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
              onClick={() => handleMultiSelect(i)}
              sx={{
                height: "35px",
                px: 0,
                flexShrink: 0,
                borderRadius: 0,
                ...(i === 12 && { borderBottom: `2px solid ${palette[6]}` }),
                ...(i < 8 && !showEarlyHours && { display: "none" }),
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
            sx={{ ...columnStyles, mr: "-0px" }}
            className="scroller"
            onScroll={handleScroll}
          >
            <Box sx={headerStyles} onClick={handleParentScrollTop}>
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
              <Button
                size="small"
                key={j}
                sx={{
                  height: "35px",
                  borderRadius: 0,
                  flexShrink: 0,
                  ...(j === 12 && { borderBottom: `2px solid ${palette[5]}` }),
                  ...(j < 8 && !showEarlyHours && { display: "none" }),
                }}
              >
                <span>
                  {col.date.format("h")}
                  <span style={{ opacity: 0.7 }}>{col.date.format("A")}</span>
                </span>
              </Button>
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
    </Grid>
  );
}

export default function Page() {
  const session = useSession();
  const router = useRouter();
  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );
  const isMobile = useMediaQuery(`(max-width: 600px)`);

  const { data, mutate, isLoading, error } = useSWR(
    router?.query?.id ? ["availability/event", { id: router.query.id }] : null
  );

  useEffect(() => {
    document.documentElement.classList.add("allow-scroll");
    document.body.style.background = palette[1];
  }, [palette]);

  return (
    <Box
      sx={{
        color: palette[12],
        height: "auto",
      }}
    >
      <AppBar
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          border: 0,
        }}
      >
        <Toolbar>
          {!session && (
            <Logo
              onClick={() =>
                window.open(`https:////dysperse.com?utm_source=availability`)
              }
            />
          )}
          {session && (
            <IconButton onClick={() => router.push("/availability")}>
              <Icon>arrow_back_ios_new</Icon>
            </IconButton>
          )}
          {!session && (
            <Button
              variant="contained"
              onClick={() =>
                router.push(
                  "/auth?next=" + encodeURIComponent(window.location.href)
                )
              }
              sx={{ ml: "auto" }}
            >
              Sign in <Icon>login</Icon>
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
          error="Something went wrong. Please try again later."
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
              textAlign: { sm: "center" },
              display: "flex",
              mt: { xs: 5, sm: 0 },
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", sm: "auto" },
                p: { sm: 5 },
                background: { sm: palette[2] },
                border: { sm: `2px solid ${palette[4]}` },
                borderRadius: 5,
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
          </Grid>
          <AvailabilityCalendar data={data} />
        </Grid>
      )}
    </Box>
  );
}
