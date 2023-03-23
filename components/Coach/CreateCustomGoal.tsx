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
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchRawApi } from "../../lib/client/useApi";
import { toastStyles } from "../../lib/client/useTheme";
import { useSession } from "../../pages/_app";

export function CreateGoal({ mutationUrl }) {
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
      await fetchRawApi("user/routines/create", {
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
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
      >
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
              <Icon>expand_more</Icon>
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
              <InputLabel id="demo-simple-select-label">Time of day</InputLabel>
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
      </SwipeableDrawer>
      <Button
        onClick={() => setOpen(true)}
        id="createBlankGoalTrigger"
        sx={{ transition: "none", ml: "auto" }}
        size="small"
        variant="contained"
        disableRipple
      >
        <Icon className="outlined">add</Icon>
        Blank goal
      </Button>
    </>
  );
}
