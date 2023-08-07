import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRef, useState } from "react";

export default function CreateGoal() {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const isMobile = useMediaQuery("(min-width: 600px)");

  const numberRef: any = useRef();

  const steps = [
    {
      type: "text",
      name: "What's your goal",
      placeholder: "Throw the trash today",
      helperText: "You'll be reminded to do this",
      id: "stepName",
    },
    {
      type: "number",
      placeholder: "5 days",
      name: "How long do you want to work on this goal?",
      id: "stepDuration",
    },
    {
      type: "text",
      name: "What days do you want to work on this goal?",
      id: "stepDays",
    },
    {
      type: "number",
      name: "What time do you want to work on this goal?",
      id: "stepTime",
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Perform action to create goal using formData
      console.log("Form data:", formData);
    }
  };

  const handleInputChange = (event) => {
    let { id, type, value } = event.target;
    if (type === "number" && value < 1) return;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <AppBar sx={{ position: "fixed", left: 0, top: 0 }}>
        <Toolbar>
          <IconButton onClick={() => setCurrentStep(currentStep - 1)}>
            <Icon>arrow_back_ios_new</Icon>
          </IconButton>
        </Toolbar>
        <LinearProgress
          variant="determinate"
          value={((currentStep + 1) / (steps.length + 1)) * 100}
        />
      </AppBar>
      <Box
        sx={{
          width: "500px",
          mx: "auto",
          px: 5,
          maxWidth: "100vw",
        }}
      >
        <Typography variant="h2" className="font-heading" sx={{ mb: 1 }}>
          {steps[currentStep].name}
        </Typography>
        {steps[currentStep].helperText && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            {steps[currentStep].helperText}
          </Typography>
        )}

        {steps[currentStep].type === "text" && (
          <TextField
            placeholder={steps[currentStep].placeholder}
            variant="outlined"
            id={steps[currentStep].id}
            value={formData[steps[currentStep].id] || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: currentStep == 1 && (
                <InputAdornment position="start">
                  <Icon>check_circle</Icon>
                </InputAdornment>
              ),
            }}
          />
        )}

        {steps[currentStep].type === "number" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton
              disabled={formData[steps[currentStep].id] == 1}
              onClick={() =>
                setFormData((s) => ({
                  ...s,
                  [steps[currentStep].id]: formData[steps[currentStep].id] + 1,
                }))
              }
            >
              <Icon>remove_circle</Icon>
            </IconButton>
            <TextField
              inputRef={numberRef}
              variant="outlined"
              placeholder={steps[currentStep].placeholder}
              type="number"
              size="small"
              fullWidth
              defaultValue={7}
              id={steps[currentStep].id}
              value={formData[steps[currentStep].id] || ""}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">days</InputAdornment>
                ),
              }}
            />
            <IconButton
              onClick={() =>
                setFormData((s) => ({
                  ...s,
                  [steps[currentStep].id]: formData[steps[currentStep].id] + 1,
                }))
              }
            >
              <Icon>add_circle</Icon>
            </IconButton>
          </Box>
        )}

        {/* Handle other input types (e.g., checkboxes) as needed */}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleNextStep}
          disabled={
            formData[steps[currentStep].id]?.trim() === "" ||
            formData[steps[currentStep].id] === 0
          }
          style={{ marginTop: "16px" }}
        >
          {currentStep === steps.length - 1 ? "Create Goal" : "Next"}
        </Button>
      </Box>
    </Box>
  );
}
