import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Button, Icon, Typography } from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useState } from "react";
import { AvailabilityButton } from "./AvailabilityButton";
import { EarlyHoursToggle } from "./EarlyHoursToggle";
import { ParticipantMissingError } from "./ParticipantMissingError";

export function AvailabilityCalendar({ setIsSaving, mutate, data, userData }) {
  const { session } = useSession();

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

  const [showEarlyHours, setShowEarlyHours] = useState(
    grid.length === 1 ? true : false
  );

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
        }),
      {
        method: "PUT",
      }
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
