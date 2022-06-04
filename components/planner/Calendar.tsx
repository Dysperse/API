import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useState } from "react";
import useFetch from "react-fetch-hook";
import toast from "react-hot-toast";
import { Puller } from "../Puller";

global.setEvents = (_e) => {};
global.events = [];

function Calendar() {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/planner/events/",
    {
      method: "POST",
      body: new URLSearchParams({
        token: global.session && global.session.accessToken,
      }),
    }
  );
  const [open, setOpen] = useState<boolean>(false);
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("false");
  const [id, setId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      title: "",
      type: "meal",
      field1: "breakfast",
      startDate: "",
      endDate: "",
    },
    onSubmit: async (values: {
      title: string;
      type: string;
      field1: string;
      startDate: string;
      endDate: string;
    }) => {
      setLoading(true);
      fetch("https://api.smartlist.tech/v2/planner/create/", {
        method: "POST",
        body: new URLSearchParams({
          token: session && session.accessToken,
          startDate: values.startDate,
          endDate: values.endDate,
          type: values.type,
          title: values.title,
          field1: values.field1,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          toast.success("Created!");
          setLoading(false);
          global.setEvents([
            ...global.events,
            {
              title: values.title,
              start: values.startDate,
              end: values.endDate,
              EventId: res.data.id,
            },
          ]);
          formik.resetForm();
          setOpen(false);
        });
    },
  });
  return (
    <Box sx={{ py: 5 }}>
      <SwipeableDrawer
        onClose={() => setInfoModalOpen(false)}
        onOpen={() => setInfoModalOpen(true)}
        open={infoModalOpen}
        keepMounted
        swipeAreaWidth={0}
        anchor="bottom"
        sx={{
          display: "flex",
          alignItems: { xs: "end", sm: "center" },
          height: "100vh",
          justifyContent: "center",
        }}
        PaperProps={{
          sx: {
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 20%)",
            }),
            borderRadius: "28px",
            borderBottomLeftRadius: { xs: 0, sm: "28px!important" },
            borderBottomRightRadius: { xs: 0, sm: "28px!important" },
            position: "unset",
            mx: "auto",
            maxWidth: { sm: "50vw", xs: "100vw" },
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ py: 6, px: 7 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "600" }}>
            {title}
          </Typography>
          <LoadingButton
            loading={deleteLoading}
            onClick={() => {
              fetch("https://api.smartlist.tech/v2/planner/delete/", {
                method: "POST",
                body: new URLSearchParams({
                  token: session && session.accessToken,
                  id: id.toString(),
                }),
              }).then((res) => {
                setDeleteLoading(false);
                setInfoModalOpen(false);
                global.setEvents(
                  global.events.filter((event) => event.EventId !== id)
                );
              });
              setDeleteLoading(true);
            }}
            variant="contained"
            sx={{ borderRadius: 5, boxShadow: 0, mt: 2 }}
            size="large"
          >
            Delete
          </LoadingButton>
        </Box>
      </SwipeableDrawer>
      <SwipeableDrawer
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        keepMounted
        swipeAreaWidth={0}
        anchor="bottom"
        sx={{
          display: "flex",
          alignItems: { xs: "end", sm: "center" },
          height: "100vh",
          justifyContent: "center",
        }}
        PaperProps={{
          sx: {
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 20%)",
            }),
            borderRadius: "28px",
            borderBottomLeftRadius: { xs: 0, sm: "28px!important" },
            borderBottomRightRadius: { xs: 0, sm: "28px!important" },
            position: "unset",
            mx: "auto",
            maxWidth: { sm: "50vw", xs: "100vw" },
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ display: { sm: "hidden" } }}>
          <Puller />
        </Box>
        <Box sx={{ py: 6, px: 7 }}>
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "600" }}>
              Create
            </Typography>

            <FormControl sx={{ my: 2 }}>
              <FormLabel id="demo-controlled-radio-buttons-group">
                What are you planning?
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={formik.values.type}
                onChange={(_e, v) => formik.setFieldValue("type", v)}
              >
                <FormControlLabel
                  value="meal"
                  control={<Radio />}
                  label="a meal"
                />
                <FormControlLabel
                  value="workout"
                  control={<Radio />}
                  label="a workout"
                />
                <FormControlLabel
                  value="chores"
                  control={<Radio />}
                  label="chores"
                />
                <FormControlLabel
                  value="something else"
                  control={<Radio />}
                  label="something else"
                />
              </RadioGroup>
            </FormControl>
            {formik.values.type === "meal" ? (
              <>
                <TextField
                  autoFocus
                  value={formik.values.title}
                  onChange={(e) =>
                    formik.setFieldValue("title", e.target.value)
                  }
                  label="What are you cooking?"
                  variant="filled"
                  fullWidth
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel variant="filled" id="demo-simple-select-label">
                    Type
                  </InputLabel>
                  <Select
                    MenuProps={{
                      BackdropProps: {
                        sx: { opacity: "0!important" },
                      },
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "center",
                      },
                      transformOrigin: {
                        vertical: "center",
                        horizontal: "center",
                      },
                      PaperProps: {
                        sx: {
                          px: 1,
                          borderRadius: 3,
                          background:
                            colors[themeColor][
                              global.theme === "dark" ? 900 : 100
                            ],
                        },
                      },
                      sx: {
                        "& .MuiMenuItem-root ": {
                          borderRadius: 3,
                          px: 3,
                          mb: 0.1,
                          py: 1.5,
                          "&:hover": {
                            backgroundColor: "rgba(200,200,200,.1)",
                          },
                        },
                        "& .Mui-selected": { pointerEvents: "none" },
                      },
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formik.values.field1}
                    onChange={(_e, v) =>
                      formik.setFieldValue("field1", _e.target.value)
                    }
                    variant="filled"
                    label="Age"
                  >
                    <MenuItem value={"breakfast"}>Breakfast</MenuItem>
                    <MenuItem value={"lunch"}>Lunch</MenuItem>
                    <MenuItem value={"dinner"}>Dinner</MenuItem>
                  </Select>
                </FormControl>
              </>
            ) : (
              <></>
            )}
            <input
              value={formik.values.startDate}
              type="hidden"
              onChange={(e) =>
                formik.setFieldValue("startDate", e.target.value)
              }
              name="startDate"
              id="planner-startDate"
            />
            <input
              value={formik.values.endDate}
              type="hidden"
              onChange={(e) => formik.setFieldValue("endDate", e.target.value)}
              name="endDate"
              id="planner-endDate"
            />
            <LoadingButton
              loading={loading}
              variant="contained"
              size="large"
              type="submit"
              sx={{ float: "right", mt: 3, borderRadius: 4, boxShadow: "none" }}
            >
              Create
            </LoadingButton>
          </form>
        </Box>
      </SwipeableDrawer>

      {isLoading ? (
        <>
          <Skeleton
            variant="rectangular"
            sx={{ borderRadius: 5 }}
            animation="wave"
            height={"500px"}
          />
        </>
      ) : (
        <EventCalendar
          setInfoModalOpen={setInfoModalOpen}
          setId={setId}
          setOpen={setOpen}
          setTitle={setTitle}
          formik={formik}
          data={data}
        />
      )}
    </Box>
  );
}

function EventCalendar({
  data,
  formik,
  setInfoModalOpen,
  setTitle,
  setId,
  setOpen,
}: any) {
  const [events, setEvents] = useState(
    data.data.map((event) => {
      return {
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        EventId: event.id,
      };
    })
  );

  global.setEvents = setEvents;
  global.events = events;

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      editable
      initialView="dayGridWeek"
      selectable
      height="500px"
      titleFormat={{ month: "long", day: "numeric" }}
      eventClick={(info: any) => {
        setInfoModalOpen(true);
        setTitle(info.event.title);
        setId(info.event.extendedProps.EventId);
      }}
      headerToolbar={{
        start: "title", // will normally be on the left. if RTL, will be on the right
        center: "",
        end: "today prev,next", // will normally be on the right. if RTL, will be on the left
      }}
      select={(info) => {
        setOpen(true);
        formik.setFieldValue("startDate", info.startStr);
        formik.setFieldValue("endDate", info.endStr);
      }}
      events={events}
    />
  );
}

export default Calendar;
