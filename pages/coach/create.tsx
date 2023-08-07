import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Button,
  Icon,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";

export default function CreateGoal() {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const isMobile = useMediaQuery("(min-width: 600px)");

  const steps = [
    { type: "text", name: "What's your goal?", id: "name" },
    { type: "text", name: "Set a name for your daily task", id: "stepName" },
    {
      type: "number",
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
    const { id, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  return (
    <>
      <AppBar sx={{ position: "fixed", left: 0, top: 0 }}>
        <Toolbar>
          {currentStep > 0 && (
            <IconButton onClick={() => setCurrentStep(currentStep - 1)}>
              <Icon>arrow_back_ios_new</Icon>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <div style={{ marginTop: "64px", padding: "16px" }}>
        <Typography variant="h4">{steps[currentStep].name}</Typography>

        {steps[currentStep].type === "text" && (
          <TextField
            label={steps[currentStep].name}
            variant="outlined"
            fullWidth
            id={steps[currentStep].id}
            value={formData[steps[currentStep].id] || ""}
            onChange={handleInputChange}
          />
        )}

        {steps[currentStep].type === "number" && (
          <TextField
            label={steps[currentStep].name}
            variant="outlined"
            type="number"
            fullWidth
            id={steps[currentStep].id}
            value={formData[steps[currentStep].id] || ""}
            onChange={handleInputChange}
          />
        )}

        {/* Handle other input types (e.g., checkboxes) as needed */}

        <Button
          variant="contained"
          color="primary"
          onClick={handleNextStep}
          style={{ marginTop: "16px" }}
        >
          {currentStep === steps.length - 1 ? "Create Goal" : "Next"}
        </Button>
      </div>
    </>
  );
}
