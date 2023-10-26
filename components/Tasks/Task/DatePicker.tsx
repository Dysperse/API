import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Button, Chip, Icon, SwipeableDrawer } from "@mui/material";
import {
  DayCalendarSkeleton,
  MonthCalendar,
  PickersDay,
  PickersDayProps,
  StaticTimePicker,
  YearCalendar,
} from "@mui/x-date-pickers";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import { motion } from "framer-motion";
import React, { cloneElement, useCallback, useMemo, useState } from "react";

function ServerDay(
  props: PickersDayProps<Dayjs> & {
    highlightedDays?: { date: number; count: number }[];
  }
) {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const index = (!props.outsideCurrentMonth &&
    highlightedDays.find((x) => {
      return x.date === props.day.date();
    })) || { count: 0 };

  return (
    <Box key={props.day.toString()} sx={{ mb: 1 }}>
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{ fontSize: 14 }}
      />
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          mt: -1.2,
          height: 4.4,
          justifyContent: "center",
        }}
      >
        {[...Array(Math.min(index.count, 3))].map((_, f) => (
          <Box
            key={f}
            sx={{
              width: 3,
              height: 3,
              background: palette[9],
              borderRadius: 9,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

/**
 * Date fetching with abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
 * ⚠️ No IE11 support
 */
function fetchDateData(
  session,
  date: Dayjs,
  { signal }: { signal: AbortSignal }
) {
  return new Promise<{ daysToHighlight: { date: number; count: number }[] }>(
    async (resolve, reject) => {
      const data = await fetchRawApi(session, "property/tasks/count", {
        startTime: dayjs(date).isValid()
          ? dayjs(date).startOf("month").toISOString()
          : dayjs().startOf("month").toISOString(),
        endTime: dayjs(date).isValid()
          ? dayjs(date).endOf("month").toISOString()
          : dayjs().startOf("month").toISOString(),
      });

      const daysToHighlight = data.map(({ due }) => {
        const dayOfMonth = dayjs(due).date();
        return {
          date: dayjs(due).date(),
          count: data
            .filter(({ due }) => dayjs(due).date() === dayOfMonth)
            .reduce((sum, obj) => sum + obj._count._all, 0),
        };
      });
      resolve({ daysToHighlight });

      signal.onabort = () => {
        reject(new DOMException("aborted", "AbortError"));
      };
    }
  );
}

export interface DateTimeModalProps {
  ref?: any;
  date: Dayjs | Date | null;
  setDate: (v: any) => void;
  children: JSX.Element;
  dateOnly?: boolean;
  disabled?: boolean;
  closeOnSelect?: boolean;
  type?: "day" | "month" | "year";
  isDateOnly?: boolean;
  setDateOnly?: (d) => void;
}

const SelectDateModal = React.memo(function SelectDateModal({
  date,
  setDate,
  children,
  dateOnly = false,
  disabled = false,
  closeOnSelect = false,
  type = "day",
  isDateOnly = false,
  setDateOnly = (d) => {},
}: DateTimeModalProps) {
  const { session } = useSession();

  const [open, setOpen] = useState<boolean>(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const today = new Date(dayjs().startOf("day").toISOString());

  const [_date, _setDate] = useState(
    date || dayjs().set("hour", 0).set("minute", 0)
  );

  const handleClick = () => setTimeOpen((s) => !s);

  const trigger = cloneElement(children, {
    onClick: () => setOpen(true),
  });

  const initialValue = useMemo(() => dayjs(date || dayjs()), [date]);

  const requestAbortController = React.useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState<
    { date: number; count: number }[]
  >([]);

  const fetchHighlightedDays = useCallback(
    (date: Dayjs) => {
      const controller = new AbortController();
      fetchDateData(session, date, {
        signal: controller.signal,
      })
        .then(({ daysToHighlight }) => {
          setHighlightedDays(daysToHighlight);
          setIsLoading(false);
        })
        .catch((error) => {
          // ignore the error if it's caused by `controller.abort`
          if (error.name !== "AbortError") {
            throw error;
          }
        });

      requestAbortController.current = controller;
    },
    [session]
  );

  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, [fetchHighlightedDays, initialValue]);

  const handleMonthChange = (date: Dayjs) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };
  if (disabled) return children;
  return (
    <>
      {trigger}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          // for moving unfinished tasks
          zIndex: 9999,
        }}
        PaperProps={{
          sx: {
            width: { xs: "calc(100dvw - 40px)", sm: "350px" },
            mb: "20px",
            border: `2px solid ${palette[4]}`,
            borderRadius: 5,
            mx: { xs: "auto", sm: "auto" },
          },
        }}
      >
        <Puller showOnDesktop sx={{ mt: 1, mb: -2 }} />
        {timeOpen ? (
          <motion.div
            key="time"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <StaticTimePicker
              defaultValue={dayjs(date)}
              minutesStep={5}
              sx={{
                "& .MuiPickersToolbar-root, & .MuiPickersToolbar-content": {
                  justifyContent: "center",
                  width: "auto",
                  alignItems: "center",
                },
                "& .MuiDialogActions-root": {
                  borderTop: `2px solid ${palette[3]}`,
                  mt: -1,
                },
                "& .MuiTimeClock-root": {
                  mt: -3,
                },
                "& .MuiDialogActions-root .MuiButton-root": {
                  px: 0,
                  "&:first-child": {
                    mr: "auto",
                    background: palette[isDateOnly ? 3 : 1],
                  },
                  "&:last-child": {
                    background: palette[3],
                  },
                },
              }}
              onChange={(newValue: any) => _setDate(newValue)}
              slotProps={{
                actionBar: {
                  actions: ["clear", "cancel", "accept"],
                },
                previousIconButton: {
                  sx: { display: "none" },
                },
                nextIconButton: {
                  sx: { display: "none" },
                },
                toolbar: {
                  className: "toolbar",
                },
                layout: {
                  onCancel: () => {
                    setTimeOpen(false);
                  },
                  onClear: () => {
                    setDateOnly(true);
                    setDate(dayjs(date).set("hour", 0).set("minute", 0));
                    setTimeOpen(false);
                  },
                  onAccept: () => {
                    setDateOnly(false);
                    setDate(
                      dayjs(date)
                        .set("hour", dayjs(_date).hour())
                        .set("minute", dayjs(_date).minute())
                    );
                    setTimeOpen(false);
                    setOpen(false);
                  },
                },
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="date"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                px: 4,
                mt: 3,
                mb: 1,
                "&::-webkit-scrollbar": { display: "none" },
                overflow: "scroll",
                maxWidth: "100%",
              }}
            >
              {[
                { label: "Today", date: dayjs(today) },
                { label: "Tomorrow", date: dayjs(today).add(1, "day") },
                {
                  label: `Next ${dayjs().format("dddd")}`,
                  date: dayjs(today).add(1, "week"),
                },
                {
                  label: `Next ${dayjs().format("MMMM")}`,
                  date: dayjs(today).add(1, "month"),
                },
              ].map((chip) => (
                <Chip
                  label={chip.label}
                  key={chip.label}
                  onClick={() => {
                    setDate(chip.date.toDate());
                    setTimeOpen(false);
                    closeOnSelect && setOpen(false);
                  }}
                />
              ))}
            </Box>
            {type === "day" ? (
              <DateCalendar
                defaultValue={initialValue}
                loading={isLoading}
                onMonthChange={handleMonthChange}
                renderLoading={() => <DayCalendarSkeleton />}
                onChange={(newValue) => {
                  if (!newValue) return;
                  setDate(
                    dayjs(date || new Date())
                      .set("date", newValue.date())
                      .set("month", newValue.month())
                      .set("year", newValue.year())
                      .set(
                        "hour",
                        dayjs(_date).hour() >= 0 ? dayjs(_date).hour() : 0
                      )
                      .set(
                        "minute",
                        dayjs(_date).minute() >= 0 ? dayjs(_date).minute() : 0
                      )
                  );
                  closeOnSelect && setOpen(false);
                }}
                slots={{
                  day: ServerDay,
                }}
                slotProps={{
                  // convert object to (ownerstate) function if you wanna add this functionality in the future
                  day: {
                    highlightedDays,
                    // hoveredDay,
                    // onPointerEnter: () => setHoveredDay(ownerState.day),
                    // onPointerLeave: () => setHoveredDay(null),
                  } as any,
                }}
              />
            ) : type === "month" ? (
              <MonthCalendar
                sx={{
                  mx: "auto",
                  my: 2,
                }}
                defaultValue={initialValue}
                onChange={(newValue) => {
                  if (!newValue) return;
                  setDate(dayjs(date).set("month", newValue.month()));
                  closeOnSelect && setOpen(false);
                }}
              />
            ) : (
              <YearCalendar
                sx={{
                  mx: "auto",
                  my: 2,
                }}
                defaultValue={initialValue}
                onChange={(newValue) => {
                  if (!newValue) return;
                  setDate(dayjs(date).set("year", newValue.year()));
                  closeOnSelect && setOpen(false);
                }}
              />
            )}
          </motion.div>
        )}
        {!dateOnly && !timeOpen && (
          <Box
            sx={{
              p: 2,
              pt: 0,
              width: "100%",
            }}
          >
            <Button
              disableRipple
              fullWidth
              variant="contained"
              id="timeTrigger"
              sx={{ mt: 2 }}
              onClick={handleClick}
              disabled={!date || !dayjs(date).isValid()}
            >
              <Icon>{timeOpen ? "today" : "access_time"}</Icon>
              {dayjs(date).isValid() && !isDateOnly
                ? dayjs(date).format(timeOpen ? "MMM D" : "h:mm a")
                : `Set time`}
            </Button>
          </Box>
        )}
      </SwipeableDrawer>
    </>
  );
});
export default SelectDateModal;
