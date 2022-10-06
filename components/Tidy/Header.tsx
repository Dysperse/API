import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { colors } from "../../lib/colors";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Puller } from "../Puller";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useFormik } from "formik";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import { styled } from "@mui/material/styles";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import AutoHeight from "embla-carousel-auto-height";
import { Select } from "@mui/material";
import { fetchApiWithoutHook } from "../../hooks/useApi";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: colors[themeColor ?? "brown"][900],
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: colors[themeColor ?? "brown"][900],
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark"
        ? theme.palette.grey[800]
        : colors[themeColor][100],
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color:
      theme.palette.mode === "dark"
        ? theme.palette.grey[700]
        : colors[themeColor][200],
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: colors[themeColor ?? "brown"][900],
    }),
    "& .QontoStepIcon-completedIcon": {
      color: colors[themeColor ?? "brown"][900],
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      marginLeft: "10px",
      backgroundColor: "currentColor",
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <span
          className="material-symbols-rounded"
          style={{
            color: colors[themeColor ?? "brown"][900],
          }}
        >
          check
        </span>
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

function CreateModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({}, [
    WheelGesturesPlugin(),
    AutoHeight(),
  ]);
  const moveNext = () => emblaApi?.scrollNext();
  // On scroll, set step to current slide
  emblaApi?.on("scroll", () => {
    setStep(emblaApi?.selectedScrollSnap());
  });
  useStatusBar(open);
  const formik = useFormik({
    initialValues: {
      name: "",
      repeat: "weekly",
      on: "friday",
    },
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      fetchApiWithoutHook("property/tidy/create", {
        name: values.name,
        frequency: values.repeat,
        on: values.on,
        lastDone: new Date().toISOString(),
      });
    },
  });

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        disableRipple
        size="large"
        color="inherit"
        sx={{
          "&:active": {
            background: colors[themeColor][900],
          },
          transition: "none",
        }}
      >
        <span className="material-symbols-rounded">add</span>
      </IconButton>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          sx: {
            background: colors[themeColor][50],
            borderRadius: "20px 20px 0 0",
            boxShadow: "none",
            maxWidth: "500px",
            mx: "auto",
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 3, mt: 3 }}>
          <Stepper
            activeStep={step}
            connector={<QontoConnector />}
            alternativeLabel
          >
            {["Details", "Frequency"].map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={formik.handleSubmit}>
            <div className="embla" ref={emblaRef} style={{ height: "auto" }}>
              <div
                className="embla__container"
                style={{
                  height: "auto",
                  alignItems: "flex-start",
                  transition: "height .2s",
                }}
              >
                <Box className="embla__slide" sx={{ p: 2, height: "auto" }}>
                  <TextField
                    required
                    fullWidth
                    label="Reminder"
                    placeholder="Throw out the trash"
                    disabled={emblaApi?.selectedScrollSnap() !== 0}
                    variant="filled"
                    name="name"
                    autoComplete="off"
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    disableElevation
                    size="large"
                    sx={{ mt: 2, borderRadius: 99 }}
                    type="button"
                    onClick={moveNext}
                  >
                    Next
                  </Button>
                </Box>
                <Box className="embla__slide" sx={{ p: 2, height: "auto" }}>
                  <Typography>
                    Repeat{" "}
                    <Select
                      label="Repeat"
                      disabled={emblaApi?.selectedScrollSnap() !== 1}
                      size="small"
                      variant="standard"
                      value={formik.values.repeat}
                      onChange={formik.handleChange}
                      name="repeat"
                    >
                      <MenuItem value="weekly">weekly</MenuItem>
                      <MenuItem value="monthly">monthly</MenuItem>
                      <MenuItem value="every 6 months">every 6 months</MenuItem>
                      <MenuItem value="yearly">yearly</MenuItem>
                    </Select>{" "}
                    {formik.values.repeat === "monthly" ? "on the" : "on"}{" "}
                    <Select
                      label="Repeat"
                      disabled={emblaApi?.selectedScrollSnap() !== 1}
                      size="small"
                      variant="standard"
                      value={formik.values.on}
                      onChange={formik.handleChange}
                      name="on"
                    >
                      {(formik.values.repeat === "monthly" ||
                      formik.values.repeat === "every 6 months"
                        ? ["the first week", "the last week"]
                        : formik.values.repeat === "yearly"
                        ? [
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
                          ]
                        : [
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                          ]
                      ).map((day) => (
                        <MenuItem value={day}>{day}</MenuItem>
                      ))}
                    </Select>
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    disableElevation
                    size="large"
                    sx={{ mt: 2, borderRadius: 99 }}
                    type="button"
                    onClick={() => formik.handleSubmit()}
                  >
                    Create
                  </Button>
                </Box>
              </div>
            </div>
          </form>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
/**
 * Bannner for maintenance, which shows upcoming tasks the current week
 * @param {any} {count}
 * @returns {JSX.Element}
 */
export function Header(): JSX.Element {
  return (
    <>
      <Box sx={{ p: { sm: 3 }, pt: { sm: 1 } }}>
        <Box
          sx={{
            width: "100%",
            background: colors[themeColor][800],
            color: `${colors[themeColor][100]}`,
            borderRadius: { sm: 5 },
            p: 3,
            display: "block",
            pt: 2,
            py: { sm: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                gutterBottom
                variant="h5"
                sx={{
                  fontWeight: "600",
                }}
              >
                Tidy
              </Typography>
              <Typography variant="body1">5 tasks this week</Typography>
            </Box>
            <Box sx={{ ml: "auto", color: "#fff" }}>
              <CreateModal />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
