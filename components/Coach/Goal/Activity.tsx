import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Box,
  Icon,
  IconButton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { cloneElement, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

export function GoalActivity({ goal, children, open, setOpen }) {
  const session = useSession();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (open) {
      fetchRawApi(session, "user/coach/goals/activity", {
        id: goal.id,
      })
        .then((res) => {
          setData(res);
        })
        .catch(() =>
          toast.error(
            "Yikes! Something went wrong while trying to fetch your activity",
            toastStyles,
          ),
        );
    }
  }, [open, session, goal, data]);

  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const trigger = cloneElement(children, {
    onClick: () => setOpen(!open),
  });

  const months = [
    "Janurary",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const CalendarComponent = () => {
    const currentDate = dayjs();
    const currentMonth = currentDate.month();

    // Precompute the parsed dates from 'data'
    const parsedDates = useMemo(() => {
      const parsed = {};
      data?.forEach((d) => {
        const month = parseInt(dayjs(d.date).format("MM"));
        const day = parseInt(dayjs(d.date).format("DD"));
        if (!parsed[month]) parsed[month] = new Set();
        parsed[month].add(day);
      });
      return parsed;
    }, []);

    return (
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 1, sm: 3 },
          mb: 4,
        }}
      >
        {[...new Array(12)].map((_, month) => {
          const daysInMonth = new Date(
            currentDate.year(),
            month + 1,
            0,
          ).getDate();
          const isCurrentMonth = month === currentMonth;
          const monthDays = [...new Array(daysInMonth)];

          return (
            <Box
              key={month}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 0.5, sm: 1 },
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  px: 1.5,
                  borderRadius: 4,
                  height: { xs: 20, sm: 30 },
                  width: { xs: 20, sm: 30 },
                  fontSize: { xs: 14, sm: 20 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                  ...(isCurrentMonth && {
                    color: "#000!important",
                    background: `linear-gradient(${palette[7]}, ${palette[9]})`,
                  }),
                }}
              >
                {months[month][0]}
              </Typography>
              {monthDays.map((_, day) => {
                const isHighlighted = parsedDates[month + 1]?.has(day + 1);
                return (
                  <Box
                    key={day}
                    onClick={() =>
                      toast(
                        dayjs()
                          .month(month)
                          .date(day + 1)
                          .format("MMMM D, YYYY"),
                        toastStyles,
                      )
                    }
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      background: isHighlighted ? palette[9] : palette[4],
                    }}
                  />
                );
              })}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box>
      {trigger}
      <SwipeableDrawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        anchor="bottom"
        PaperProps={{
          sx: {
            background: palette[2],
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Puller showOnDesktop />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1.5,
              mb: 2,
            }}
          >
            <Typography variant="h3" className="font-heading">
              {dayjs().year()}
            </Typography>
            <IconButton
              sx={{ ml: "auto", background: palette[3] }}
              onClick={() => setOpen(false)}
            >
              <Icon>close</Icon>
            </IconButton>
          </Box>
          <CalendarComponent />
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}
