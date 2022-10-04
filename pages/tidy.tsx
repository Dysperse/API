import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useState } from "react";
import { ErrorHandler } from "../components/ErrorHandler";
import { Header } from "../components/Tidy/Header";
import { useApi } from "../hooks/useApi";
import type { ApiResponse } from "../types/client";
import { Puller } from "../components/Puller";
import { colors } from "../lib/colors";

/**
 * Intro
 */
function Intro({ setStep }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            borderRadius: "20px 20px 0 0",
          },
        }}
      >
        <Puller />
        <Box
          sx={{
            p: 3,
            pt: 5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            Select a room
          </Typography>
          {[
            "Kitchen",
            "Bedroom",
            "Bathroom",
            "Garage",
            "Living Room",
            "Dining Room",
            "Laundry Room",
            "Storage Room",
            "Garden",
          ]}
        </Box>
      </SwipeableDrawer>

      <Box
        sx={{
          p: 3,
          background: "rgba(200,200,200,.3)",
          borderRadius: 5,
          textAlign: "center",
        }}
      >
        <picture>
          <img
            src="https://i.ibb.co/3vkN5kS/6a4b209a-ac5d-402a-9816-7bdaef7f2ce8.png"
            style={{
              maxWidth: "100%",
            }}
          />
        </picture>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Tidy
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Tidy is a tool to help you organize your home.
        </Typography>
        <Button
          size="large"
          variant="contained"
          sx={{ borderRadius: 999, mt: 2 }}
          onClick={() => setOpen(true)}
          disableElevation
          fullWidth
        >
          Select a room to organize
        </Button>
      </Box>
    </>
  );
}
/**
 * Step content
 */
function StepContent({
  content,
  step,
  currentStep,
  setCurrentStep,
}: {
  content: JSX.Element;
  step: number;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) {
  return currentStep === step ? <Box>{content}</Box> : null;
}
/**
 * Top-level component for the maintenance page
 */
export default function Maintenance() {
  const { error, data }: ApiResponse = useApi("property/maintenance/reminders");

  const [step, setStep] = useState<number>(-1);

  return (
    <Box sx={{ mb: 4 }}>
      <Header step={step} setStep={setStep} />
      <Box sx={{ p: 3 }}>
        <StepContent
          content={<Intro setStep={setStep} />}
          step={-1}
          currentStep={step}
          setCurrentStep={setStep}
        />
      </Box>
    </Box>
  );
}
