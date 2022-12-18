import Masonry from "@mui/lab/Masonry";
import { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { categories, goals } from "./goalTemplates";

import {
  AppBar,
  Box,
  Button,
  FormControl,
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

function CreateGoal() {
  const [open, setOpen] = React.useState(false);

  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
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
            backgroundColor: "hsl(240,11%,70%)",
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
              background: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,0))",
              zIndex: 1,
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
                <span className="material-symbols-rounded">west</span>
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
                <span className="material-symbols-rounded">more_horiz</span>
              </IconButton>
            </Toolbar>
          </AppBar>

          <Box sx={{ p: 5 }}>
            <TextField
              variant="filled"
              autoComplete="off"
              label="Goal name"
              fullWidth
              margin="dense"
            />
            <TextField
              variant="filled"
              multiline
              rows={4}
              autoComplete="off"
              label="Add a description"
              fullWidth
              margin="dense"
            />
            <TextField
              variant="filled"
              autoComplete="off"
              margin="dense"
              label="Goal duration (in days)"
              fullWidth
            />
            <TextField
              variant="filled"
              autoComplete="off"
              margin="dense"
              label="Goal step name"
              helperText="e.g. Meditate Today"
              fullWidth
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="demo-simple-select-label">Time of day</InputLabel>
              <Select
                margin="dense"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
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
            <Button
              fullWidth
              size="large"
              variant="outlined"
              sx={{
                mt: 5,
                gap: 2,
                borderWidth: "2px!important",
              }}
            >
              Set goal
              <span
                className="material-symbols-rounded"
                style={{
                  marginLeft: "auto",
                }}
              >
                rocket_launch
              </span>
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
      <Button
        onClick={() => setOpen(true)}
        sx={{ gap: 2, transition: "none", mb: 2, ml: 5 }}
        size="small"
        disableRipple
      >
        Create blank goal
        <span className="material-symbols-rounded">arrow_forward</span>
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
          background: `linear-gradient(45deg, #E177D5 0%, #FFA655 100%)`,
          color: "#000",
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
            With Carbon Coach, anything is possible. Set a goal and we&apos;ll
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
                          className="font-secondary"
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
      <CreateGoal />
      <Button
        href="/feedback"
        target="_blank"
        sx={{ gap: 2, transition: "none", mb: 2, ml: 5 }}
        size="small"
        disableRipple
      >
        Have another goal in mind? Suggest it!
        <span className="material-symbols-rounded">arrow_forward</span>
      </Button>
    </div>
  );
}
