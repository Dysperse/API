import { useState } from "react";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Puller } from "../Puller";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import ButtonGroup from "@mui/material/ButtonGroup";
import { DatePicker, Calendar, Month } from "@mantine/dates";
import dayjs from "dayjs";
import { MantineProvider } from "@mantine/core";
import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  outside: {},
  weekend: {
    color: "inherit !important",
  },
}));

function SelectDateCalendar({ date, formik }: { date: any; formik: any }) {
  const [open, setOpen] = useState(false);
  const { classes, cx } = useStyles();

  return (
    <>
      <SwipeableDrawer
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
            background:
              global.theme === "dark"
                ? "hsl(240, 11%, 18%)"
                : colors[themeColor][50],
            borderRadius: "30px 30px 0 0",
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
function FrequencySetting({ name, formik }: { name: string; formik: any }) {
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
          background:
            colors[themeColor][global.theme !== "dark" ? 100 : 900] +
            "!important",
          color:
            colors[themeColor][global.theme === "dark" ? 50 : 900] +
            "!important",
        }),
      }}
    >
      {formik.values.frequency === name ? (
        <span
          className="material-symbols-rounded"
          style={{ marginRight: "10px" }}
        >
          check
        </span>
      ) : (
        <></>
      )}
      {name}
    </Button>
  );
}

function CreateMaintenanceModal() {
  const [open, setOpen] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      frequency: "monthly",
      nextDue: new Date().toISOString(),
      note: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values));
    },
  });

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            mx: "auto",
            maxWidth: "500px",
            background:
              global.theme === "dark"
                ? "hsl(240, 11%, 18%)"
                : colors[themeColor][50],
            borderRadius: "30px 30px 0 0",
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
            <SelectDateCalendar date={formik.values.nextDue} formik={formik} />
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

            <Button
              variant="contained"
              disableElevation
              fullWidth
              sx={{
                gap: 2,
                mt: 3,
                borderRadius: 5,
                boxShadow: "none!important",
              }}
              size="large"
            >
              Set reminder
            </Button>
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
          mt: 2,
          background: colors.green["A700"] + "!important",
          borderRadius: 999,
          gap: 2,
        }}
        disableElevation
        disabled={global.property.permission === "read-only"}
      >
        <span className="material-symbols-rounded">add</span>
        Add new task
      </Button>
    </>
  );
}

export function Header({ count }) {
  return (
    <>
      <Box sx={{ p: { sm: 3 }, pt: { sm: 1 } }}>
        <Box
          sx={{
            width: "100%",
            background:
              "linear-gradient(45deg, " +
              colors.green[global.user.darkMode ? 900 : 100] +
              " 0%, " +
              colors.green[global.user.darkMode ? 500 : 100] +
              " 50%, " +
              colors.green[global.user.darkMode ? 700 : 100] +
              " 100%)",
            color: colors.green[global.user.darkMode ? 900 : 100],
            height: "320px",
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
      <Box sx={{ px: 5, textAlign: { xs: "center", sm: "right" } }}>
        <CreateMaintenanceModal />
      </Box>
    </>
  );
}
