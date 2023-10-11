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
  FormControlLabel,
  Icon,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SwipeableDrawer,
  SxProps,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DateCalendar, DatePicker, PickersDay } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";
import { RRule } from "rrule";

function DayOfWeekPicker({ daysOfWeek, setDaysOfWeek }) {
  const [open, setOpen] = useState(false);

  const options = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outlined" sx={{ px: 2 }}>
        <Icon className="outlined">wb_sunny</Icon>
        {daysOfWeek.length == 0 ? (
          <i>Select days</i>
        ) : daysOfWeek.length == 1 ? (
          options[daysOfWeek[0]]
        ) : (
          daysOfWeek.length + " days"
        )}
      </Button>
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
              variant={
                daysOfWeek.includes(index.toString()) ? undefined : "outlined"
              }
              sx={{
                ...(!daysOfWeek.includes(index.toString()) && {
                  background: "transparent",
                }),
              }}
              icon={
                <Icon>
                  {daysOfWeek.includes(index.toString()) ? "check" : "add"}
                </Icon>
              }
              key={day}
              onClick={() => {
                if (daysOfWeek.includes(index.toString())) {
                  setDaysOfWeek((d) => d.filter((f) => f !== index.toString()));
                } else {
                  setDaysOfWeek((d) => [...d, index.toString()]);
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

function MonthPicker({ months, setMonths }) {
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
      <Button onClick={() => setOpen(true)} variant="outlined" sx={{ px: 2 }}>
        <Icon className="outlined">calendar_month</Icon>
        {months.length == 0 ? (
          <i>Select months</i>
        ) : months.length == 1 ? (
          options[months[0]]
        ) : (
          months.length + " months"
        )}
      </Button>
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
  const [daysOfWeek, setDaysOfWeek] = useState([
    (dayjs().isoWeekday() - 1).toString(),
  ]);
  const [bymonthday, setBymonthday] = useState(null);
  const [months, setMonths] = useState([]);
  const [untilDate, setUntilDate] = useState(null);

  const [value, setValue] = useState<RRule | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);

  const save = () => {
    setData((d) => ({ ...d, recurrenceRule: rrule }));
    setConfirmOpen(false);
    setOpen(false);
  };

  const rrule = new RRule({
    freq: RRule[freq.toUpperCase()],
    interval,
    wkst: RRule.SU,
    count,
    byweekday:
      freq !== "weekly"
        ? undefined
        : daysOfWeek.map(
            (day) =>
              RRule[["SU", "MO", "TU", "WE", "TH", "FR", "SA"][parseInt(day)]]
          ),
    bymonthday:
      bymonthday && freq === "monthly" ? parseInt(bymonthday) : undefined,
    ...(months.length > 0 &&
      freq == "weekly" && { bymonth: months.map((month) => month + 1) }),
    ...(untilDate !== null && { until: new Date(untilDate) }),
  });

  const handleSave = () => {
    setValue(rrule);
    handleMonthChange(dayjs());
    setConfirmOpen(true);
  };

  const handleMonthChange = (date: Dayjs) => {
    const startOfMonth = date.utc().startOf("month").toDate();
    const endOfMonth = date.utc().endOf("month").toDate();

    // Generate the dates based on your recurrence rule
    const generatedDates = rrule.between(startOfMonth, endOfMonth);

    // Filter the generated dates to include only those within the month
    const highlights = generatedDates.map((highlight) =>
      dayjs(highlight).utc().date()
    );

    setHighlightedDays(highlights || [0]);
  };

  const textStyles = useMemo(
    () => ({ opacity: 0.6, fontWeight: 900, mb: 1 }),
    []
  );

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
          icon={<Icon>loop</Icon>}
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
        variant="outlined"
      >
        <Puller showOnDesktop />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="body2" sx={textStyles}>
            REPEAT EVERY
          </Typography>
          <Box sx={{ display: "flex" }}>
            <TextField
              type="number"
              placeholder="Interval"
              value={interval}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ opacity: 0.6, mr: 1 }}>
                      {interval > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => setInterval((i) => i - 1)}
                        >
                          <Icon className="outlined">remove_circle</Icon>
                        </IconButton>
                      )}
                      {interval < 31 && (
                        <IconButton
                          size="small"
                          onClick={() => setInterval((i) => i + 1)}
                        >
                          <Icon className="outlined">add_circle</Icon>
                        </IconButton>
                      )}
                    </Box>
                    <Select
                      value={freq}
                      variant="standard"
                      onChange={(e) => setFreq(e.target.value)}
                    >
                      <MenuItem value="daily">
                        day{interval !== 1 && "s"}
                      </MenuItem>
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
                  </InputAdornment>
                ),
              }}
              onChange={(e: any) =>
                setInterval(parseInt(e.target.value <= 1 ? 1 : e.target.value))
              }
            />
          </Box>
          {freq !== "daily" && (
            <>
              <Typography
                variant="body2"
                sx={{ mt: 2, mb: 1, opacity: 0.6, fontWeight: 900 }}
              >
                ON {freq === "monthly" && "THE"}
              </Typography>
              {freq === "monthly" ? (
                <Box>
                  <TextField
                    placeholder="Enter date..."
                    value={bymonthday}
                    type="number"
                    onChange={(e: any) =>
                      setBymonthday(
                        e.target.value <= 0
                          ? 1
                          : e.target.value > 31
                          ? 31
                          : e.target.value
                      )
                    }
                  />
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <DayOfWeekPicker
                    daysOfWeek={daysOfWeek}
                    setDaysOfWeek={setDaysOfWeek}
                  />
                  <MonthPicker months={months} setMonths={setMonths} />
                </Box>
              )}
            </>
          )}
          <Typography variant="body2" sx={{ ...textStyles, mt: 2 }}>
            ENDS
          </Typography>
          <RadioGroup>
            <FormControlLabel
              label="Never"
              value="Never"
              control={
                <Radio
                  onClick={() => {
                    setUntilDate(null);
                    setCount(null);
                  }}
                  checked={!untilDate && !count}
                />
              }
            />
            <FormControlLabel
              sx={{ mb: 1, mt: 0.5 }}
              label={
                <>
                  On
                  <DatePicker
                    value={untilDate}
                    onAccept={(value) => {
                      if (value) {
                        setUntilDate(value as any);
                        setCount(null);
                      }
                    }}
                    minDate={dayjs()}
                    slotProps={{
                      textField: {
                        size: "small",
                      },
                      actionBar: {
                        actions: ["clear"],
                      },
                      layout: {
                        onClear: () => {
                          setUntilDate(null);
                        },
                      },
                    }}
                  />
                </>
              }
              value="Until"
              control={<Radio checked={Boolean(untilDate)} />}
            />
            <FormControlLabel
              label={
                <TextField
                  type="number"
                  placeholder="#"
                  size="small"
                  value={count}
                  onChange={(e: any) => {
                    setCount(e.target.value < 0 ? 0 : e.target.value);
                    setUntilDate(null);
                  }}
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">times</InputAdornment>
                    ),
                  }}
                />
              }
              value="After"
              control={<Radio checked={Boolean(count)} />}
            />
          </RadioGroup>
          <Tooltip title={capitalizeFirstLetter(rrule.toText())}>
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              fullWidth
              onClick={handleSave}
            >
              Continue <Icon>east</Icon>
            </Button>
          </Tooltip>
        </Box>
      </SwipeableDrawer>
    </>
  );
});
