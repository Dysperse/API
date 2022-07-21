import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SwipeableViews from "react-swipeable-views";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as colors from "@mui/material/colors";
import { CustomRooms } from "../components/onboarding/customRooms";
import { InventoryList } from "../components/onboarding/InventoryList";
import { Color } from "../components/onboarding/Color";

const AutoPlaySwipeableViews = SwipeableViews;

function SwipeableTextMobileStepper() {
  const [themeColor, setThemeColor] = React.useState("brown");
  const [mode, setMode] = React.useState<"dark" | "light">("light");

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
            What's your favorite color?
          </Typography>
          <Color setThemeColor={setThemeColor} color="red" />
          <Color setThemeColor={setThemeColor} color="green" />
          <Color setThemeColor={setThemeColor} color="blue" />
          <Color setThemeColor={setThemeColor} color="pink" />
          <Color setThemeColor={setThemeColor} color="purple" />
          <Color setThemeColor={setThemeColor} color="orange" />
          <Color setThemeColor={setThemeColor} color="teal" />
          <Color setThemeColor={setThemeColor} color="cyan" />
          <Color setThemeColor={setThemeColor} color="brown" />
          <Typography variant="h6" sx={{ my: 3 }}>
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
          ></Box>
        </Box>
      ),
    },
    {
      content: (
        <Box sx={{ p: 5 }}>
          <Typography variant="h4" sx={{ mt: 6 }}>
            Creating your home
          </Typography>
          <Typography variant="h6" sx={{ my: 3 }}>
            If your house has a name, enter it below
          </Typography>
          <TextField
            value="My home"
            fullWidth
            variant="filled"
            sx={{ mt: 1 }}
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
          <CustomRooms />
        </Box>
      ),
    },
    {
      content: (
        <Box sx={{ p: 5, pb: 10 }}>
          <Typography variant="h4" sx={{ mt: 6 }}>
            Building your inventory
          </Typography>
          <Typography variant="h6" sx={{ my: 3, mt: 2 }}>
            Select any items you have
          </Typography>
          <InventoryList
            data={[
              { name: "Bed", icon: "bed" },
              { name: "Mug", icon: "coffee" },
              { name: "Fan", icon: "mode_fan" },
              { name: "Bathtub", icon: "bathtub" },
              { name: "Coffee maker", icon: "coffee_maker" },
              { name: "Fire Extinguisher", icon: "fire_extinguisher" },
              { name: "Remote", icon: "remote_gen" },
              { name: "Grill", icon: "outdoor_grill" },
              { name: "Iron", icon: "iron" },
              { name: "Desk", icon: "desk" },
              { name: "Umbrella", icon: "umbrella" },
              { name: "Kettle", icon: "kettle" },
              { name: "Blanket", icon: "blanket" },
              { name: "Crib", icon: "crib" },
              { name: "Couch", icon: "weekend" },
              { name: "Car", icon: "directions_car" },
              { name: "Bike", icon: "directions_bike" },
              { name: "Lightbulb", icon: "lightbulb" },
              { name: "Helmet", icon: "sports_motorsports" },
              { name: "Soccer ball", icon: "sports_soccer" },
              { name: "Grill", icon: "outdoor_grill" },
              { name: "Microwave", icon: "microwave" },
              { name: "Laptop", icon: "laptop" },
              { name: "Game controller", icon: "sports_esports" },
              { name: "Phone", icon: "smartphone" },
              { name: "Tablet", icon: "tablet" },
              { name: "Headphones", icon: "headphones" },
              { name: "Mouse", icon: "mouse" },
              { name: "Keyboard", icon: "keyboard" },
              { name: "Router", icon: "router" },
              { name: "Printer", icon: "print" },
              { name: "TV", icon: "home_max" },
              { name: "Speaker", icon: "speaker" },
              { name: "Table lamp", icon: "table_lamp" },
              { name: "Ladder", icon: "tools_ladder" },
              { name: "Tent", icon: "camping" },
            ]}
          />
        </Box>
      ),
    },
  ];

  const maxSteps = images.length;

  return (
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
              key={index}
            >
              {step.content}
            </Box>
          ))}
        </AutoPlaySwipeableViews>
        <MobileStepper
          steps={maxSteps}
          sx={{
            position: "fixed",
            background: colors[themeColor][mode === "dark" ? "900" : "100"],
            bottom: 0,
          }}
          activeStep={activeStep}
          nextButton={
            <Button
              size="large"
              sx={{
                mt: 2,
                transition: "opacity .2s",
                transitionDelay: ".2s",
                ...(activeStep === 0 && {
                  opacity: 0,
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
                  mt: 2,
                  transition: "opacity .2s",
                  transitionDelay: ".2s",
                  ...(activeStep === 0 && {
                    opacity: 0,
                    pointerEvents: "none",
                  }),
                }}
                variant="contained"
                onClick={handleBack}
              >
                <span
                  className="material-symbols-rounded"
                  style={{ marginRight: "10px" }}
                >
                  chevron_left
                </span>
                Back
              </Button>
            </>
          }
        />
      </Box>
    </ThemeProvider>
  );
}

export default SwipeableTextMobileStepper;
