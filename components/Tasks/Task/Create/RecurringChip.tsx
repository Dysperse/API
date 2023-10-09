import { Puller } from "@/components/Puller";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
  Icon,
  MenuItem,
  Select,
  SwipeableDrawer,
  SxProps,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { RRule } from "rrule";

function DayOfWeekPicker({ daysOfWeek, setDaysOfWeek }) {
  const [open, setOpen] = useState(false);

  const options = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <>
      <u onClick={() => setOpen(true)}>
        {daysOfWeek.length == 0 ? (
          <i style={{ marginLeft: "-7px" }}>Select days</i>
        ) : daysOfWeek.length == 1 ? (
          options[daysOfWeek[0]]
        ) : (
          daysOfWeek.length + " days"
        )}
      </u>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { p: 3 } }}
      >
        <Typography className="font-heading" variant="h3" sx={{ mb: 2 }}>
          Select days
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {options.map((day, index) => (
            <Chip
              label={day}
              icon={<Icon>{daysOfWeek.includes(index) ? "check" : "add"}</Icon>}
              key={day}
              onClick={() => {
                if (!daysOfWeek.includes(index)) {
                  setDaysOfWeek((d) => [...d, index]);
                } else {
                  setDaysOfWeek((d) => d.filter((_, f) => f !== index));
                }
              }}
            />
          ))}
        </Box>
        <Button
          onClick={() => setOpen(false)}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Done<Icon>check</Icon>
        </Button>
      </Dialog>
    </>
  );
}

function MonthPicker({ isMonth, months, setMonths }) {
  const [open, setOpen] = useState(false);

  const options = [
    "January",
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

  return (
    <>
      <u onClick={() => setOpen(true)}>
        {months.length == 1
          ? options[months[0]]
          : months.length + " days" || <i>Select days</i>}
      </u>
      <SwipeableDrawer
        open={open}
        anchor="bottom"
        onClose={() => setOpen(false)}
      >
        <Puller showOnDesktop />
        <Box sx={{ display: "flex", flexWrap: "wrap", p: 1, gap: 1 }}>
          {options.map((day, index) => (
            <Chip
              label={day}
              icon={<Icon>{months.includes(index) ? "check" : "add"}</Icon>}
              key={day}
              onClick={() => {
                if (!months.includes(index)) {
                  setMonths((d) => [...d, index]);
                } else {
                  setMonths((d) => d.filter((_, f) => f !== index));
                }
              }}
            />
          ))}
        </Box>
      </SwipeableDrawer>
    </>
  );
}

function ServerDay(props: any) {
  const { session } = useSession();
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const green = useColor("green", useDarkMode(session.darkMode));

  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      variant="dot"
      sx={{
        "& .MuiBadge-badge": {
          background: isSelected ? green[9] : "transparent",
        },
      }}
      badgeContent={isSelected ? 1 : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

export const RecurringChip = React.memo(function RecurringChip({
  data,
  setData,
  chipStyles,
}: {
  data: any;
  setData: any;
  chipStyles: (d) => SxProps;
}) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);
  const [freq, setFreq] = useState("weekly");
  const [count, setCount] = useState(null);
  const [interval, setInterval] = useState(1);
  const [daysOfWeek, setDaysOfWeek] = useState([dayjs().isoWeekday() - 1]);
  const [untilDate, setUntilDate] = useState(null);

  const [value, setValue] = useState<RRule | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);

  const save = () => {
    const rrule = new RRule({
      freq: RRule[freq.toUpperCase()],
      interval,
      wkst: RRule.SU,
      byweekday: daysOfWeek.map(
        (day) => RRule[["MO", "TU", "WE", "TH", "FR", "SA", "SU"][day]]
      ),
      count,
      ...(untilDate !== null && { until: new Date(untilDate) }),
    });
    setData((d) => ({ ...d, recurrenceRule: rrule }));
    setConfirmOpen(false);
    setOpen(false);
  };

  const handleSave = () => {
    const rrule = new RRule({
      freq: RRule[freq.toUpperCase()],
      interval,
      wkst: RRule.SU,
      byweekday: daysOfWeek.map(
        (day) => RRule[["MO", "TU", "WE", "TH", "FR", "SA", "SU"][day]]
      ),
      count,
      ...(untilDate !== null && { until: new Date(untilDate) }),
    });

    setValue(rrule);
    setConfirmOpen(true);
  };

  const styles = {
    "&.MuiChip-outlined": {
      background: "transparent",
    },
  };

  const handleMonthChange = (date) => {
    const start = date.startOf("month");
    const end = date.endOf("month");
    const highlights = value?.between(start.toDate(), end.toDate());
    setHighlightedDays(
      highlights?.map((highlight) => dayjs(highlight).date()) || [0]
    );
  };

  useEffect(() => {
    if (confirmOpen && value) {
      handleMonthChange(dayjs());
    }
  }, [confirmOpen, value]);

  return (
    <>
      <Tooltip
        placement="top"
        title={
          data.recurrenceRule
            ? capitalizeFirstLetter(data.recurrenceRule.toText())
            : "Repeats?"
        }
      >
        <Chip
          onClick={() => setOpen(true)}
          label="Repeat"
          sx={chipStyles(data.recurrenceRule)}
          icon={<Icon>repeat</Icon>}
        />
      </Tooltip>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ opacity: 0.6, fontWeight: 900 }}>
            CONFIRM?
          </Typography>
          <Typography variant="h4" className="font-heading">
            {value && value.toText()}
          </Typography>
        </Box>
        <DateCalendar
          minDate={dayjs()}
          readOnly
          onMonthChange={handleMonthChange}
          slotProps={{
            day: {
              highlightedDays,
            } as any,
          }}
          slots={{
            day: ServerDay,
          }}
        />
        <Box sx={{ p: 2, pt: 0 }}>
          <Button variant="contained" fullWidth onClick={save} sx={{ mt: -5 }}>
            Save <Icon>check</Icon>
          </Button>
        </Box>
      </Dialog>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClick={(e) => e.stopPropagation()}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            maxWidth: "100dvw",
            width: "900px",
          },
        }}
      >
        <Puller showOnDesktop />
        <Box sx={{ px: 2, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography>Every</Typography>
            <Chip
              sx={styles}
              {...(interval === 1 && { variant: "outlined" })}
              label={
                <TextField
                  type="number"
                  placeholder="Interval"
                  variant="standard"
                  sx={{ width: "40px" }}
                  defaultValue={interval}
                  onBlur={(e: any) => setInterval(e.target.value)}
                  InputProps={{ disableUnderline: true }}
                />
              }
              {...(interval > 1 && { onDelete: () => setInterval(1) })}
            />
            <Chip
              sx={styles}
              label={
                <Select
                  value={freq}
                  label="Age"
                  disableUnderline
                  variant="standard"
                  onChange={(e) => setFreq(e.target.value)}
                >
                  <MenuItem value="daily">day{interval !== 1 && "s"}</MenuItem>
                  <MenuItem value="weekly">
                    week{interval.toString() !== "1" && "s"}
                  </MenuItem>
                  <MenuItem value="monthly">
                    month{interval.toString() !== "1" && "s"}
                  </MenuItem>
                  <MenuItem value="yearly">
                    year{interval.toString() !== "1" && "s"}
                  </MenuItem>
                </Select>
              }
            />
            <Chip
              sx={{ fontSize: "15px", ...styles }}
              {...(daysOfWeek.length === 0 && {
                variant: "outlined",
                icon: <Icon>add_circle</Icon>,
              })}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  on
                  <DayOfWeekPicker
                    daysOfWeek={daysOfWeek}
                    setDaysOfWeek={setDaysOfWeek}
                  />
                </Box>
              }
              {...(daysOfWeek.length > 0 && {
                onDelete: () => setDaysOfWeek([]),
              })}
            />
            <Chip
              disabled={untilDate !== null}
              sx={{ fontSize: "15px", ...styles }}
              {...(!count && {
                variant: "outlined",
                icon: <Icon>add_circle</Icon>,
              })}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  for
                  <TextField
                    type="number"
                    placeholder="#"
                    variant="standard"
                    sx={{ width: "40px" }}
                    defaultValue={count}
                    onBlur={(e: any) =>
                      setCount(e.target.value < 0 ? 0 : e.target.value)
                    }
                    InputProps={{ disableUnderline: true }}
                  />
                  times
                </Box>
              }
              onDelete={Boolean(count) ? () => setCount(null) : undefined}
            />
            <Chip
              disabled={!!count}
              sx={{ fontSize: "15px", ...styles }}
              {...(untilDate === null && {
                variant: "outlined",
                icon: <Icon>add_circle</Icon>,
              })}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  until
                  <TextField
                    type="date"
                    placeholder="#"
                    variant="standard"
                    sx={{ width: "150px" }}
                    defaultValue={untilDate}
                    onBlur={(e: any) => {
                      if (e.target.value) {
                        setUntilDate(e.target.value);
                        setCount(null);
                      }
                    }}
                    inputProps={{
                      min: dayjs().format("YYYY-MM-DD"),
                    }}
                    InputProps={{ disableUnderline: true }}
                  />
                </Box>
              }
              {...(untilDate !== null && {
                onDelete: () => setUntilDate(null),
              })}
            />
          </Box>
          <Button variant="contained" fullWidth onClick={handleSave}>
            Continue <Icon>east</Icon>
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
});
