import { createStyles, MantineProvider } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { colors } from "../../lib/colors";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useState } from "react";
import { mutate } from "swr";
import { Puller } from "../Puller";
import Link from "@mui/material/Link";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";

const useStyles = createStyles(() => ({
  outside: {},
  weekend: {
    color: "inherit !important",
  },
}));

/**
 * Calendar component for create reminder popup
 * @returns {any}
 */
function CalendarFeedModal(): JSX.Element {
  const [open, setOpen] = useState(false);
  const url = `https://my.smartlist.tech/api/property/maintenance/feed?property=${global.property.propertyId}&accessToken=${global.property.accessToken}`;
  return (
    <>
      <SwipeableDrawer
        disableSwipeToOpen
        swipeAreaWidth={0}
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            mx: "auto",
            maxWidth: "500px",
            minHeight: "100px",
            minWidth: "auto",
            background: global.user.darkMode
              ? "hsl(240, 11%, 18%)"
              : colors[themeColor][50],
            borderRadius: "20px 20px 0 0",
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recieve reminders and updates to your calendar!
          </Typography>
          <TextField
            inputProps={{
              readOnly: true,
            }}
            value={url}
            variant="filled"
            fullWidth
            label="Calendar feed URL"
            sx={{ mb: 2 }}
          />
          <Link
            target="_blank"
            href="https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DDesktop"
          >
            Instructions for Google Calendar
          </Link>
          <br />
          <Link
            target="_blank"
            href="https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-on-the-web-503ffaf6-7b86-44fe-8dd6-8099d95f38df#:~:text=Note%3A%C2%A0If%20the%20instructions%20don%27t%20match%20what%20you%20see%2C%20you%20might%20be%20using%20an%20older%20version%20of%20Outlook%20on%20the%20web.%20Try%20the%20Instructions%20for%20classic%20Outlook%20on%20the%20web."
          >
            Instructions for Outlook
          </Link>
          <br />
          <Link
            target="_blank"
            href="https://support.apple.com/guide/calendar/subscribe-to-calendars-icl1022/mac#:~:text=Subscribe%20to%20a%20calendar&text=Enter%20the%20calendar's%20web%20address,an%20account%20for%20the%20subscription."
          >
            Instructions for Apple calendar
          </Link>
        </Box>
      </SwipeableDrawer>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          px: 3,
          py: 1,
          background: `${colors.green["A700"]}!important`,
          borderRadius: 999,
          gap: 2,
          mr: { sm: 2 },
        }}
        disableElevation
        disabled={global.property.permission === "read-only"}
      >
        <span className="material-symbols-rounded">more_vert</span>
      </Button>
    </>
  );
}

/**
 * Date calendar component
 * @param {any} {date
 * @param {any} formik}
 * @returns {any}
 */
function SelectDateCalendar({ date, formik }: { date: Date; formik }) {
  const [open, setOpen] = useState(false);
  const { classes, cx } = useStyles();
  useStatusBar(open, 1);

  return (
    <>
      <SwipeableDrawer
        disableSwipeToOpen
        swipeAreaWidth={0}
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            mx: "auto",
            maxWidth: "500px",
            minHeight: "100px",
            minWidth: "auto",
            background: global.user.darkMode
              ? "hsl(240, 11%, 18%)"
              : colors[themeColor][50],
            borderRadius: "20px 20px 0 0",
          },
        }}
      >
        <Puller />
        {/* <DatePicker locale="de" /> */}
        <Box
          sx={{
            p: 4,
            mt: 2,
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          {global.user.darkMode ? (
            <MantineProvider
              theme={{
                colorScheme: "dark",
              }}
              withGlobalStyles
              withNormalizeCSS
            >
              <Calendar
                dayClassName={(date, modifiers) =>
                  cx({
                    [classes.outside]: modifiers.outside,
                    [classes.weekend]: modifiers.weekend,
                  })
                }
                onChange={(date) => {
                  formik.setFieldValue("nextDue", date);
                  setOpen(false);
                }}
                value={date}
              />
            </MantineProvider>
          ) : (
            <Calendar
              disableOutsideEvents
              dayClassName={(date, modifiers) =>
                cx({
                  [classes.outside]: modifiers.outside,
                  [classes.weekend]: modifiers.weekend,
                })
              }
              onChange={(date) => {
                formik.setFieldValue("nextDue", date);
                setOpen(false);
              }}
            />
          )}
        </Box>
      </SwipeableDrawer>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ width: "100%", my: 1, borderRadius: 9 }}
      >
        {date ? dayjs(date).format("MMM D, YYYY") : "Select date"}
      </Button>
    </>
  );
}

/**
 * Select frequency settiong
 * @param {any} {name
 * @param {any} formik}
 * @returns {any}
 */
function FrequencySetting({ name, formik }: { name: string; formik }) {
  return (
    <Button
      onClick={() => formik.setFieldValue("frequency", name)}
      sx={{
        px: 3,
        width: "33.9%",
        borderRadius: 999,
        height: 40,
        transition: "none!important",
        textTransform: "capitalize",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        ...(formik.values.frequency === name && {
          background: `${
            colors[themeColor][global.theme !== "dark" ? 100 : 900]
          }!important`,
          color: `${
            colors[themeColor][global.user.darkMode ? 50 : 900]
          }!important`,
        }),
      }}
    >
      {formik.values.frequency === name && (
        <span
          className="material-symbols-rounded"
          style={{ marginRight: "10px" }}
        >
          check
        </span>
      )}
      {name}
    </Button>
  );
}

/**
 * Create maintenance modal
 * @returns {any}
 */
function CreateMaintenanceModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  useStatusBar(open);

  const formik = useFormik({
    initialValues: {
      name: "",
      frequency: "monthly",
      nextDue: new Date().toISOString(),
      note: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      fetchApiWithoutHook("property/maintenance/create", {
        name: values.name,
        frequency: values.frequency,
        nextDue: values.nextDue,
        lastCompleted: new Date().toISOString(),
      }).then(() => {
        setLoading(false);
        setOpen(false);
        mutate(
          `/api/property/maintenance/reminders?${new URLSearchParams({
            property: global.property.propertyId,
            accessToken: global.property.accessToken,
          }).toString()}`
        );
      });
    },
  });

  return (
    <>
      <SwipeableDrawer
        disableSwipeToOpen
        swipeAreaWidth={0}
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            mx: "auto",
            maxWidth: "500px",
            background: global.user.darkMode
              ? "hsl(240, 11%, 18%)"
              : colors[themeColor][50],
            borderRadius: "20px 20px 0 0",
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 4, mt: 2, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "600" }}>
            Create reminder
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="name"
              required
              variant="filled"
              name="name"
              label="Name"
              autoComplete="off"
              value={formik.values.name}
              onChange={formik.handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              id="note"
              variant="filled"
              name="note"
              label="Add a note..."
              multiline
              minRows={3}
              autoComplete="off"
              value={formik.values.note}
              onChange={formik.handleChange}
              sx={{ mb: 2 }}
            />
            <SelectDateCalendar
              date={new Date(formik.values.nextDue)}
              formik={formik}
            />
            <ButtonGroup
              variant="outlined"
              sx={{
                flexBasis: "0",
                display: "flex",
                width: "100%",
              }}
              aria-label="outlined primary button group"
            >
              <FrequencySetting name="weekly" formik={formik} />
              <FrequencySetting name="monthly" formik={formik} />
              <FrequencySetting name="annually" formik={formik} />
            </ButtonGroup>

            <LoadingButton
              variant="contained"
              disableElevation
              fullWidth
              loading={loading}
              sx={{
                gap: 2,
                mt: 3,
                borderRadius: 5,
                boxShadow: "none!important",
              }}
              size="large"
              type="submit"
            >
              Set reminder
            </LoadingButton>
          </form>
        </Box>
      </SwipeableDrawer>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          width: { xs: "100%", sm: "auto" },
          px: 3,
          py: 1,
          mr: { sm: 1 },
          background: `${colors.green["A700"]}!important`,
          borderRadius: 999,
          gap: 2,
        }}
        disableElevation
        disabled={global.property.permission === "read-only"}
      >
        <span className="material-symbols-rounded">add</span>
        New task
      </Button>
    </>
  );
}

/**
 * Bannner for maintenance, which shows upcoming tasks the current week
 * @param {any} {count}
 * @returns {any}
 */
export function Header({ count }) {
  return (
    <>
      <Box sx={{ p: { sm: 3 }, pt: { sm: 1 } }}>
        <Box
          sx={{
            width: "100%",
            background: `linear-gradient(45deg, ${
              colors.green[global.user.darkMode ? 900 : 100]
            } 0%, ${colors.green[global.user.darkMode ? 500 : 100]} 50%, ${
              colors.green[global.user.darkMode ? 700 : 100]
            } 100%)`,
            color: `${
              colors.green[!global.user.darkMode ? 900 : 100]
            } !important`,
            height: { xs: "300px", sm: "320px" },
            borderRadius: { sm: 10 },
            flexDirection: "column",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h1">{count}</Typography>
          <Typography variant="h6">Upcoming tasks this week</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          px: { xs: 5, sm: 5 },
          py: { xs: 3, sm: 0 },
          background: { xs: colors.green["100"], sm: "transparent" },
          borderBottomRightRadius: { xs: 30, sm: 0 },
          borderBottomLeftRadius: { xs: 30, sm: 0 },
          textAlign: { xs: "center", sm: "right" },

          display: { xs: "flex", sm: "block" },
          gap: 2,
        }}
      >
        <CreateMaintenanceModal />
        <CalendarFeedModal />
      </Box>
    </>
  );
}
