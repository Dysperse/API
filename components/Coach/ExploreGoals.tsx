import Masonry from "@mui/lab/Masonry";
import { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { categories, goals } from "./goalTemplates";

import { LoadingButton } from "@mui/lab";
import {
  AppBar,
  Box,
  Button,
  FormControl,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SwipeableDrawer,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CreateGoal({ mutationUrl }) {
  const [open, setOpen] = React.useState(false);

  const [time, setTime] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setTime(event.target.value as string);
  };
  const [loading, setLoading] = React.useState(false);

  const titleRef: any = React.useRef();
  const descriptionRef: any = React.useRef();
  const durationRef: any = React.useRef();
  const goalStepName: any = React.useRef();

  const handleSubmit = async () => {
    if (!titleRef.current.value) {
      toast.error("Goal must have a name");
      return;
    }
    if (!goalStepName.current.value) {
      toast.error("Goal must have a step name.");
      return;
    }
    if (
      !durationRef.current.value ||
      parseInt(durationRef.current.value) > 100 ||
      parseInt(durationRef.current.value) < 10
    ) {
      toast.error("Goal must be between 10 and 100 days");
      return;
    }
    if (!time) {
      toast.error("Goal must have a time");
      return;
    }
    setLoading(true);

    try {
      await fetchApiWithoutHook("user/routines/create", {
        name: titleRef.current.value,
        stepName: goalStepName.current.value,
        category: "Any",
        durationDays: durationRef.current.value,
        time: time,
      });
      setLoading(false);
      await mutate(mutationUrl);
      setOpen(false);
      toast.success("Created goal!");
    } catch (e) {
      setLoading(false);
      toast.error(
        "An error occurred while trying to set your goal. Please try again."
      );
    }
  };

  return (
    <>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            backgroundColor: "hsl(240,11%,90%)",
            color: "hsl(240,11%,10%)",
            ...(global.user.darkMode && {
              backgroundColor: "hsl(240,11%,10%)",
              color: "hsl(240,11%,70%)",
            }),
          },
        }}
      >
        <Box sx={{ width: "100vw", maxWidth: "500px" }}>
          <AppBar
            elevation={0}
            sx={{
              zIndex: 1,
              background: "transparent",
              color: "hsl(240,11%,5%)",
            }}
            position="sticky"
          >
            <Toolbar sx={{ height: "64px" }}>
              <IconButton
                color="inherit"
                disableRipple
                onClick={() => setOpen(false)}
              >
                <Icon>west</Icon>
              </IconButton>
              <Typography sx={{ mx: "auto", fontWeight: "600" }}>
                Create goal
              </Typography>
              <IconButton
                color="inherit"
                disableRipple
                sx={{
                  visibility: "hidden",
                }}
                onClick={() => setOpen(false)}
              >
                <Icon>more_horiz</Icon>
              </IconButton>
            </Toolbar>
          </AppBar>

          <Box sx={{ p: 5, pt: 3 }}>
            <TextField
              inputRef={titleRef}
              variant="filled"
              label="Goal name"
              margin="dense"
            />
            <TextField
              variant="filled"
              multiline
              rows={3}
              inputRef={descriptionRef}
              label="Add a description (optional)"
              placeholder="Speak Spanish for 10 minutes, every day"
              margin="dense"
            />
            <TextField
              variant="filled"
              inputRef={goalStepName}
              margin="dense"
              label="Goal step name"
              helperText={`For example, if you want to learn a new language, the step name would be: "Practice for 30 minutes today"`}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                variant="filled"
                inputRef={durationRef}
                margin="dense"
                label="Goal duration (in days)"
              />

              <FormControl fullWidth variant="filled">
                <InputLabel id="demo-simple-select-label">
                  Time of day
                </InputLabel>
                <Select
                  margin="dense"
                  variant="filled"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={time}
                  label="Time of day"
                  fullWidth
                  onChange={handleChange}
                >
                  <MenuItem value={"any"}>Any time</MenuItem>
                  <MenuItem value={"morning"}>Morning</MenuItem>
                  <MenuItem value={"afternoon"}>Afternoon</MenuItem>
                  <MenuItem value={"evening"}>Evening</MenuItem>
                  <MenuItem value={"night"}>Night</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <LoadingButton
              fullWidth
              size="large"
              variant="contained"
              loading={loading}
              sx={{
                mt: 5,
              }}
              onClick={handleSubmit}
            >
              Set goal
              <Icon
                sx={{
                  marginLeft: "auto",
                }}
              >
                rocket_launch
              </Icon>
            </LoadingButton>
          </Box>
        </Box>
      </SwipeableDrawer>
      <Button
        onClick={() => setOpen(true)}
        sx={{ transition: "none", mb: 2, ml: 5 }}
        size="small"
        disableRipple
      >
        Create blank goal
        <Icon className="outlined">add_circle</Icon>
      </Button>
    </>
  );
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 1 }}>{children}</Box>}
    </div>
  );
}

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function ExploreGoals({ setOpen, mutationUrl }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [loading, setLoading] = React.useState(false);

  return (
    <div
      style={{
        background: global.user.darkMode ? "hsl(240,11%,15%)" : "white",
      }}
    >
      <Box
        sx={{
          background: global.user.darkMode
            ? "url(https://i.ibb.co/L0MZ0tt/image.png)"
            : `linear-gradient(45deg, #E177D5 0%, #FFA655 100%)`,
          backgroundSize: "cover",
          color: global.user.darkMode ? "#fff" : "#000",
          p: 4,
          mt: "-64px",
          minHeight: "350px",
          display: "flex",
        }}
      >
        <Box
          sx={{
            mt: "auto",
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 2, fontWeight: "900" }}
            className="underline"
          >
            Set a new goal
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            With Dysperse Coach, anything is possible. Set a goal and we&apos;ll
            help you achieve it by adding small steps to enrich your daily
            routine.
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: { xs: 3, sm: 5 } }}>
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 0,
              height: "auto",
              "& .MuiTabs-scrollButtons.Mui-disabled": {
                opacity: 0.3,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                minWidth: 72,
                borderRadius: 3,
                minHeight: 20,
                maxHeight: 20,
                height: 20,
                py: 2,
                "&.Mui-selected *": {
                  fontWeight: "600!important",
                },
              },
              "& .MuiTabs-indicator": {
                height: "100%",
                borderRadius: 3,
                opacity: 0.1,
              },
            }}
          >
            {categories.map((tab, index) => (
              <Tab
                disableRipple
                label={tab}
                {...a11yProps(index)}
                key={index.toString()}
              />
            ))}
          </Tabs>
        </Box>
        {categories.map((tab, index) => (
          <TabPanel value={value} index={index} key={index.toString()}>
            <Masonry
              spacing={0}
              columns={{ xs: 1, sm: 2, md: 3 }}
              sx={{ mt: 2 }}
            >
              {goals
                .filter((goal) => goal.category === tab)
                .map((goal) => (
                  <Box sx={{ p: 1 }} key={goal.name}>
                    <Box
                      onClick={async () => {
                        setLoading(true);
                        try {
                          await fetchApiWithoutHook("user/routines/create", {
                            name: goal.name,
                            stepName: goal.stepName,
                            category: goal.category,
                            durationDays: goal.durationDays,
                            time: goal.time,
                          });
                          setLoading(false);
                          await mutate(mutationUrl);
                          setOpen(false);
                        } catch (e) {
                          setLoading(false);
                          toast.error(
                            "An error occurred while trying to set your goal. Please try again."
                          );
                        }
                      }}
                      sx={{
                        ...(loading && {
                          pointerEvents: "none",
                          opacity: 0.5,
                        }),
                        background: global.user.darkMode
                          ? "hsl(240,11%,20%)"
                          : "rgba(200,200,200,.3)",
                        borderRadius: 5,
                        p: 2,
                        cursor: "pointer",
                        transition: "all .1s ease-in-out",
                        "&:active": {
                          transform: "scale(.98)",
                        },
                        userSelect: "none",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{ fontWeight: "600" }}
                        >
                          {goal.name}
                        </Typography>
                        <Typography variant="body2">
                          {goal.description}
                        </Typography>
                      </Box>
                      <span
                        className="material-symbols-rounded"
                        style={{
                          marginLeft: "auto",
                        }}
                      >
                        arrow_forward
                      </span>
                    </Box>
                  </Box>
                ))}
            </Masonry>
          </TabPanel>
        ))}
      </Box>
      <CreateGoal mutationUrl={mutationUrl} />
      <Button
        href="/feedback"
        target="_blank"
        sx={{ transition: "none", mb: 2, ml: 5 }}
        size="small"
        disableRipple
      >
        Have another goal in mind? Suggest it!
        <Icon>arrow_forward</Icon>
      </Button>
    </div>
  );
}
