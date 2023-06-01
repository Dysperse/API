import { fetchRawApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Slider,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useDeferredValue, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";

export function CreateGoal({ mutationUrl }) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [days, setDays] = useState<number>(60);
  const [title, setTitle] = useState<string>("");

  const deferredTitle = useDeferredValue(title);
  const titleRef: any = React.useRef();
  const descriptionRef: any = React.useRef();
  const goalStepName: any = React.useRef();

  const handleSubmit = async () => {
    if (!deferredTitle.trim()) {
      toast.error("Goal must have a name", toastStyles);
      return;
    }
    if (!goalStepName.current.value) {
      toast.error("Goal must have a step name.", toastStyles);
      return;
    }
    setLoading(true);

    try {
      await fetchRawApi("user/coach/goals/create", {
        name: deferredTitle,
        stepName: goalStepName.current.value,
        category: "Any",
        durationDays: days,
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

  const [validationData, setValidationData] = useState<
    null | "loading" | { [key: string]: string | boolean }
  >(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (deferredTitle) {
        setValidationData("loading");
        const data: any = await fetchRawApi("/ai/goalValidation", {
          name: deferredTitle,
          duration: days,
        });
        setValidationData(data);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [deferredTitle, days]);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          sx: {
            height: "100vh",
            width: "100vw",
            maxWidth: "100vw",
            borderRadius: 0,

            "& .MuiSlider-rail": {
              background: `hsl(240,11%,${session.user.darkMode ? 10 : 80}%)`,
            },
            "& .MuiSlider-rail, & .MuiSlider-track": {
              height: 20,
              width: "calc(100% + 5px)",
              overflow: "hidden",
            },
            "& .MuiSlider-track": {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
            "& .MuiSlider-thumb": {
              boxShadow: 0,
              background: `hsl(240,11%,${session.user.darkMode ? 10 : 90}%)`,
              border: "4px solid currentColor",
            },
          },
        }}
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
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField
                multiline
                value={title}
                onChange={(e) => setTitle(e.target.value.replaceAll("\n", ""))}
                variant="outlined"
                placeholder="Learn Spanish"
                InputProps={{
                  className: "font-heading",
                  sx: {
                    fontSize: "50px",
                  },
                }}
                margin="dense"
              />
              <TextField
                multiline
                rows={3}
                inputRef={descriptionRef}
                label="Add a note"
                placeholder="Speak Spanish for 10 minutes, every day"
                margin="dense"
              />
              <TextField
                inputRef={goalStepName}
                margin="dense"
                label="Goal step name"
                placeholder="Practice for 30 minutes today"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon className="outlined">check_circle</Icon>
                    </InputAdornment>
                  ),
                }}
              />

              <Slider
                aria-label="Custom marks"
                defaultValue={60}
                min={7}
                value={days}
                onChange={(_, newValue: any) => setDays(newValue)}
                max={365}
                step={null}
                valueLabelDisplay="auto"
                marks={[7, 14, 30, 60, 90, 120, 150, 180, 365].map((value) => ({
                  value,
                }))}
              />
              {dayjs().add(days, "day").fromNow()}
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 3,
                  background: `hsl(240,11%,${
                    session.user.darkMode ? 20 : 95
                  }%)`,
                  borderRadius: 5,
                }}
              >
                <Typography className="font-heading" variant="h4" gutterBottom>
                  When setting a goal...
                </Typography>
                <Typography>
                  Keep these in mind when setting a goal...
                  <ul>
                    <li>
                      <b>Specificity</b> &mdash; Your goal should be clear and
                      specific.
                    </li>
                    <li>
                      <b>Attainability</b> &mdash; Your goal should be realistic
                      and achievable
                    </li>
                    <li>
                      <b>Time-bound</b> &mdash; Set an appropriate deadline, so
                      you have a sense of urgency and can prioritize your
                      efforts.
                    </li>
                  </ul>
                </Typography>
              </Box>
              {validationData == "loading" && (
                <Alert
                  icon={<CircularProgress />}
                  sx={{
                    mt: 2,
                    background: `hsl(240,11%,${
                      session.user.darkMode ? 20 : 95
                    }%)`,
                    color: `hsl(240,11%,${session.user.darkMode ? 90 : 10}%)`,
                  }}
                >
                  Making sure this goal makes sense...
                </Alert>
              )}
              {validationData && typeof validationData == "object" && (
                <Alert
                  sx={{ mt: 2 }}
                  severity={
                    validationData.sensible
                      ? "success"
                      : (validationData?.suggestion || "")
                          .toString()
                          .toLowerCase()
                          .includes("nsfw") || validationData.error
                      ? "error"
                      : "warning"
                  }
                >
                  <Typography sx={{ fontWeight: 700 }}>
                    {validationData?.suggestion || ""
                      ? "This goal looks good!"
                      : validationData.error
                      ? "Couldn't check your goal"
                      : (validationData?.suggestion || "")
                          .toString()
                          .toLowerCase()
                          .includes("nsfw")
                      ? "Sorry, but I won't help."
                      : "Does this goal really make sense?"}
                  </Typography>
                  {validationData.error
                    ? "Please try again later"
                    : (validationData?.suggestion || "")
                        .toString()
                        .toLowerCase()
                        .includes("nsfw")
                    ? "Dysperse AI will not assist you in NSFW topics. Please set another goal."
                    : validationData?.suggestion || ""}
                </Alert>
              )}
            </Grid>
          </Grid>
        </Box>
      </SwipeableDrawer>
      <Box
        onClick={() => setOpen(true)}
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
            transition: "none",
            transform: "scale(.98)",
          },
          userSelect: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: "600" }}>Blank goal</Typography>
          <Typography variant="body2">Set a new goal from scratch</Typography>
        </Box>
        <Icon
          sx={{
            ml: "auto",
          }}
        >
          add
        </Icon>
      </Box>
    </>
  );
}
