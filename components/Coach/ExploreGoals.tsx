import Masonry from "@mui/lab/Masonry";
import { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../lib/client/useApi";
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
import Image from "next/image";
import { toastStyles } from "../../lib/client/useTheme";
import { useSession } from "../../pages/_app";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CreateGoal({ mutationUrl }) {
  const [open, setOpen] = React.useState<boolean>(false);

  const [time, setTime] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setTime(event.target.value as string);
  };
  const [loading, setLoading] = React.useState<boolean>(false);

  const titleRef: any = React.useRef();
  const descriptionRef: any = React.useRef();
  const durationRef: any = React.useRef();
  const goalStepName: any = React.useRef();

  const handleSubmit = async () => {
    if (!titleRef.current.value) {
      toast.error("Goal must have a name", toastStyles);
      return;
    }
    if (!goalStepName.current.value) {
      toast.error("Goal must have a step name.", toastStyles);
      return;
    }
    if (
      !durationRef.current.value ||
      parseInt(durationRef.current.value) > 100 ||
      parseInt(durationRef.current.value) < 10
    ) {
      toast.error("Goal must be between 10 and 100 days", toastStyles);
      return;
    }
    if (!time) {
      toast.error("Goal must have a time", toastStyles);
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
      toast.success("Created goal!", toastStyles);
    } catch (e) {
      setLoading(false);
      toast.error(
        "An error occurred while trying to set your goal. Please try again.",
        toastStyles
      );
    }
  };
  const session = useSession();

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
            ...(session.user.darkMode && {
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
              zIndex: 10,
              background: "transparent",
              color: session.user.darkMode ? "#fff" : "hsl(240,11%,5%)",
            }}
            position="sticky"
          >
            <Toolbar sx={{ height: "64px" }}>
              <IconButton color="inherit" onClick={() => setOpen(false)}>
                <Icon>west</Icon>
              </IconButton>
              <Typography sx={{ mx: "auto", fontWeight: "600" }}>
                Create goal
              </Typography>
              <IconButton
                color="inherit"
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
        id="createBlankGoalTrigger"
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
      {...other}
    >
      {value === index && <Box sx={{ py: 1 }}>{children}</Box>}
    </div>
  );
}

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
  };
}

export default function ExploreGoals({ setOpen, mutationUrl }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [loading, setLoading] = React.useState<boolean>(false);
  const session = useSession();

  return (
    <div
      style={{
        background: session.user.darkMode ? "hsl(240,11%,15%)" : "",
      }}
    >
      <Box
        sx={{
          color: "#fff",
          p: 4,
          position: "relative",
          mt: "-64px",
          minHeight: { xs: "400px", sm: "450px" },
          display: "flex",
        }}
      >
        <Image
          placeholder="blur"
          blurDataURL="data:image/png;base64,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"
          src="/images/goals-header.png"
          height={1080}
          width={1920}
          alt="Achievement banner"
          style={{
            height: "100%",
            width: "100%",
            filter: "brightness(0.5)",
            position: "absolute",
            top: 0,
            left: 0,
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            zIndex: 1,
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
                            "An error occurred while trying to set your goal. Please try again.",
                            toastStyles
                          );
                        }
                      }}
                      sx={{
                        ...(loading && {
                          pointerEvents: "none",
                          opacity: 0.5,
                        }),
                        background: session.user.darkMode
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
                        <Typography sx={{ fontWeight: "600" }}>
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
                        east
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
        <Icon>east</Icon>
      </Button>
    </div>
  );
}
