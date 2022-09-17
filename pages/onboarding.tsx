import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import MobileStepper from "@mui/material/MobileStepper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import SwipeableViews from "react-swipeable-views";
import { cards } from "../components/AddPopup/cards";
import { Color } from "../components/onboarding/Color";
import { CustomRooms } from "../components/onboarding/customRooms";
import { InventoryList } from "../components/onboarding/InventoryList";
import { updateSettings } from "../components/Settings/updateSettings";
import { colors } from "../lib/colors";
const AutoPlaySwipeableViews = SwipeableViews;

/**
 * Top-level component for the onboarding page.
 */
function SwipeableTextMobileStepper() {
  const [houseType, setHouseType] = React.useState<string>("home");
  const [themeColor, setThemeColor] = React.useState("brown");
  const [mode] = React.useState<"dark" | "light">("light");

  const userTheme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: colors[themeColor][mode === "light" ? "700" : "100"],
      },
    },
    components: {
      MuiPaper: {
        defaultProps: { elevation: 0 },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "15px",
            textTransform: "none",
            boxShadow: "none!important",
          },
        },
      },
    },
  });
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const images = [
    {
      content: (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Box sx={{ p: 5 }}>
            <Typography variant="h2" sx={{ mb: 2, mt: 6 }}>
              Welcome to Carbon!
            </Typography>
            <Typography variant="h6">
              Thanks for creating a Carbon account! Track your home inventory
              and expenses with ease.
            </Typography>

            <Button
              size="large"
              sx={{ mt: 2 }}
              variant="contained"
              onClick={handleNext}
            >
              Get started{" "}
              <span className="material-symbols-rounded">chevron_right</span>
            </Button>
          </Box>
        </Box>
      ),
    },

    {
      content: (
        <Box sx={{ p: 5 }}>
          <Typography variant="h4" sx={{ mb: 1, mt: 6 }}>
            Customize your Carbon
          </Typography>
          <Typography variant="h6" sx={{ my: 3 }}>
            What&apos;s your favorite color?
          </Typography>
          <Color
            handleNext={handleNext}
            setThemeColor={setThemeColor}
            color="red"
          />
          <Color
            handleNext={handleNext}
            setThemeColor={setThemeColor}
            color="green"
          />
          <Color
            handleNext={handleNext}
            setThemeColor={setThemeColor}
            color="blue"
          />
          <Color
            handleNext={handleNext}
            setThemeColor={setThemeColor}
            color="pink"
          />
          <Color
            handleNext={handleNext}
            setThemeColor={setThemeColor}
            color="purple"
          />
          <Color
            handleNext={handleNext}
            setThemeColor={setThemeColor}
            color="orange"
          />
          <Color
            handleNext={handleNext}
            setThemeColor={setThemeColor}
            color="teal"
          />
          <Color
            handleNext={handleNext}
            setThemeColor={setThemeColor}
            color="cyan"
          />
          <Color
            handleNext={handleNext}
            setThemeColor={setThemeColor}
            color="brown"
          />
          {/* <Typography variant="h6" sx={{ my: 3 }}>
            Select your appearance
          </Typography>
          <Box
            onClick={() => setMode("light")}
            sx={{
              width: 50,
              height: 50,
              borderRadius: 5,
              mr: 1,
              mt: 1,
              cursor: "pointer",
              display: "inline-block",
              background: colors["grey"]["100"],
            }}
          ></Box>{" "}
          <Box
            onClick={() => setMode("dark")}
            sx={{
              width: 50,
              height: 50,
              borderRadius: 5,
              mr: 1,
              mt: 1,
              cursor: "pointer",
              display: "inline-block",
              background: colors["grey"]["900"],
            }}
          ></Box> */}
        </Box>
      ),
    },
    {
      content: (
        <Box sx={{ p: 5, pb: 20 }}>
          <Typography variant="h4" sx={{ mt: 6 }}>
            Creating your home
          </Typography>
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
            What kind of property do you own?
          </Typography>
          <FormControl
            onChange={(e: any) => {
              setHouseType(e.target.value);
              updateSettings("type", e.target.value, false, () => {}, true);
            }}
          >
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="apartment"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="home"
                control={<Radio />}
                label="Single-family home"
              />
              <FormControlLabel
                value="apartment"
                control={<Radio />}
                label="Apartment"
              />
              <FormControlLabel value="dorm" control={<Radio />} label="Dorm" />
            </RadioGroup>
          </FormControl>
          <Typography variant="h6" sx={{ my: 3, mb: 1 }}>
            If your house has a name, enter it below
          </Typography>
          <TextField
            placeholder={"My " + houseType}
            fullWidth
            variant="filled"
            sx={{ mt: 1 }}
            onBlur={(e) => {
              updateSettings("name", e.target.value, false, null, true);
            }}
            InputProps={{
              sx: {
                pb: 2,
                height: "50px",
              },
            }}
          />
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
            Add some rooms
          </Typography>
          <CustomRooms houseType={houseType} />
        </Box>
      ),
    },
    {
      content: (
        <Box sx={{ p: 5, pb: 20 }}>
          <Typography variant="h4" sx={{ mt: 6 }}>
            Building your inventory
          </Typography>
          <Typography variant="h6" sx={{ my: 3, mt: 2 }}>
            Select any items you have
          </Typography>
          <InventoryList data={[...cards]} />
        </Box>
      ),
    },

    {
      content: (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Box sx={{ p: 5 }}>
            <Typography variant="h2" sx={{ mb: 2, mt: 6 }}>
              You&apos;re all set!
            </Typography>
            <Typography variant="h6">
              Click the button below to continue to your dashboard
            </Typography>

            <LoadingButton
              size="large"
              loading={loading}
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => {
                setLoading(true);
                updateSettings("onboardingComplete", "true", false, () => {
                  window.location.href = "/dashboard";
                });
              }}
            >
              Save &amp; Continue to my dashboard
              <span className="material-symbols-rounded">chevron_right</span>
            </LoadingButton>
          </Box>
        </Box>
      ),
    },
  ];

  const maxSteps = images.length;

  return global.user ? (
    <ThemeProvider theme={userTheme}>
      <Box
        sx={{
          position: "fixed",
          userSelect: "none",
          top: 0,
          left: 0,
          background: colors[themeColor][mode === "dark" ? "900" : "100"],
          height: "100vh",
          width: "100vw",
          ...(mode === "dark" && {
            color: "#fff",
          }),
        }}
      >
        <AutoPlaySwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {images.map((step, index) => (
            <Box
              sx={{
                height: "100vh",
              }}
              key={index.toString()}
            >
              {step.content}
            </Box>
          ))}
        </AutoPlaySwipeableViews>
        <MobileStepper
          steps={maxSteps}
          sx={{
            "& .MuiMobileStepper-dots": {
              display: "none",
            },
            transition: "all .2s",
            bottom: 0,
            ...((activeStep === 0 || activeStep === maxSteps - 1) && {
              bottom: "-50px",
            }),
            position: "fixed",
            background: "transparent",
            backdropFilter: "blur(10px)",
          }}
          activeStep={activeStep}
          nextButton={
            <Button
              size="large"
              sx={{
                transition: "opacity .2s",
                transitionDelay: ".2s",
                ...((activeStep === 0 || activeStep === maxSteps - 1) && {
                  pointerEvents: "none",
                }),
              }}
              variant="contained"
              onClick={handleNext}
            >
              Next
              <span
                className="material-symbols-rounded"
                style={{ marginLeft: "10px" }}
              >
                chevron_right
              </span>
            </Button>
          }
          backButton={
            <>
              <Button
                size="large"
                sx={{
                  transition: "opacity .2s",
                  transitionDelay: ".2s",
                  ...((activeStep === 0 || activeStep === maxSteps - 1) && {
                    pointerEvents: "none",
                  }),
                  px: 1.5,
                  minWidth: "auto",
                }}
                variant="contained"
                onClick={handleBack}
              >
                <span className="material-symbols-rounded">chevron_left</span>
              </Button>
            </>
          }
        />
      </Box>
    </ThemeProvider>
  ) : (
    <></>
  );
}

export default SwipeableTextMobileStepper;
